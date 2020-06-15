import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Overlay } from 'react-native-elements';
import { User } from '../../models/User';
import AppRoute from '../../resources/appRoute';
import colors from '../../resources/colors';
import styles from '../../resources/styles';
import { signUpWithEmailAndPassword } from '../../services/LoginService';


const Signup = (props) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState();
    const [canSignUp, setCanSignUp] = useState(false);
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        let _canSignUp = email.trim().length > 0 && password.trim().length > 0 &&
            name.trim().length > 0 && !isLoading;
        if (canSignUp !== _canSignUp) {
            setCanSignUp(_canSignUp);
        }
    }, [name, email, password, isLoading]);


    handleSignUp = () => {
        const user = new User(email, password, name)
        signUpWithEmailAndPassword(user)
            .then((response) => {
                setMessage(response.data.message);
            }).catch((error) => {
                setMessage(error.response.data.message);
            });
    }

    navigateToLogin = () => {
        props.navigation.navigate(AppRoute.Login);
    }

    clearFields = () => {
        setEmail('');
        setPassword('');
        setName('');
    }

    var overlayView =
        <React.Fragment>

            <Overlay
                isVisible={isLoading}
                windowBackgroundColor="rgba(255, 255, 255, .5)"
                overlayBackgroundColor={colors.white}
                height={200}>
                <View style={{ height: 100, width: 100 }}>
                    <ActivityIndicator size="large" style={{ marginTop: 30 }} color="#0000ff" />
                    <Text style={[styles.textSubHeading, { flexShrink: 1, alignSelf: 'center', marginVertical: 4 }]}>Saving</Text>
                </View>
            </Overlay>
        </React.Fragment>;

    let errorView = message ? <Text style={{ color: colors.textColorError }}>{message}</Text> : null;

    let view = <React.Fragment>
        <TextInput
            style={styles.inputBox}
            value={name}
            onChangeText={(name) => setName(name)}
            placeholder='Name'
            autoCapitalize='words'

        />
        <TextInput
            style={styles.inputBox}
            value={email}
            onChangeText={(email) => setEmail(email)}
            placeholder='Email'
            autoCapitalize='none'
        />
        <TextInput
            style={styles.inputBox}
            value={password}
            onChangeText={(password) => setPassword(password)}
            placeholder='Password'
            secureTextEntry={true}
        />


        {errorView}


        <TouchableOpacity
            style={canSignUp ? styles.button : styles.buttonDisabled}
            onPress={() => handleSignUp()}
            disabled={!canSignUp}
        >
            <Text style={canSignUp ? styles.buttonText : styles.buttonTextDisabled}>SignUp </Text>
        </TouchableOpacity>
        <View style={{ marginBottom: 20 }}>
            <Text> Already have an account?
        <Text onPress={() => props.navigation.navigate(AppRoute.Login)} style={styles.primaryText}> Login </Text>
            </Text>
        </View>
    </React.Fragment>

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps={'always'} keyboardDismissMode={'on-drag'}>
            <View style={styles.container}>
                <Image
                    source={require('../../assets/Note-Icon.png')}
                    style={{ width: 200, height: 200, marginBottom: 30 }}
                />
                {view}
                {overlayView}
            </View>
        </ScrollView>
    )
}

export default Signup

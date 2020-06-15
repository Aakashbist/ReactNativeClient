import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Overlay } from 'react-native-elements';
import AppRoute from '../../resources/appRoute';
import colors from '../../resources/colors';
import styles from '../../resources/styles';
import { signInWithEmailAndPassword } from '../../services/LoginService';



const Login = (props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState();
    const [canLogin, setCanLogin] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        let hasEmailAndPassword = email.trim().length > 0 && password.trim().length > 0;
        if (canLogin !== hasEmailAndPassword) {
            setCanLogin(hasEmailAndPassword);
        }
    }, [email, password]);

    handleLogin = async () => {
        setIsLoading(true)
        signInWithEmailAndPassword({ email, password }).then(() => {
            setIsLoading(false);
            props.navigation.navigate(AppRoute.NotesList)
        }).catch(err => {
            setIsLoading(false);
            setMessage(err.response.data.message);
        })
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
                    <Text style={[styles.textSubHeading, { flexShrink: 1, alignSelf: 'center', marginVertical: 4 }]}>Login</Text>
                </View>
            </Overlay>
        </React.Fragment>;
    let errorView = message ? <Text style={{ color: colors.textColorError }}>{message}</Text> : null;

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps={'always'} keyboardDismissMode={'on-drag'}>
            <View style={styles.container} >
                <Image
                    source={require('../../assets/Note-Icon.png')}
                    style={{ width: 200, height: 200, marginBottom: 30 }}
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
                {overlayView}
                <TouchableOpacity
                    style={canLogin ? styles.button : styles.buttonDisabled}
                    onPress={() => handleLogin()}
                    disabled={!canLogin}>
                    <Text style={canLogin ? styles.buttonText : styles.buttonTextDisabled}>Login </Text>
                </TouchableOpacity>
                <View style={{ marginBottom: 20 }}>
                    <Text> Don't have an account? <Text onPress={() => props.navigation.navigate(AppRoute.Signup)}
                        style={styles.primaryText}> Sign Up </Text></Text>
                </View>
            </View>
        </ScrollView>
    )
}

export default Login
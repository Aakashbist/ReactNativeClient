import { Container } from 'native-base';
import React, { useEffect, useState } from 'react';
import { Image, ProgressBarAndroid, ScrollView, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { Firebase } from '../../config/Firebase';
import { Overlay } from 'react-native-elements';
import AppRoute from '../../resources/appRoute';
import colors from '../../resources/colors';
import styles from '../../resources/styles';
import parseFirebaseError from '../errorParser/firebaseErrorParser';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import { User } from '../../models/User';

const SignupSteps = {
    SIGNUP: 0,
    SIGNUP_SUCCESS: 1
}



const Signup = (props) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState();
    const [step, setStep] = useState(SignupSteps.SIGNUP);
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
        setIsLoading(true);
        return axios.post('http://localhost:3000/api/user/register', user)
            .then(data => {

                setIsLoading(false);
                navigateToLogin();
            }).catch((error) => {
                setError(error.response.data.message);
                setIsLoading(false);
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

    let errorView = error ? <Text style={{ color: colors.textColorError }}>{error}</Text> : null;

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

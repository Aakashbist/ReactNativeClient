import React, { useEffect, useState } from 'react';
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { Firebase, getCurrentUser } from '../../config/Firebase';
import AppRoute from '../../resources/appRoute';
import colors from '../../resources/colors';
import styles from '../../resources/styles';
import parseFirebaseError from '../errorParser/firebaseErrorParser';
import { Overlay } from 'react-native-elements';
import axios from 'axios';
import { User } from '../../models/User';
import AsyncStorage from '@react-native-community/async-storage';
import { storeDataInAsyncStorage, getDataFromAsyncStorage } from '../../utils/asyncStorageHelper';


const Login = (props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState();
    const [canLogin, setCanLogin] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        let hasEmailAndPassword = email.trim().length > 0 && password.trim().length > 0;
        if (canLogin !== hasEmailAndPassword) {
            setCanLogin(hasEmailAndPassword);
        }
    }, [email, password]);

    handleLogin = async () => {
        // const user = new User(email, password)
        try {
            const user = await axios.post('http://localhost:3000/api/user/login', {
                email: email,
                password: password
            });
            storeDataInAsyncStorage("token", user.data.token);
        }
        catch (err) {
            return alert(err);
        }


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
    let errorView = error ? <Text style={{ color: colors.textColorError }}>{error}</Text> : null;

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
import AsyncStorage from '@react-native-community/async-storage';
import React, { useEffect } from 'react';
import { ActivityIndicator, Image, View } from 'react-native';
import AppRoute from '../../resources/appRoute';
import styles from '../../resources/styles';
import { getDataFromAsyncStorage } from '../../utils/asyncStorageHelper';

const AuthLoading = (props) => {
    useEffect(() => {
        currentAuthState();
    })




    currentAuthState = () => {
        getDataFromAsyncStorage("token").then((token) => {

            if (token) {
                props.navigation.navigate(AppRoute.Note);
            }
            else {
                props.navigation.navigate(AppRoute.Auth)
            }
        })
        //     Firebase.auth().onAuthStateChanged((user) => {
        //         if (user) {
        //             props.navigation.navigate(AppRoute.Note);

        //         }
        //         else {
        //             props.navigation.navigate(AppRoute.Auth)
        //         }
        //     });
    };

    return (
        <View style={styles.container}>
            <Image
                source={require('../../assets/Note-Icon.png')}
                style={{ width: 400, height: 400 }}
            />
            <ActivityIndicator style={{ marginTop: 30 }} />
        </View>
    );

}

export default AuthLoading
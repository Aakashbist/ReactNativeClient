import { storeDataInAsyncStorage } from "../utils/asyncStorageHelper";
import axios from "axios";

const url = 'http://localhost:3000/api/user';

export function signInWithEmailAndPassword(data) {
    return new Promise(async (resolve, reject) => {
        axios.post(`${url}/login`, data).then((user) => {
            storeDataInAsyncStorage("token", user.data.token);
            resolve();
        }).catch(error => {
            reject(error)
        })
    })
}

export function signUpWithEmailAndPassword(data) {
    return new Promise(async (resolve, reject) => {
        axios.post(`${url}/register`, data).then((response) => {
            resolve(response);
        }).catch(error => {
            reject(error)
        })
    })
}
import { getDataFromAsyncStorage } from "../utils/asyncStorageHelper";

export function axiosConfig(token) {
    alert(token + " axios config")
    return axios.create({
        baseURL: 'http://localhost:3000/api/',
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

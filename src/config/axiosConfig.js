
import axios from 'axios';
export function axiosConfig(token) {
    return axios.create({
        baseURL: 'http://localhost:3000/api/',
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}


import AsyncStorage from '@react-native-community/async-storage';
export function getDataFromAsyncStorage(key) {
    return new Promise((resolve, reject) => {
        AsyncStorage.getItem(key).then(data => resolve(data)).catch(err => reject(err));
    });
}

export async function storeDataInAsyncStorage(key, value) {
    try {
        await AsyncStorage.setItem(key, value)
    } catch (e) {
        // saving error
    }
}

export async function removeDataInAsyncStorage(key) {
    return new Promise((resolve, reject) => {
        AsyncStorage.removeItem(key).then(data => resolve(data)).catch(err => reject(err));
    });
}
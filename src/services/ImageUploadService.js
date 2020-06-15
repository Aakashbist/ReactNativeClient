import ImagePicker from 'react-native-image-picker';
import { getDataFromAsyncStorage } from '../utils/asyncStorageHelper';
import { axiosConfig } from '../config/axiosConfig';


function getUriBasedOnOS(uri) {
    const documentUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri
    return documentUri;
}

export function openDocumentPicker() {
    return new Promise((resolve, reject) => {
        try {

            ImagePicker.showImagePicker({ noData: true, mediaType: 'photo' }, (response) => {

                resolve(response)
            });
        } catch (err) {

            reject(err);
        }

    })
}

export async function uploadDocumentToNodeServer(data) {
    return new Promise(async (resolve, reject) => {
        const res = await getDataFromAsyncStorage("token");
        axiosConfig(res).post(`document`, data).then((res) => {
            resolve(res.data);
        }).catch(error => {
            alert(error)
            reject(error)
        })
    })
}
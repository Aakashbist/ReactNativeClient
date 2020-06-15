import axios from 'axios';
import { getDataFromAsyncStorage } from '../utils/asyncStorageHelper';
import { axiosConfig } from '../config/axiosConfig';



export async function createNotes(note) {
    return new Promise(async (resolve, reject) => {
        const res = await getDataFromAsyncStorage('token');
        axiosConfig(res).post("notes", note).then((result) => {
            resolve(result.data);
        }).catch(error => { reject(error); });
    })
}

export function getNotes() {
    return new Promise(async (resolve, reject) => {
        const res = await getDataFromAsyncStorage('token');
        axiosConfig(res).get("notes").then((result) => {
            resolve(result.data);
        }).catch(error => { reject(error); });
    })
}

export async function getNoteById(noteId) {
    return new Promise(async (resolve, reject) => {
        const res = await getDataFromAsyncStorage('token');
        axiosConfig(res).get(`notes/${noteId}`).then((result) => {
            resolve(result.data.post);
        }).catch(error => { reject(error) });
    })
}

export async function updateNote(note, noteId) {
    return new Promise(async (resolve, reject) => {
        const res = await getDataFromAsyncStorage('token');
        axiosConfig(res).put(`notes/${noteId}`, note).then((result) => {
            resolve(result.data);
        }).catch(error => { reject(error); });
    })
}

export async function deleteNotesWithId(noteId) {
    return new Promise(async (resolve, reject) => {
        const res = await getDataFromAsyncStorage('token');
        axiosConfig(res).delete(`notes/${noteId}`).then((result) => {
            resolve(result.data);
        }).catch(error => {
            reject(error);
        });
    })

}


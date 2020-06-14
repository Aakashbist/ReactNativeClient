import axios from 'axios';
import { getDataFromAsyncStorage } from '../utils/asyncStorageHelper';
import { axiosConfig } from '../config/axiosConfig';


const url = "https://us-central1-notes-1e004.cloudfunctions.net/notes"


export async function deleteNotesWithId(noteId) {
    try {
        const res = await axios.delete(`${url}/${noteId}`);

    }
    catch (error) {
        return alert(error);
    }

}

export async function getNoteById(noteId) {
    try {
        const result = await axios.get(`${url}/${noteId}`);

        return result.data;
    }
    catch (error) {
        return error;
    };
}
export function getNotes() {

    return new Promise(async (resolve, reject) => {
        const res = await getDataFromAsyncStorage('token');
        axiosConfig(res).get("/notes").then((result) => {
            resolve(result.data);
        }).catch(error => { reject(error); });
    })
}


export async function createNotes(note) {
    try {
        const notes = await axios.post(`${url}/`, note);
        return notes.data;
    }
    catch (error) {
        return error;
    }
}

export async function updateNote(note, noteId) {
    try {
        await axios.put(`${url}/${noteId}`, note);
    } catch (error) {
        return error;
    }
}


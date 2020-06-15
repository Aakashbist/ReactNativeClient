
import React, { useState, useEffect } from 'react';
import { ScrollView, View, FlatList, TouchableOpacity } from 'react-native';
import { Icon, Card, Text, Tooltip } from 'react-native-elements';
import { SafeAreaView } from 'react-navigation';
import AppRoute from '../../resources/appRoute';
import colors from '../../resources/colors';
import styles from '../../resources/styles';
import firebase, { Firebase } from '../../config/Firebase'
import { getNotes, deleteNotesWithId, getNoteById } from '../../services/NoteService';
import { getCurrentUser } from '../../config/Firebase';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
const Notes = (props) => {

    const [notes, setNotes] = useState([]);

    // const currentUser = getCurrentUser().uid;

    //load data initially
    useEffect(() => {

        loadNotes();
    }, [])

    //load data when navigating back
    useEffect(() => {
        props.navigation.addListener('didFocus', () => {
            loadNotes();
        })
    }, [])

    loadNotes = () => {
        getNotes().then((notes) => {
            setNotes(notes)
        }).catch(err => alert(err))

    }

    setNotesInState = (notesList) => {
        setNotes(notesList);
    }


    deleteNote = (noteId) => {
        Alert.alert(
            'Delete Note',
            'Are you sure want to delete this note ?',
            [
                { text: 'Cancel' },
                {
                    text: 'OK',
                    onPress: () => deleteNotesWithId(noteId).then((response) => {
                        Alert.alert(response.message);
                        loadNotes();
                    })
                        .catch(error => {
                            Alert.alert(error.response);
                        })
                },
            ],
            { cancelable: false }
        )
    }


    let view = notes == null ? <View style={{ flex: 1, justifyContent: "center", padding: 16 }}>
        <Text style={{ fontSize: 28 }}> Notes </Text>
        <Text style={{ fontSize: 18, marginTop: 16 }}> No available  Notes </Text>
    </View> :
        <React.Fragment>
            <FlatList
                style={[styles.cardContainer, {}]}
                data={notes}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <Card
                        image={{ uri: item.imageUrl }}>

                        <Text style={{ fontSize: 16 }}>{item.address}</Text>
                        <View style={styles.containerFlexRow}>
                            <Text style={{ flex: 1, fontSize: 16 }}>{item.description}</Text>
                            <TouchableOpacity
                                style={{ marginHorizontal: 4 }}
                                onPress={() => props.navigation.navigate(AppRoute.AddNotes,
                                    {
                                        key: item._id,
                                        mode: 'EDIT'
                                    })}
                            >
                                <Icon name='create' type='material' size={20} color={colors.primaryDark} />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{ marginHorizontal: 4 }}
                                onPress={() => deleteNote(item._id)}>
                                <Icon name='delete' type='material' size={20} color={colors.primary} />
                            </TouchableOpacity>

                        </View>

                    </Card>
                )}
            />
        </React.Fragment>


    return (
        <ScrollView style={{ flex: 1, backgroundColor: '#f4f4f4' }}
            keyboardShouldPersistTaps={'always'} keyboardDismissMode={'on-drag'}>
            <SafeAreaView>
                <View style={[styles.containerLeft, { paddingBottom: 16, flexDirection: 'column' }]} >
                    {view}
                </View>
            </SafeAreaView>
        </ScrollView>
    )
}


Notes.navigationOptions = (props) => ({
    title: 'Notes',
    headerStyle: {
        backgroundColor: colors.primary,
    },
    headerTintColor: colors.white,
    headerRight: () => (
        <View style={styles.containerFlexRow} >

            <Icon
                name='add'
                type='material'
                size={36}
                color={colors.white}
                onPress={() => props.navigation.navigate(AppRoute.AddNotes)} />


            <Icon
                name='close'
                tooltip="logout"
                type='material'
                size={30}
                color={colors.white}
                onPress={() => {
                    AsyncStorage.removeItem("token");
                    props.navigation.navigate(AppRoute.Login)

                }
                }
            />


        </View>

    ),
    headerLeftContainerStyle: {
        marginHorizontal: 16
    }
});
export default Notes



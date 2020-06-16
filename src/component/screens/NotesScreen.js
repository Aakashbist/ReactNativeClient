
import AsyncStorage from '@react-native-community/async-storage';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, ScrollView, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { Card, Icon, Text } from 'react-native-elements';
import { SafeAreaView } from 'react-navigation';
import AppRoute from '../../resources/appRoute';
import colors from '../../resources/colors';
import styles from '../../resources/styles';
import { deleteNotesWithId, getNotes } from '../../services/NoteService';
import { set } from 'react-native-reanimated';
const Notes = (props) => {

    const [notes, setNotes] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(4);
    const [next, setNext] = useState()
    const [previous, setPrevious] = useState()


    //load data initially
    useEffect(() => {
        loadNotes();
    }, [])

    loadNotes = () => {
        getNotes(page, limit).then((response) => {
            showLoadMore(response);
            setNotes(response.results)
        }).catch(err => alert(err))
    }

    setNotesInState = (notesList) => {
        setNotes(notesList);
    }
    handleLoadMore = () => {
        setPage(page + 1)
        getNotes(page + 1, limit).then((response) => {
            showLoadMore(response);
            setNotes([...notes, ...response.results])

        }).catch(err => alert(err))

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


    showLoadMore = (response) => {

        if (response.next) {
            setNext(true);
        }
        else {
            setNext(false);
        }
    }


    renderFooter = () => {
        return (
            <View>
                {next ?
                    <TouchableOpacity
                        style={[styles.button, { width: 50, alignSelf: 'center', marginVertical: 4 }]}
                        activeOpacity={0.9}
                        onPress={this.handleLoadMore}
                    >
                        <Text style={styles.buttonText}>Load More</Text>

                    </TouchableOpacity> : null}
            </View>
        );
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
                onEndReachedThreshold={0.5}
                onEndReached={() => handleLoadMore()}

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





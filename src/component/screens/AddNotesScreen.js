import React, { Fragment, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Icon, Overlay, SearchBar } from 'react-native-elements';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Notes } from '../../models/Notes';
import AppRoute from '../../resources/appRoute';
import colors from '../../resources/colors';
import styles from '../../resources/styles';
import { openDocumentPicker, uploadDocumentToNodeServer } from '../../services/ImageUploadService';
import { getGooglePlaceAutocomplete, getGooglePlaceDetails } from '../../services/mapService';
import { createNotes, getNoteById, updateNote } from '../../services/NoteService';
import parseMapApiError from '../errorParser/mapApiErrorParser';


const AddNotes = (props) => {
    const [latitude, setLatitude] = useState(0);
    const [longitude, setLongitude] = useState(0);
    const [destination, setDestination] = useState('');
    const [address, setAddress] = useState([]);
    const [description, setDescription] = useState('');
    const [error, setError] = useState();
    const [editMode, setEditMode] = useState(false);
    const [mapView, setMapView] = useState(false);
    const [predictions, setPrediction] = useState([]);
    const [canAddNotes, setCanAddNotes] = useState(false);
    const [imageFileName, setImageFileName] = useState();
    const [imageUri, setImageUri] = useState();
    const [noteKey, setNoteKey] = useState();
    const [isSaving, setIsSaving] = useState(false);
    const [photo, setPhoto] = useState();

    useEffect(() => {
        let _canAddNotes =
            imageUri !== undefined && !isSaving;
        if (canAddNotes !== _canAddNotes) {
            setCanAddNotes(_canAddNotes);
        }
    }, [description, imageUri, isSaving]);

    useEffect(() => {
        if (props.navigation.state.params) {
            const { key, mode } = props.navigation.state.params;
            getNotes(key, mode);
        }
    }, []);

    getNotes = (key, mode) => {
        getNoteById(key).then((res) => {
            setNoteFields(res, mode, key);
        }).catch((error) => console.log(error));
    };

    setNoteFields = (data, mode, key) => {
        if (mode === "EDIT") {
            setEditMode(true);
            setNoteKey(key);
            setAddress(data.address);
            setLatitude(data.lat);
            setLongitude(data.lng);
            setMapView(true);
            setImageUri(data.imageUrl);
            setDescription(data.description);
        }
    };

    onPredictionSelected = place => {
        setDestination(place.description);
        setAddress(place.description);
        setPrediction([]);
        loadCoordinatesByPlaceId(place.place_id);
    };

    onDestinationQueryChange = (destination) => {
        setDestination(destination);
        getGooglePlaceAutocomplete(destination)
            .then((json) => {
                if (json.status === "OK") {
                    setPrediction(json.predictions);
                } else {
                    let errorMessage = parseMapApiError(json);
                    Alert.alert(errorMessage);
                }
            })
            .catch(error => setError(error));
    };


    loadCoordinatesByPlaceId = (placeId) => {
        getGooglePlaceDetails(placeId)
            .then((json) => {
                if (json.status === "OK") {
                    setLatitude(json.result.geometry.location.lat);
                    setLongitude(json.result.geometry.location.lng);
                    setMapView(true);
                } else {
                    let errorMessage = parseMapApiError(json);
                    Alert.alert(errorMessage);
                }
            })
            .catch(error => setError(error));
    };

    chooseDocument = () => {
        openDocumentPicker().then((response) => {
            if (response.error) {
                setError(response.error);
            }
            else {
                setImageFileName(response.name);
                setImageUri(response.uri)

                const photo = {
                    uri: response.uri,
                    type: response.type,
                    name: `photo${response.name}`
                }
                setPhoto(photo)
            }
        })
            .catch(error => setError(error))
    }

    handleAddNotes = async () => {
        const data = new FormData();
        data.append("Images", photo)
        uploadDocumentToNodeServer(data)
            .then(url => {
                const notes = new Notes(address, description, url, latitude, longitude);
                createNotes(notes)
                    .then(() => {
                        props.navigation.navigate(AppRoute.NotesList)
                    }).catch(err => alert(JSON.stringify(err.response.data) + "  in catch"))
            }).catch(error => alert(error.response))

    }

    handleUpdateNotes = () => {
        let notes;
        notes = new Notes(address, description, imageUri, latitude, longitude);
        updateNote(notes, noteKey)
            .then(() => {
                props.navigation.navigate(AppRoute.NotesList)
            })
            .catch(error => {
                setError(error.response.data.message);
            })
    }

    const suggestionView = predictions.map(item =>
        <TouchableOpacity
            style={styles.suggestion}
            onPress={() => onPredictionSelected(item)}>
            <Icon name='room' type='material' size={36} color={colors.green} />
            <Text key={item.id} style={{ fontSize: 16 }}> {item.description}</Text>
        </TouchableOpacity >
    );

    var searchBarAndSuggestions = <View>
        <SearchBar
            placeholder="Type Here..."
            onChangeText={destination => onDestinationQueryChange(destination)}
            value={destination}
            lightTheme={true}
            platform="android"
        />
        {suggestionView}
    </View>;
    let errorView = error ? <Text style={{ color: colors.textColorError }}>{error}</Text> : null;

    var overlayView =
        <React.Fragment>

            <Overlay
                isVisible={isSaving}
                windowBackgroundColor="rgba(255, 255, 255, .5)"
                overlayBackgroundColor={colors.white}
                height={200}>
                <View style={{ height: 100, width: 100 }}>
                    <ActivityIndicator size="large" style={{ marginTop: 30 }} color="#0000ff" />
                    <Text style={[styles.textSubHeading, { flexShrink: 1, alignSelf: 'center', marginVertical: 4 }]}>Saving Notes</Text>
                </View>
            </Overlay>
        </React.Fragment>;

    var view = <View>
        {!editMode ? searchBarAndSuggestions : null}
        {mapView ?
            <View>
                <MapView
                    style={styles.map}
                    provider={PROVIDER_GOOGLE}
                    region={{
                        latitude: latitude,
                        longitude: longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421
                    }}
                    showsUserLocation={true}
                    showsCompass={true} >
                    <Marker coordinate={{ latitude: latitude, longitude: longitude }} />
                </MapView>

                <View style={[styles.containerLeft, { paddingHorizontal: 16 }]}>
                    <View style={{ marginVertical: 32, alignSelf: 'stretch', justifyContent: 'space-between', flexDirection: 'row' }}>
                        <Icon name='room' type='material' size={36} color={colors.secondary} iconStyle={{ marginEnd: 16 }} />
                        <Text style={[styles.textSubHeading, { flexShrink: 1 }]}>{address}</Text>
                    </View>
                    <TextInput
                        style={styles.inputBoxFull}
                        multiline={true}
                        value={description}
                        onChangeText={(description) => setDescription(description)}
                        placeholder='Description'
                        autoCapitalize='none'

                    />

                    {
                        imageUri &&
                        <Image source={{ uri: imageUri }} style={{ width: '100%', height: 100, resizeMode: 'contain' }} />
                    }


                    {editMode ?
                        <Fragment>
                            <TouchableOpacity
                                style={[canAddNotes ? styles.button : styles.buttonDisabled, { alignSelf: 'center' }]}
                                disabled={!canAddNotes}
                                onPress={() => handleUpdateNotes()}
                            >
                                <Text style={canAddNotes ? styles.buttonText : styles.buttonTextDisabled}>Update Notes </Text>
                            </TouchableOpacity>
                        </Fragment> :
                        <Fragment>
                            <TouchableOpacity
                                onPress={() => chooseDocument()}
                                style={{ justifyContent: 'flex-start', flexDirection: 'row', alignContent: 'center', margin: 10 }} >
                                <Text style={{ color: colors.primary, fontSize: 18 }}>Add a photo</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[canAddNotes ? styles.button : styles.buttonDisabled, { alignSelf: 'center' }]}
                                disabled={!canAddNotes}
                                onPress={() => handleAddNotes()}
                            >
                                <Text style={canAddNotes ? styles.buttonText : styles.buttonTextDisabled}>Add Notes </Text>
                            </TouchableOpacity>
                        </Fragment>
                    }
                    {errorView}
                </View>
            </View> : null
        }
    </View >






    return (
        <ScrollView >
            <SafeAreaView>
                <View style={{ flex: 1 }}>
                    {view}
                    {overlayView}
                </View >
            </SafeAreaView>
        </ScrollView >
    );
}

AddNotes.navigationOptions = ({ navigation }) => ({
    title: "Add Notes",
    headerStyle: {
        backgroundColor: colors.primary,
    },
    headerTintColor: colors.white,

});


export default AddNotes
import {Alert, ScrollView, StyleSheet, Text, TextInput, View} from "react-native";
import {useCallback, useState} from "react";
import {Colors} from "../../constants/colors";
import ImagePicker from "./ImagePicker";
import LocationPicker from "./LocationPicker";
import Button from "../UI/Button";
import {Place} from "../../models/place";

function PlaceForm({ onCreatePlace }) {
    const [enteredTitle, setEnteredTitle] = useState('');
    const [locationPicked, setLocationPicked] = useState();
    const [imageTaken, setImageTaken] = useState();

    function changeTitleHandler(enteredText) {
        setEnteredTitle(enteredText);
    }

    function savePlaceHandler() {
        const missingFields = [];
        if (!enteredTitle || enteredTitle.trim().length === 0) {
            missingFields.push('Title');
        }
        if (!locationPicked) {
            missingFields.push('Location');
        }
        if (!imageTaken) {
            missingFields.push('Photo');
        }
        if (missingFields.length > 0) {
            const missingFieldsText = missingFields.join(', ');
            const alertMessage = `${missingFieldsText}`;
            Alert.alert('To save this place we need this information:', alertMessage);
            return;
        }
        const placeData = new Place(
            enteredTitle,
            imageTaken[0].uri,
            locationPicked,
        );
        console.log('Place Data: ', placeData);
        onCreatePlace(placeData);
    }

    function onImageTakenHandler(imageUri, location) {
        setImageTaken(imageUri);
        if (location) {
            onLocationPickHandler(location);
            setLocationPicked(location);
        }
       /* // Check for location data in the EXIF data.
        if (imageUri[0].exif && imageUri[0].exif.GPSLatitude && imageUri[0].exif.GPSLongitude) {
            let lat = 0;
            let lng = 0;

            // If GPSLatitude and GPSLongitude are arrays, they might be in the [degrees, minutes, seconds] format
            if (Array.isArray(imageUri[0].exif.GPSLatitude)) {
                const [degrees, minutes, seconds] = imageUri[0].exif.GPSLatitude;
                lat = degrees + minutes / 60 + seconds / 3600;
            } else {
                lat = imageUri[0].exif.GPSLatitude;
            }

            if (Array.isArray(imageUri[0].exif.GPSLongitude)) {
                const [degrees, minutes, seconds] = imageUri[0].exif.GPSLongitude;
                lng = degrees + minutes / 60 + seconds / 3600;
            } else {
                lng = imageUri[0].exif.GPSLongitude;
            }

            // Adjust for the Latitude and Longitude Ref if they exist
            if (imageUri[0].exif.GPSLatitudeRef === 'S') lat = -lat;
            if (imageUri[0].exif.GPSLongitudeRef === 'W') lng = -lng;

            onLocationPickHandler({ lat, lng });
        }*/
    }

    const onLocationPickHandler = useCallback((location) => {
        setLocationPicked(location);
    }, []);



    return (
        <ScrollView style={styles.form}>
            <View>
                <Text style={styles.label}>Title</Text>
                <TextInput style={styles.input} onChangeText={changeTitleHandler} value={enteredTitle}/>
            </View>
            <ImagePicker onImageTaken={onImageTakenHandler}/>
            <LocationPicker location={locationPicked} onLocationPick={onLocationPickHandler}/>
            <Button onPress={savePlaceHandler}>Add Place</Button>
        </ScrollView>
    );
}

export default PlaceForm;

const styles = StyleSheet.create({
    form: {
        flex: 1,
        padding: 24,
    },
    label: {
        fontWeight: 'bold',
        marginBottom: 4,
        color: Colors.primary500,
    },
    input: {
        marginVertical: 8,
        paddingHorizontal: 4,
        paddingVertical: 8,
        fontSize: 16,
        borderBottomColor: Colors.primary700,
        borderBottomWidth: 2,
        backgroundColor: Colors.primary100,
    },
});
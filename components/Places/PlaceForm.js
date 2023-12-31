import {ScrollView, StyleSheet, Text, TextInput, View} from "react-native";
import {useCallback, useState} from "react";
import {Colors} from "../../constants/colors";
import ImagePicker from "./ImagePicker";
import LocationPicker from "./LocationPicker";
import Button from "../UI/Button";
import {Place} from "../../models/place";
import {showMessage} from "react-native-flash-message";

function PlaceForm({ onCreatePlace }) {
    const [enteredTitle, setEnteredTitle] = useState('');
    const [locationPicked, setLocationPicked] = useState();
    const [imageTaken, setImageTaken] = useState();
    const [gotFormatedDate, setGotFormatedDate] = useState()

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
            const alertMessage = `We're missing some information: ${missingFieldsText}.`;
            showMessage({
                message: `We can't save your place yet`,
                description: `${alertMessage} Please provide these details before saving.`,
                type: "warning",
                icon: 'auto',
                floating: true,
                position: "top",
                autoHide: true,
            });
            return;
        }
        const placeData = new Place(
            enteredTitle,
            imageTaken[0].uri,
            locationPicked,
            undefined,
            gotFormatedDate,
        );
        onCreatePlace(placeData);
    }

    function onImageTakenHandler(imageUri, location, formattedDate) {
        setImageTaken(imageUri);
        onLocationPickHandler(location);
        setLocationPicked(location);
        if (formattedDate) {
            setGotFormatedDate(formattedDate)
        }
    }

    const onLocationPickHandler = useCallback((location) => {
        setLocationPicked(location);
    }, []);


    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={styles.form}>
                <View>
                    <Text style={styles.label}>Title</Text>
                    <TextInput style={styles.input} onChangeText={changeTitleHandler} value={enteredTitle}/>
                </View>
                <ImagePicker onImageTaken={onImageTakenHandler}/>
                <LocationPicker location={locationPicked} onLocationPick={onLocationPickHandler}/>
                <Button onPress={savePlaceHandler}>Add Place</Button>
            </ScrollView>
        </View>
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
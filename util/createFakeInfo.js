import {Alert} from "react-native";
import {getFakeImageURI, insertFakePlaces} from "./database";

export async function createFakeInfo(place) {

    try {
        const nearbyPOIS = []
        const poiPhotoPaths = [];
        const imageUri = getFakeImageURI(place.title)

        const newPlace = {
            ...place,
            imageUri,
            nearbyPOIS,
            poiPhotoPaths,
        };
        await insertFakePlaces(newPlace);
    } catch (error) {
        console.log('Error creating place:', error);
        Alert.alert(
            error,
            'Error occurred while creating the place, please try again',
            [{ text: 'Okay' }]
        );
    }
}
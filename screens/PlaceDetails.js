import {Image, ScrollView, StyleSheet, Text, View} from "react-native";
import OutlinedButton from "../components/UI/OutlinedButton";
import {Colors} from "../constants/colors";
import {useEffect, useState} from "react";
import {fetchPlaceDetails} from "../util/database";

function PlaceDetails({ route, navigation }) {
    const [fetchedPlace, setFetchedPlace] = useState();

    function showOnMapHandler() {
        navigation.navigate('Map',{
            initialLat: fetchedPlace.location.lat,
            initialLng: fetchedPlace.location.lng,
        });
    }

    const selectedPlacedId = route.params.placeId;

    useEffect(() => {
        async function loadPlaceData() {
            const place = await fetchPlaceDetails(selectedPlacedId);
            setFetchedPlace(place);
            navigation.setOptions({
                title: place.title,
            });
        }

        loadPlaceData();
    }, [selectedPlacedId]);

    if (!fetchedPlace) {
        return (
            <View style={styles.fallback}>
                <Text>Loading Place Data...</Text>
            </View>
        );
    }

    return (
        <ScrollView>
            <Image style={styles.image} source={{ uri: fetchedPlace.imageUri }}/>
            <View style={styles.locationContainer}>
                <View style={styles.addressContainer}>
                    <Text>{fetchedPlace.date}</Text>
                    <Text style={styles.address}>{fetchedPlace.address}</Text>
                </View>
                <OutlinedButton
                    icon="map"
                    onPress={showOnMapHandler}
                    children="Show on Map"
                />
            </View>
        </ScrollView>
    );
}

export default PlaceDetails;

const styles = StyleSheet.create({
    fallback: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        height: '35%',
        minHeight: 300,
        width: '100%',
    },
    locationContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    addressContainer: {
        padding: 20,
    },
    address: {
        color: Colors.primary500,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
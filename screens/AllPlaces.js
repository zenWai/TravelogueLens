import PlacesList from "../components/Places/PlacesList";
import {useEffect, useState} from "react";
import {useIsFocused} from "@react-navigation/native";
import {fetchPlaces, init} from "../util/database";
import {Alert, StyleSheet, View} from "react-native";
import {Colors} from "../constants/colors";

function AllPlaces({ route }) {
    const [loadedPlaces, setLoadedPlaces] = useState([]);
    const isFocused = useIsFocused();

    useEffect(() => {
        async function loadPlaces() {
            try {
                await init();
                const places = await fetchPlaces();
                setLoadedPlaces(places)
            } catch (error) {
                console.log('Error loading places:', error);
                Alert.alert('Error', 'Failed loading your places, please re-open your app');
            }
        }

        if (isFocused) {
            loadPlaces();
            /*setLoadedPlaces(curPlaces => [...curPlaces, route.params.place]);*/
        }
    }, [isFocused]);

    const deletePlaceHandler = (id) => {
        setLoadedPlaces(places => places.filter(place => place.id !== id));
    }

    return (
        <View style={styles.container}>
            <PlacesList places={loadedPlaces} onDelete={deletePlaceHandler}/>
        </View>
    );
}

export default AllPlaces;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.gray700,
    },
})
import MapView, {Marker} from "react-native-maps";
import {Alert, StyleSheet} from "react-native";
import {useCallback, useLayoutEffect, useState} from "react";
import IconButton from "../components/UI/IconButton";

function Map({ navigation, route }) {
    const initialLocation = route.params && {
        lat: route.params.initialLat,
        lng: route.params.initialLng,
    }
    const [selectedLocation, setSelectedLocation] = useState(initialLocation);


    const region = {
        latitude: initialLocation ? initialLocation.lat : 37.50,
        longitude: initialLocation ? initialLocation.lng : -122.33,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    };

    function selectLocationHandler(event) {
        if (initialLocation) {
            return;
        }
        const lat = event.nativeEvent.coordinate.latitude;
        const lng = event.nativeEvent.coordinate.longitude;
        setSelectedLocation({
            lat: lat,
            lng: lng,
        });
    }

    //avoiding unnecessary render cycles &&|| infinite loops
    //with CallBack,
    const savePickedLocationHandler = useCallback(() => {
        if (!selectedLocation) {
            Alert.alert(
                'No location picked!',
                'Tap on the map to pick a location'
            );
            return;
        }
        navigation.navigate('AddPlace', {
                pickedLat: selectedLocation.lat,
                pickedLng: selectedLocation.lng
            }
        );
    }, [navigation, selectedLocation]);

    useLayoutEffect(() => {
        //if got initial location header button will not be shown
        if(initialLocation) {
            return;
        }
        navigation.setOptions({
            headerRight: ({ tintColor }) =>
                <IconButton
                    icon="save"
                    size={24}
                    color={tintColor}
                    onPress={savePickedLocationHandler}
                />
        });
    }, [navigation, savePickedLocationHandler, initialLocation]);

    return <MapView
        style={styles.map}
        initialRegion={region}
        onPress={selectLocationHandler}
    >

        {selectedLocation && <Marker
            title="Picked Location"
            coordinate={{
                latitude: selectedLocation.lat,
                longitude: selectedLocation.lng,
            }}
        />}
    </MapView>
}

export default Map;

const styles = StyleSheet.create({
    map: {
        flex: 1,
    }
});
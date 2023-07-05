import MapView, {Marker} from "react-native-maps";
import {Alert, StyleSheet} from "react-native";
import {useCallback, useLayoutEffect, useState} from "react";
import IconButton from "../components/UI/IconButton";

function Map({ navigation }) {
    const [selectedLocation, setSelectedLocation] = useState();

    const region = {
        latitude: 37.50,
        longitude: -122.33,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    };

    function selectLocationHandler(event) {
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
        navigation.setOptions({
            headerRight: ({ tintColor }) =>
                <IconButton
                    icon="save"
                    size={24}
                    color={tintColor}
                    onPress={savePickedLocationHandler}
                />
        });
    }, [navigation, savePickedLocationHandler]);

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
import MapView, {Marker} from "react-native-maps";
import {StyleSheet} from "react-native";
import {useState} from "react";

function Map() {
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
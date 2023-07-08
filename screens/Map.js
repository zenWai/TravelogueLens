import MapView, {Marker} from "react-native-maps";
import {ActivityIndicator, Alert, Linking, StyleSheet, View} from "react-native";
import {useCallback, useLayoutEffect, useState} from "react";
import IconButton from "../components/UI/IconButton";
import {getCurrentPositionAsync, PermissionStatus, requestForegroundPermissionsAsync} from 'expo-location';

function Map({ navigation, route }) {
    const initialLocation = route.params && {
        lat: route.params.initialLat,
        lng: route.params.initialLng,
    }
    const [selectedLocation, setSelectedLocation] = useState(initialLocation);
    const [isLoading, setIsLoading] = useState(false);
    const [locationPermissionInformation, setLocationPermissionInformation] = useState(null);


    const [region, setRegion] = useState({
        latitude: initialLocation ? initialLocation.lat : 37.50,
        longitude: initialLocation ? initialLocation.lng : -122.33,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });

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
        if (initialLocation) {
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

    const verifyPermissions = async () => {
        const { status } = await requestForegroundPermissionsAsync();
        setLocationPermissionInformation(status);
        return status === PermissionStatus.GRANTED;
    };

    useLayoutEffect(() => {
        if (!initialLocation) {
            const fetchCurrentLocation = async () => {
                const hasPermission = await verifyPermissions(); // Invoke hasPermission function
                function openSettings() {
                    Linking.openSettings();
                }
                if (!hasPermission) { // Change the condition here
                    Alert.alert(
                        'Insufficient Permissions',
                        'You need to grant location permissions to use this app',
                        [
                            {
                                text: 'Cancel',
                                style: 'cancel',
                            },
                            {
                                text: 'Open Settings',
                                onPress: () => openSettings(),
                            },
                        ]
                    );
                }
                setIsLoading(true);
                try {
                    const { coords } = await getCurrentPositionAsync({});
                    setRegion(prevRegion => ({
                        ...prevRegion,
                        latitude: coords.latitude,
                        longitude: coords.longitude
                    }));
                    // to place marker
                    setSelectedLocation({
                        lat: coords.latitude,
                        lng: coords.longitude,
                    });
                } catch (error) {
                    console.log('Error fetching current location:', error);
                } finally {
                    setIsLoading(false);
                }
            };

            fetchCurrentLocation();
        }
    }, [initialLocation]);
    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator style={styles.loading} size="large" color="#000000"/>
            </View>
        );
    }

    return <MapView
        style={styles.map}
        region={region}
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
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loading: {
        alignSelf: 'center',
    },
});
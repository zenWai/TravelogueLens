import MapView, {Marker} from "react-native-maps";
import {ActivityIndicator, Alert, Linking, StyleSheet, View} from "react-native";
import {useCallback, useEffect, useLayoutEffect, useState} from "react";
import IconButton from "../components/UI/IconButton";
import {getCurrentPositionAsync, PermissionStatus, requestForegroundPermissionsAsync} from 'expo-location';
import {getAddress} from "../util/location";

function Map({ navigation, route }) {
    const [selectedLocation, setSelectedLocation] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [locationPermissionInformation, setLocationPermissionInformation] = useState(null);
    const [region, setRegion] = useState({
        latitude: 52.520008,
        longitude: 13.404954,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });

    const initialLat = route.params && route.params.initialLat;
    const initialLng = route.params && route.params.initialLng;
    const currentSetLocationLat = route.params && route.params.currentSetLocationLat;
    const currentSetLocationLng = route.params && route.params.currentSetLocationLng;
    //currentSetLocation || initial
    useEffect(() => {
        let newLat, newLng;
        if (currentSetLocationLat && currentSetLocationLng) {
            newLat = currentSetLocationLat;
            newLng = currentSetLocationLng;
        } else if (initialLat && initialLng) {
            newLat = initialLat;
            newLng = initialLng;
        }

        if (newLat && newLng) {
            setRegion({
                latitude: newLat,
                longitude: newLng,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            });
            setSelectedLocation({
                lat: newLat,
                lng: newLng,

            })
        }
    }, [currentSetLocationLat, currentSetLocationLng, initialLat, initialLng]);

    function selectLocationHandler(event) {
        if (initialLat && initialLng) {
            return;
        }
        const lat = event.nativeEvent.coordinate.latitude;
        const lng = event.nativeEvent.coordinate.longitude;
        setSelectedLocation({
            lat: lat,
            lng: lng,
        });
    }

    async function validateLocation(selectedLocation) {
        const infoFromLocation = await getAddress(selectedLocation.lat, selectedLocation.lng);
        const country = infoFromLocation.country;
        const city = infoFromLocation.city;

        if (!city || !country) {
            Alert.alert(
                'Location Unavailable',
                'The selected location was not found or it may be too remote. Please choose a location closer to a city or town.'
            );
            return false;
        }

        return true;
    }

    //avoiding unnecessary render cycles &&|| infinite loops
    //with CallBack,
    const savePickedLocationHandler = useCallback(async () => {
        if (!selectedLocation) {
            Alert.alert(
                'No Location Selected',
                'Please tap on the map to choose your desired location.'
            );
            return;
        }
        try {
            const isLocationValid = await validateLocation(selectedLocation);
            if (isLocationValid) {
                navigation.navigate('AddPlace', {
                        pickedLat: selectedLocation.lat,
                        pickedLng: selectedLocation.lng
                    }
                );
            }
        } catch (error) {
            console.log(error);
        }

    }, [navigation, selectedLocation]);

    useLayoutEffect(() => {
        //if got initial location header button will not be shown
        if (initialLat && initialLng) {
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
    }, [navigation, savePickedLocationHandler, initialLat, initialLng]);

    const verifyPermissions = async () => {
        const { status } = await requestForegroundPermissionsAsync();
        setLocationPermissionInformation(status);
        return status === PermissionStatus.GRANTED;
    };

    useLayoutEffect(() => {
        if (!initialLat && !initialLng && !currentSetLocationLat && !currentSetLocationLng) {
            const fetchCurrentLocation = async () => {
                const hasPermission = await verifyPermissions(); // Invoke hasPermission function
                function openSettings() {
                    Linking.openSettings();
                }

                if (!hasPermission) { // Change the condition here
                    Alert.alert(
                        'Permission Required',
                        'This app requires location permissions to function correctly. Please grant the necessary permissions.',
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
                    console.log('An error occurred while retrieving the current location:', error);
                } finally {
                    setIsLoading(false);
                }
            };

            fetchCurrentLocation();
        }
    }, []);
    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator style={styles.loading} size="large" color="#000000"/>
            </View>
        );
    }

    return <MapView
        provider={undefined}
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
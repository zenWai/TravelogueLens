import MapView, {Marker} from "react-native-maps";
import {ActivityIndicator, Alert, Linking, StyleSheet, View} from "react-native";
import {useCallback, useEffect, useLayoutEffect, useState} from "react";
import IconButton from "../components/UI/IconButton";
import {getCurrentPositionAsync, PermissionStatus, requestForegroundPermissionsAsync} from 'expo-location';
import {getAddress} from "../util/location";
import {showMessage} from "react-native-flash-message";

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
        try {
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
        } catch (error) {
            Alert.alert(
                'Location Service Unavailable',
                'There was a problem retrieving location data. Please check your internet connection and try again.'
            );
        }
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
            } else {

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
                const hasPermission = await verifyPermissions();

                function openSettings() {
                    Linking.openSettings();
                }

                if (!hasPermission) {
                    Alert.alert(
                        'Location Permission Required',
                        'This app requires location access to show your current position on the map, making it easier for you to add places to your favorites. Please grant location permissions in settings.',
                        [
                            {
                                text: 'Not Now',
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
                    if (!coords) {
                        showMessage({
                            message: `Oops something went wrong`,
                            description: `Please make sure your device's location services are turned on to show your current location on map.`,
                            type: "warning",
                            icon: 'auto',
                            floating: true,
                            position: "top",
                            autoHide: true,
                        });
                        setIsLoading(false);
                    }
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
                    console.log('error on map location');
                    setIsLoading(false);
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
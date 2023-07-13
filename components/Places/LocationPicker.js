import {ActivityIndicator, Alert, Image, Linking, StyleSheet, Text, View} from "react-native";
import OutlinedButton from "../UI/OutlinedButton";
import {Colors} from "../../constants/colors";
import {getCurrentPositionAsync, PermissionStatus, useForegroundPermissions} from 'expo-location';
import {getMapPreview} from "../../util/location";
import {useCallback, useEffect, useState} from "react";
import {useIsFocused, useNavigation, useRoute} from "@react-navigation/native";

function LocationPicker({ location, onLocationPick }) {
    const [pickedLocation, setPickedLocation] = useState();
    const [locationPermissionInformation, requestPermission] = useForegroundPermissions();
    const navigation = useNavigation();
    const route = useRoute();

    const isFocused = useIsFocused();
    const [loadingLocation, setLoadingLocation] = useState(false);

    useEffect(() => {
        if (isFocused && route.params) {
            const mapPickedLocation = {
                lat: route.params.pickedLat,
                lng: route.params.pickedLng
            };
            setPickedLocation(mapPickedLocation);
        }
    }, [route, isFocused]);
    useEffect(() => {
        if (location && (location.lat !== pickedLocation?.lat || location.lng !== pickedLocation?.lng)) {
            setLoadingLocation(true);
            console.log('location use effect',location)
            setPickedLocation(location);
            setLoadingLocation(false);
        } else if (!location || location.lat === 0) {
            setPickedLocation(undefined)
        }
    }, [location]);

    useEffect(() => {
        async function handleLocation() {
            if (pickedLocation) {
                try {
                    onLocationPick({ ...pickedLocation });
                } catch (error) {
                    console.log('Error fetching address:', error);
                    Alert.alert(
                        'Oops, something went wrong',
                        'Could not get your location. Please try again!'
                    );
                }
            }
        }

        handleLocation();

    }, [pickedLocation, onLocationPick]);

    const openSettings = useCallback(() => {
        Linking.openSettings();
    }, []);

    async function verifyPermissions() {
        if (locationPermissionInformation.status === PermissionStatus.UNDETERMINED || locationPermissionInformation.status === PermissionStatus.DENIED) {
            const permissionResponse = await requestPermission();
            if (permissionResponse.status === PermissionStatus.DENIED) {
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
                return false;
            }
            return permissionResponse.granted;
        }



        return true;
    }

    async function getLocationHandler() {
        const hasPermission = await verifyPermissions();
        if (!hasPermission) {
            return;
        }
        setLoadingLocation(true);
        try {
            const location = await getCurrentPositionAsync();
            setPickedLocation({
                lat: location.coords.latitude,
                lng: location.coords.longitude
            });
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingLocation(false)
        }
    }

    function pickOnMapHandler() {
        if (pickedLocation) {
            navigation.navigate('Map', {
                currentSetLocationLat: pickedLocation.lat,
                currentSetLocationLng: pickedLocation.lng,
            });
        } else {
            navigation.navigate('Map');
        }

    }

    let locationPreview;
    if(!pickedLocation || pickedLocation === 0) {
        locationPreview = <Text>No location picked yet.</Text>
    }else {
        console.log(1);
        console.log('pickedLocation', pickedLocation)
        console.log('location in else',location)
        locationPreview = (
            <Image
                style={styles.mapPreviewImage}
                source={{
                    uri: getMapPreview(pickedLocation.lat, pickedLocation.lng),
                }}
            />
        );
    }


    return (
        <View style={{ flex: 1 }}>
            <View style={styles.mapPreview}>
                {loadingLocation
                    ? (
                        <ActivityIndicator size="large" color={Colors.primary500}/>
                    )
                    : (locationPreview)
                }
            </View>
            <View style={styles.actions}>
                <OutlinedButton icon="location" onPress={getLocationHandler}>
                    My Location
                </OutlinedButton>
                <OutlinedButton icon="map" onPress={pickOnMapHandler}>
                    Pick on Map
                </OutlinedButton>
            </View>
        </View>
    );
}

export default LocationPicker;

const styles = StyleSheet.create({
    mapPreview: {
        width: '100%',
        marginVertical: 8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.primary100,
        borderRadius: 4,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    mapPreviewImage: {
        width: '100%',
        height: 200,
        borderRadius: 4,
    },
});
import {ActivityIndicator, Alert, Image, StyleSheet, Text, View} from "react-native";
import OutlinedButton from "../UI/OutlinedButton";
import {Colors} from "../../constants/colors";
import {getCurrentPositionAsync, PermissionStatus, useForegroundPermissions} from 'expo-location';
import {getAddress, getMapPreview} from "../../util/location";
import {useEffect, useState} from "react";
import {useIsFocused, useNavigation, useRoute} from "@react-navigation/native";

function LocationPicker({ onLocationPick }) {
    const [pickedLocation, setPickedLocation] = useState();
    const [locationPermissionInformation, requestPermission] = useForegroundPermissions();
    const navigation = useNavigation();
    const route = useRoute();

    //false when we enter de map screen
    const isFocused = useIsFocused();
    //for My Location ActivityIndicator
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
        async function handleLocation() {
            if (pickedLocation) {
                try {
                    const address = await getAddress(pickedLocation.lat, pickedLocation.lng);
                    onLocationPick({ ...pickedLocation, address: address });
                } catch (error) {
                    console.log('Error fetching address:', error);
                    Alert.alert(
                        'Oops, something went wrong',
                        'Could not get your location. Try again!'
                    );
                }
            }
        }

        handleLocation();

    }, [pickedLocation, onLocationPick]);

    async function verifyPermissions() {
        if (locationPermissionInformation.status === PermissionStatus.UNDETERMINED) {
            const permissionResponse = await requestPermission();
            return permissionResponse.granted;
        }

        if (locationPermissionInformation.status === PermissionStatus.DENIED) {
            Alert.alert(
                'Insufficient Permissions',
                'You need to grant camera permissions to use this app'
            );
            return false;
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
        navigation.navigate('Map');
    }

    let locationPreview = <Text>No location picked yet.</Text>

    if (pickedLocation) {
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
                {loadingLocation ? (
                    <ActivityIndicator size="small" color={Colors.primary500}/>
                ) : (locationPreview)}
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
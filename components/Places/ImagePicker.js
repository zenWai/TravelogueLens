import {ActivityIndicator, Alert, Image, Linking, Platform, StyleSheet, Text, View} from "react-native";
import {launchCameraAsync, PermissionStatus, useCameraPermissions, launchImageLibraryAsync, useMediaLibraryPermissions, MediaTypeOptions} from "expo-image-picker";
import * as MediaLibrary from 'expo-media-library';
import {useState} from "react";
import {Colors} from "../../constants/colors";
import OutlinedButton from "../UI/OutlinedButton";

function ImagePicker({ onImageTaken }) {
    const [cameraPermissionInformation, requestPermission] = useCameraPermissions();
    const [mediaLibraryPermissionInformation, requestMLPermission] = useMediaLibraryPermissions();
    const [pickedImage, setPickedImage] = useState();
    const [loadingPicture, setLoadingPicture] = useState(false);

    async function verifyPermissions() {
        if (cameraPermissionInformation.status === PermissionStatus.UNDETERMINED) {
            const permissionResponse = await requestPermission();
            return permissionResponse.granted;
        }
        if(mediaLibraryPermissionInformation.status === PermissionStatus.UNDETERMINED) {
            const permissionMLResponse = await requestMLPermission();
            return permissionMLResponse.granted;
        }

        function openSettings() {
            Linking.openSettings();
        }

        if (cameraPermissionInformation.status === PermissionStatus.DENIED) {
            Alert.alert(
                'Insufficient Permissions',
                'You need to grant camera permissions to use this app',
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
        if (mediaLibraryPermissionInformation.status === PermissionStatus.DENIED) {
            Alert.alert(
                'Insufficient Permissions',
                'You need to grant camera permissions to use this app',
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

        return true;
    }

    async function takeImageHandler() {
        const hasPermission = await verifyPermissions();
        if (!hasPermission) {
            return;
        }

        setLoadingPicture(true);
        const image = await launchCameraAsync({
            /*
             * Disable Expo cropping functionality,
             * considering react-native-image-crop-picker instead
             * crop function is faulty
             */
            allowsEditing: Platform.OS === 'android',
            quality: 1,
        });

        try {
            if (!image.canceled) {
                setPickedImage(image.assets);
                onImageTaken(image.assets);
            }
        } catch (error) {
            console.log('error taking picture', error);
        } finally {
            setLoadingPicture(false);
        }

    }

    async function selectImageHandler() {
        const hasPermission = await verifyPermissions();
        if (!hasPermission) {
            return;
        }

        setLoadingPicture(true);
        const image = await launchImageLibraryAsync({
            allowsEditing: Platform.OS === 'android',
            quality: 1,
            mediaTypes: MediaTypeOptions.Images,
            exif: true,
        });

        try {
            if (!image.canceled) {
                // This will get additional info about the asset, including the EXIF data
                console.log('log image', image.assets[0].uri);

                console.log(image.assets[0].exif)
                let lat = 0;
                let lng = 0;

                if (image.assets[0].exif && image.assets[0].exif.GPSLatitude && image.assets[0].exif.GPSLongitude) {
                    if (Array.isArray(image.assets[0].exif.GPSLatitude)) {
                        const [degrees, minutes, seconds] = image.assets[0].exif.GPSLatitude;
                        lat = degrees + minutes / 60 + seconds / 3600;
                    } else {
                        lat = image.assets[0].exif.GPSLatitude;
                    }

                    if (Array.isArray(image.assets[0].exif.GPSLongitude)) {
                        const [degrees, minutes, seconds] = image.assets[0].exif.GPSLongitude;
                        lng = degrees + minutes / 60 + seconds / 3600;
                    } else {
                        lng = image.assets[0].exif.GPSLongitude;
                    }

                    if (image.assets[0].exif.GPSLatitudeRef === 'S') lat = -lat;
                    if (image.assets[0].exif.GPSLongitudeRef === 'W') lng = -lng;
                }
                console.log('lat', lat);
                console.log('lng', lng);
                setPickedImage(image.assets);
                if(lat !== 0 && lng !== 0) {
                    onImageTaken(image.assets, { lat, lng });
                } else {
                    onImageTaken(image.assets);
                }
            }
        } catch (error) {
            console.log('error picking image', error);
        } finally {
            setLoadingPicture(false);
        }

    }

    let imagePreview = <Text>No image taken yet.</Text>;

    if (pickedImage) {
        imagePreview = <Image style={styles.image} source={{ uri: pickedImage[0].uri }} resizeMode="stretch"/>;
    }
    return (
        <View>
            <View style={styles.imagePreview}>
                {loadingPicture
                    ? (
                        <ActivityIndicator size="large" color={Colors.primary500}/>
                    )
                    : (imagePreview)
                }
            </View>
            <OutlinedButton icon="camera" onPress={takeImageHandler}>Take Photo</OutlinedButton>
            <OutlinedButton icon="image" onPress={selectImageHandler}>Select Photo</OutlinedButton>
        </View>
    );
}

export default ImagePicker;

const styles = StyleSheet.create({
    imagePreview: {
        width: '100%',
        height: 200,
        marginVertical: 8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.primary100,
        borderRadius: 4,
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 4,
    }
})
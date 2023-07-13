import {ActivityIndicator, Alert, Image, Linking, Platform, StyleSheet, Text, View} from "react-native";
import {
    launchCameraAsync,
    launchImageLibraryAsync,
    MediaTypeOptions,
    PermissionStatus,
    useCameraPermissions,
    useMediaLibraryPermissions
} from "expo-image-picker";
import {useState} from "react";
import {Colors} from "../../constants/colors";
import OutlinedButton from "../UI/OutlinedButton";

function ImagePicker({ onImageTaken }) {
    const [cameraPermissionInformation, requestPermission] = useCameraPermissions();
    const [mediaLibraryPermissionInformation, requestMLPermission] = useMediaLibraryPermissions();
    const [pickedImage, setPickedImage] = useState();
    const [loadingPicture, setLoadingPicture] = useState(false);

    async function verifyPermissionsCamera() {
        if (cameraPermissionInformation.status === PermissionStatus.UNDETERMINED) {
            const permissionResponse = await requestPermission();
            return permissionResponse.granted;
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

        return true;
    }

    async function verifyPermissionsLibrary() {

        if (mediaLibraryPermissionInformation.status === PermissionStatus.UNDETERMINED) {
            const permissionMLResponse = await requestMLPermission();
            return permissionMLResponse.granted;
        }

        function openSettings() {
            Linking.openSettings();
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
        const hasPermission = await verifyPermissionsCamera();
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
        console.log(image.assets)
        console.log(image.assets[0])
        console.log(image.assets[0].uri)
        console.log(image.assets[0].fileName)

    }

    async function selectImageHandler() {
        const hasPermission = await verifyPermissionsLibrary();
        if (!hasPermission) {
            return;
        }

        setLoadingPicture(true);
        const image = await launchImageLibraryAsync({
            allowsEditing: false,
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
                //date
                let formattedDate = '';
                if ("DateTimeOriginal" in image.assets[0].exif) {
                    const dateTimeOriginal = image.assets[0].exif.DateTimeOriginal; // "2023:04:03 19:42:39"
                    const date = dateTimeOriginal.split(' ')[0]; // "2023:04:03"
                    formattedDate = date.replace(/:/g, '-'); // "2023-04-03"
                } else if ("DateTimeDigitized" in image.assets[0].exif) {
                    const DateTimeDigitized = image.assets[0].exif.DateTimeDigitized; // "2023:04:03 19:42:39"
                    const date = DateTimeDigitized.split(' ')[0]; // "2023:04:03"
                    formattedDate = date.replace(/:/g, '-'); // "2023-04-03"
                } else if ("DateTime" in image.assets[0].exif) {
                    console.log('in DateTime exif/app crash?');
                    const DateTime = image.assets[0].exif.DateTime; // "2023:04:03 19:42:39"
                    const date = DateTime.split(' ')[0]; // "2023:04:03"
                    formattedDate = date.replace(/:/g, '-'); // "2023-04-03"
                }
                console.log('lat', lat);
                console.log('lng', lng);
                setPickedImage(image.assets);
                let location = undefined;

                if (lat !== 0 && lng !== 0) {
                    location = { lat, lng };
                }
                console.log(location)
                onImageTaken(image.assets, location, formattedDate !== '' ? formattedDate : undefined);
                //date

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
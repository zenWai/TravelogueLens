import {ActivityIndicator, Alert, Dimensions, Image, Linking, Platform, StyleSheet, Text, View} from "react-native";
import {
    launchCameraAsync,
    launchImageLibraryAsync,
    MediaTypeOptions,
    PermissionStatus,
    useCameraPermissions,
    useMediaLibraryPermissions
} from "expo-image-picker";
import {useCallback, useState} from "react";
import {Colors} from "../../constants/colors";
import OutlinedButton from "../UI/OutlinedButton";
import {showMessage} from "react-native-flash-message";

function ImagePicker({ onImageTaken }) {
    const [cameraPermissionInformation, requestPermission] = useCameraPermissions();
    const [mediaLibraryPermissionInformation, requestMLPermission] = useMediaLibraryPermissions();
    const [pickedImage, setPickedImage] = useState();
    const [loadingPicture, setLoadingPicture] = useState(false);
    const [imageHeight, setImageHeight] = useState(200);
    const MAX_HEIGHT = Dimensions.get('window').height * 0.5;

    const openSettings = useCallback(() => {
        Linking.openSettings();
    }, []);

    async function verifyPermissionsCamera() {
        if (cameraPermissionInformation.status === PermissionStatus.UNDETERMINED || cameraPermissionInformation.status === PermissionStatus.DENIED) {
            const permissionResponse = await requestPermission();
            if (permissionResponse.status === PermissionStatus.DENIED) {
                Alert.alert(
                    'Camera Permission Required',
                    'This app requires camera access and this allows you to take photos directly from the app and add them to your favorite places.. Please grant Camera Permission in settings.',
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
                return false;
            }
            return permissionResponse.granted;
        }

        return true;
    }

    async function verifyPermissionsLibrary() {
        if (mediaLibraryPermissionInformation.status === PermissionStatus.UNDETERMINED || mediaLibraryPermissionInformation.status === PermissionStatus.DENIED) {
            const permissionMLResponse = await requestMLPermission();
            if (permissionMLResponse.status === PermissionStatus.DENIED) {
                Alert.alert(
                    'Media Library Permission Required',
                    'This app requires access to your media library to let you choose photos for your favorite places. Please allow media library permissions in settings.',
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
                return false;
            }
            return permissionMLResponse.granted;
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

        if (image.canceled) {
            setLoadingPicture(false);
            return;
        }
        try {
            if (!image.canceled) {
                setPickedImage(image.assets);
                onImageTaken(image.assets);
            }
        } catch (error) {
            showMessage({
                message: `Oops something went wrong`,
                description: `Please try again! Ensure you have internet connection and the required permissions`,
                type: "warning",
                icon: 'auto',
                floating: true,
                position: "top",
                autoHide: false,
            });
        } finally {
            setLoadingPicture(false);
        }
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
                    const dateTimeOriginal = image.assets[0].exif.DateTimeOriginal;
                    const date = dateTimeOriginal.split(' ')[0];
                    formattedDate = date.replace(/:/g, '-');
                } else if ("DateTimeDigitized" in image.assets[0].exif) {
                    const DateTimeDigitized = image.assets[0].exif.DateTimeDigitized;
                    const date = DateTimeDigitized.split(' ')[0];
                    formattedDate = date.replace(/:/g, '-');
                } else if ("DateTime" in image.assets[0].exif) {
                    const DateTime = image.assets[0].exif.DateTime;
                    const date = DateTime.split(' ')[0];
                    formattedDate = date.replace(/:/g, '-');
                }
                setPickedImage(image.assets);
                let location = undefined;

                if (lat !== 0 && lng !== 0) {
                    location = { lat, lng };
                    showMessage({
                        message: `Location Found`,
                        description: `We successfully retrieved the location of your photo. Check your map for the location.`,
                        type: "success",
                        icon: 'auto',
                        floating: true,
                        position: "top",
                        autoHide: true,
                    });
                } else {
                    showMessage({
                        message: `Manual Location Required`,
                        description: `We couldn't automatically retrieve the location of your photo. Please select the location on your map.`,
                        type: "default",
                        icon: 'auto',
                        floating: true,
                        position: "top",
                        autoHide: false,
                    });
                }
                onImageTaken(image.assets, location, formattedDate !== '' ? formattedDate : undefined);
                //date
            }
        } catch (error) {
            showMessage({
                message: `Oops something went wrong`,
                description: `Please try again! Ensure you have internet connection and the required permissions allowed`,
                type: "warning",
                icon: 'auto',
                floating: true,
                position: "top",
                autoHide: true,
            });
        } finally {
            setLoadingPicture(false);
        }
    }

    let imagePreview = <Text>No image taken yet.</Text>;

    const onImageLoad = () => {
        Image.getSize(pickedImage[0].uri, (width, height) => {
            const aspectRatioHeight = Dimensions.get('window').width * (height / width);

            setImageHeight(Math.min(aspectRatioHeight, MAX_HEIGHT));
        });
    };
    if (pickedImage) {
        imagePreview = <Image onLoad={onImageLoad} style={[styles.image, {height: imageHeight}]} source={{ uri: pickedImage[0].uri }} resizeMode="stretch"/>;
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
        marginVertical: 8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.primary100,
        borderRadius: 4,
    },
    image: {
        width: '100%',
        borderRadius: 4,
    }
})
import {Alert, Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Colors} from "../../constants/colors";
import {GestureHandlerRootView, RectButton, Swipeable} from 'react-native-gesture-handler';
import {Ionicons} from '@expo/vector-icons';
import formatDate from "../../util/FormatDate";
import {useNavigation} from "@react-navigation/native";

function PlaceItem({ place, onSelect, onDelete }) {
    const navigation = useNavigation();
    const handleDelete = () => {
        Alert.alert(
            "Are you sure?",
            `Are you sure you want to delete the place named "${place.title}"? This action cannot be undone.`, // Alert message
            [
                {
                    text: "No, keep it",
                    style: "cancel"
                },
                {
                    text: "Yes, delete it",
                    onPress: () => onDelete(place.id)
                }
            ]
        );
    };
    const handleEdit = () => {
        navigation.navigate('EditScreen', {
            place: place,
        });
    };
    const renderRightActions = () => {
        return (
            <>
                <RectButton style={[styles.rightActions, { backgroundColor: 'grey' }]} onPress={handleEdit}>
                    <Text style={styles.title}>Edit</Text>
                    <Ionicons name="create-outline" size={20} color={Colors.gray700}/>
                </RectButton>
                <RectButton style={styles.rightActions} onPress={handleDelete}>
                    <Text style={styles.title}>Delete</Text>
                    <Ionicons name="trash-outline" size={20} color={Colors.gray700}/>
                </RectButton>
            </>
        );
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Swipeable
                renderRightActions={renderRightActions}
                useNativeAnimations={false}
            >
                <TouchableOpacity
                    style={styles.item}
                    onPress={onSelect.bind(this, place.id)}
                >
                    <Image style={styles.image} source={{ uri: place.imageUri }}/>
                    <View style={styles.info}>
                        <Text style={styles.title}>{place.title}</Text>
                        <Text style={styles.address}>{place.address}</Text>
                        <Text style={styles.title}>{formatDate(place.date)}</Text>
                        <Text style={styles.title}>{place.countryFlagEmoji} {place.city}</Text>
                    </View>
                </TouchableOpacity>
            </Swipeable>
        </GestureHandlerRootView>
    );
}

export default PlaceItem;

const styles = StyleSheet.create({
    rightActions: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 75,
        backgroundColor: 'red',
        borderRadius: 6,
        marginVertical: 12,
        marginHorizontal: 12,
        elevation: 2,
        shadowColor: 'black',
        shadowOpacity: 0.15,
        shadowOffset: { width: 1, height: 1 },
        shadowRadius: 2,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        borderRadius: 6,
        marginVertical: 12,
        backgroundColor: Colors.primary500,
        elevation: 2,
        shadowColor: 'black',
        shadowOpacity: 0.15,
        shadowOffset: { width: 1, height: 1 },
        shadowRadius: 2,
    },
    image: {
        flex: 1,
        borderBottomLeftRadius: 4,
        borderTopLeftRadius: 4,
        height: '100%',
    },
    //twice as big as image
    info: {
        flex: 2,
        padding: 12,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 18,
        color: Colors.gray700,
    },
    address: {
        fontSize: 12,
        color: Colors.gray700,
    },
});
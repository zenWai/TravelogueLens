import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Colors} from "../../constants/colors";
import {GestureHandlerRootView, RectButton, Swipeable} from 'react-native-gesture-handler';
import {Ionicons} from '@expo/vector-icons';

function PlaceItem({ place, onSelect, onDelete }) {
    const handleDelete = () => {
        onDelete(place.id);
    };
    const renderRightActions = () => {
        return (
            <RectButton style={styles.rightActions} onPress={handleDelete}>
                <Text style={styles.title}>Delete</Text>
                <Ionicons name="trash-outline" size={20} color={Colors.gray700}/>
            </RectButton>
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
                        <Text style={styles.title}>{place.date}</Text>
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
    //twice as big than image
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
import {FlatList, StyleSheet, Text, View} from "react-native";
import PlaceItem from "./PlaceItem";
import {Colors} from "../../constants/colors";
import {useNavigation} from "@react-navigation/native";

function PlacesList({ places, onDelete }) {
    const navigation = useNavigation();

    function selectPlaceHandler(id) {
        navigation.navigate('PlaceDetails', {
            placeId: id
        });
    }

    if (!places || places.length === 0) {
        return (
            <View style={styles.fallbackContainer}>
                <Text style={styles.fallbackText}>No places added yet - start adding places</Text>
            </View>
        );
    }

    function onDeleteHandler(id) {
        onDelete(id);
    }

    return (
        <FlatList
            style={styles.list}
            data={places}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) =>
                <PlaceItem
                    place={item}
                    onSelect={selectPlaceHandler}
                    onDelete={onDeleteHandler}
                />}
            ItemSeparatorComponent={() => <View style={styles.separator}/>}
        />
    )
}

export default PlacesList;

const styles = StyleSheet.create({
    separator: {
        height: 3,
        backgroundColor: Colors.primary700,
    },
    list: {
        margin: 24,
    },
    fallbackContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fallbackText: {
        fontSize: 16,
        color: Colors.primary200,
    },
})
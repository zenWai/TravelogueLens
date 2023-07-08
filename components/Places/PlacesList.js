import {FlatList, StyleSheet, Text, View} from "react-native";
import PlaceItem from "./PlaceItem";
import {Colors} from "../../constants/colors";
import {useNavigation} from "@react-navigation/native";
import {deletePlace} from "../../util/database";

function PlacesList({ places }) {
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
        deletePlace(id)
            .then(() => {
                console.log('Place deleted successfully');
            })
            .catch((error) => {
                console.log('Error deleting place:', error);
            });
    }

    return (
        <FlatList
            style={styles.list}
            data={places}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <PlaceItem place={item} onSelect={selectPlaceHandler}
                                                 onDelete={onDeleteHandler}/>}
        />
    )
}

export default PlacesList;

const styles = StyleSheet.create({
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
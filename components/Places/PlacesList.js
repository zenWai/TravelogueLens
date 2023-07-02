import {FlatList, StyleSheet, Text, View} from "react-native";
import PlaceItem from "./PlaceItem";

function PlacesList({ places }) {
    if (!places || places.length === 0) {
        return (
            <View style={styles.fallbackContainer}>
                <Text style={styles.fallbackText}>No places added yet - start adding places</Text>
            </View>
        );
    }
    return (
        <FlatList
            data={places}
            renderItem={({ item }) => <PlaceItem place={item}/>}
            keyExtractor={(item) => item.id}
        />
    )
}

export default PlacesList;

const styles = StyleSheet.create({
    fallbackContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fallbackText: {
        fontSize: 16,
    }
})
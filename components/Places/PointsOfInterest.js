import React from 'react';
import {Image, StyleSheet, Text, View} from "react-native";
import OutlinedButton from "../UI/OutlinedButton";
import {Colors} from "../../constants/colors";

const PointsOfInterest = ({ fetchedPlace, maxResults, handleShowReviews }) => {
    return (
        fetchedPlace.nearbyPOIS && maxResults > 0 && fetchedPlace.nearbyPOIS.length > 0 && (
            <View style={styles.POIcontainer}>
                <View style={styles.ContainerSeparator}></View>
                <Text style={styles.label}>Points of interest in close proximity!</Text>
                {fetchedPlace.nearbyPOIS.slice(0, maxResults).map((poi, index) => (
                    <React.Fragment key={poi.place_id}>
                        <View style={styles.POIitem}>
                            <Image
                                style={styles.POIimage}
                                source={{ uri: fetchedPlace.poiPhotoPaths[index] }}
                            />
                            <View style={styles.POIinfo}>
                                <Text style={styles.POIinfoText}>
                                    {poi.name}
                                </Text>
                                <View style={styles.typeContainer}>
                                    {poi.types.map((type, index) => (
                                        <View style={styles.typeItem} key={index}>
                                            <Text style={styles.POIinfoSmallText}>
                                                {type.charAt(0).toUpperCase() + type.slice(1)}
                                            </Text>
                                        </View>
                                    ))}
                                </View>
                                {!poi.user_ratings_total
                                    ? (
                                        <Text style={styles.POIinfoText}>
                                            No reviews yet!
                                        </Text>
                                    )
                                    : (
                                        <>
                                            <Text style={styles.POIinfoText}>
                                                {poi.rating}⭐
                                            </Text>
                                            <Text style={styles.POIinfoSmallText}>
                                                {poi.user_ratings_total} total reviews
                                            </Text>
                                            <View>
                                                <OutlinedButton icon='chatbubbles'
                                                                children={`Discover public opinions about ${poi.name}`}
                                                                color={Colors.primary500}
                                                                onPress={() => handleShowReviews(poi.place_id)}/>
                                            </View>
                                        </>
                                    )
                                }
                            </View>
                        </View>
                        {/* separator*/}
                        {index !== Math.min(fetchedPlace.nearbyPOIS.length, maxResults) - 1 && (
                            <View style={styles.POIseparator}></View>
                        )}
                    </React.Fragment>
                ))}
            </View>
        )
    );
}

const styles = StyleSheet.create({
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.primary200,
        marginBottom: 10,
    },
    POIcontainer: {
        flex: 1,
        padding: 24,
    },
    POIitem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        borderRadius: 6,
        marginVertical: 12,
        backgroundColor: Colors.primary200,
        elevation: 2,
        shadowColor: 'black',
        shadowOpacity: 0.15,
        shadowOffset: { width: 1, height: 1 },
        shadowRadius: 2,
    },
    POIimage: {
        flex: 1,
        borderBottomLeftRadius: 4,
        borderTopLeftRadius: 4,
        height: '100%',
    },
    POIinfo: {
        flex: 2,
        padding: 12,
    },
    POIinfoText: {
        fontWeight: 'bold',
        fontSize: 18,
        color: Colors.gray700,
    },
    ContainerSeparator: {
        height: 3,
        backgroundColor: Colors.primary800,
    },
    POIseparator: {
        height: 3,
        backgroundColor: Colors.primary100,
    },
    POIinfoSmallText: {
        fontSize: 12,
        color: 'white',
    },
    typeContainer: {
        flexDirection: 'row', // this is to place the items next to each other
        flexWrap: 'wrap', // this allows the items to wrap to the next line if they don't fit
    },
    typeItem: {
        backgroundColor: Colors.primary700,
        margin: 2, // some margin to separate them
    },
});

export default PointsOfInterest;
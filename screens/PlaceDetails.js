import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Dimensions, Image, Pressable, ScrollView, StyleSheet, Text, View} from "react-native";
import OutlinedButton from "../components/UI/OutlinedButton";
import {Colors} from "../constants/colors";
import {downloadAndSavePOIPhoto, fetchPlaceDetails, getMaxPOIResultsSetting, updatePOIS} from "../util/database";
import ReviewsList from "../components/Places/PointOfInterestReviews";
import {fetchPointOfInterestReviews, getNearbyPointsOfInterest} from "../util/location";
import PointsOfInterest from "../components/Places/PointsOfInterest";
import formatDate from "../util/FormatDate";
import InterestingFactsCities from "../components/Places/InterestingFactsCities";
import ImageModal from "react-native-image-modal";

function PlaceDetails({ route, navigation }) {
    const [fetchedPlace, setFetchedPlace] = useState();
    const [currentReviews, setCurrentReviews] = useState([]);
    const [isReviewVisible, setIsReviewVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [maxResults, setMaxResults] = useState(null);

    const selectedPlacedId = route.params.placeId;

    useEffect(() => {
        async function loadPlaceData() {
            setIsLoading(true);
            const result = await getMaxPOIResultsSetting();
            setMaxResults(result);
            const place = await fetchPlaceDetails(selectedPlacedId);
            setFetchedPlace(place);
            navigation.setOptions({
                title: place.title,
            });
            await fetchData(place, result);
            setIsLoading(false);
        }

        async function fetchData(place, maxResults) {

            // Check if there are less fetched POIs than maxResults
            if (place.nearbyPOIS.length < maxResults) {
                // Fetch additional POIs
                const additionalPOIS = await getNearbyPointsOfInterest(place.location.lat, place.location.lng, maxResults);

                // Get photo paths for the new POIs and add them to the existing array
                const poiPhotoPaths = [...place.poiPhotoPaths];

                for (let i = place.nearbyPOIS.length; i < additionalPOIS.length; i++) {
                    if (additionalPOIS[i].photo_reference) {
                        const path = await downloadAndSavePOIPhoto(additionalPOIS[i].photo_reference);
                        poiPhotoPaths.push(path);
                    }
                }

                // Update the nearbyPOIS and poiPhotoPaths in the database
                await updatePOIS(place.id, additionalPOIS, poiPhotoPaths);

                // Update the fetchedPlace state
                setFetchedPlace({
                    ...place,
                    nearbyPOIS: additionalPOIS,
                    poiPhotoPaths
                });
            }
        }

        loadPlaceData();
    }, [selectedPlacedId]);


    if (!fetchedPlace) {
        return (
            <View style={styles.fallback}>
                <Text>No Place Data Available...</Text>
            </View>
        );
    }

    function showOnMapHandler() {
        navigation.navigate('Map', {
            initialLat: fetchedPlace.location.lat,
            initialLng: fetchedPlace.location.lng,
        });
    }

    async function handleShowReviews(placeId) {
        const reviews = await fetchPointOfInterestReviews(placeId);
        setCurrentReviews(reviews);
        setIsReviewVisible(true);
        console.log(reviews)
    }

    const closeModal = () => {
        setIsReviewVisible(false);
    };

    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;
    return (
        <ScrollView>




            {/*<Image style={styles.image} source={{ uri: fetchedPlace.imageUri }} resizeMode="stretch"/>*/}

            <ImageModal
                swipeToDismiss={true}
                resizeMode="stretch"
                imageBackgroundColor="#000000"
                style={{
                    width: screenWidth,
                    minHeight: 300,
                }}
                source={{
                    uri: fetchedPlace.imageUri}}
            />
            <View style={styles.locationContainer}>
                <Text style={styles.address}>{fetchedPlace.city} {formatDate(fetchedPlace.date)}</Text>
                <Text style={styles.address}>{fetchedPlace.countryFlagEmoji} {fetchedPlace.country}</Text>
                <View style={styles.addressContainer}>
                    <Text style={styles.address}>{fetchedPlace.address}</Text>
                    <InterestingFactsCities city={fetchedPlace.city}/>
                </View>
                <OutlinedButton
                    icon="map"
                    onPress={showOnMapHandler}
                    children="Show on Map"
                />
            </View>
            {
                isLoading || maxResults === null
                    ? (
                        <View style={styles.fallback}>
                            <ActivityIndicator size="large" color="#0000ff"/>
                        </View>
                    )
                    : (
                        <>
                            <PointsOfInterest
                                fetchedPlace={fetchedPlace}
                                maxResults={maxResults}
                                handleShowReviews={handleShowReviews}
                            />

                            <ReviewsList reviews={currentReviews} isVisible={isReviewVisible} closeModal={closeModal}/>
                        </>
                    )
            }
        </ScrollView>
    );
}

export default PlaceDetails;

const styles = StyleSheet.create({
    button: {
        width: '65%',
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: 12,
    },
    nearbyPOISContainer: {
        flex: 1,
        marginBottom: 200,
    },
    imageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    POIPhoto: {
        height: 200,
        width: '85%',
        borderRadius: 4,
    },
    fallback: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        minHeight: 300,
        width: '100%',
    },
    locationContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    addressContainer: {
        padding: 20,
    },
    address: {
        color: Colors.primary500,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16,
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
    POIseparator: {
        height: 3,
        backgroundColor: Colors.primary100,
    },
    POIinfoSmallText: {
        fontSize: 12,
        color: 'white',
    },
    typeContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    typeItem: {
        backgroundColor: Colors.primary700,
        margin: 2,
    },
});
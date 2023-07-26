import PlacesList from "../components/Places/PlacesList";
import React, {useContext, useEffect, useState} from 'react';
import {deletePlace, fetchPlaces, init} from "../util/database";
import {ActivityIndicator, StyleSheet, View} from "react-native";
import {Colors} from "../constants/colors";
import Filters from "../util/Filters";
import {SortContext} from "../util/SortContext";
import OutlinedButton from "../components/UI/OutlinedButton";
import {showMessage} from "react-native-flash-message";

function AllPlaces({ route, navigation }) {
    const { sort, setSort } = useContext(SortContext);
    const [loadedPlaces, setLoadedPlaces] = useState([]);
    const [filter, setFilter] = useState({ city: [], country: [] });
    const [cities, setCities] = useState([]);
    const [countries, setCountries] = useState([]);
    const [isLoading, setLoading] = useState(false);

    const loadPlaces = async () => {
        try {
            setLoading(true);
            await init();
            let places = await fetchPlaces(filter, sort);
            // If no places are found with the current filters, try again with no filters.
            // Reset filter state && fetch places with no filter
            if (places.length === 0 && (filter.city.length !== 0 || filter.country.length !== 0)) {
                setFilter({ city: [], country: [] });
                places = await fetchPlaces({}, sort);
            }
            setLoadedPlaces(places)
            if (places.length !== 0) {
                const uniqueCities = [...new Set(places.map(place => place.city))];
                const uniqueCountries = [...new Set(places.map(place => place.country))];
                const countryObjects = uniqueCountries.map(country => {
                    const flag = places.find(place => place.country === country).countryFlagEmoji;
                    return { country, flag };
                });
                setCountries(countryObjects);
                setCities(uniqueCities);
            }

        } catch (error) {
            showMessage({
                message: `Oops!`,
                description: `We encountered an error while loading your places. Please try again.`,
                type: "warning",
                icon: 'auto',
                floating: true,
                position: "top",
                autoHide: true,
            });
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        loadPlaces();
    }, [filter, sort, fetchPlaces, route.params?.createdPlace, route.params?.editedPlace]);

    const deletePlaceHandler = (id) => {
        // Database
        deletePlace(id)
            .then(() => {
                showMessage({
                    message: `Success`,
                    description: `The place has been successfully removed.`,
                    type: "default",
                    icon: 'auto',
                    floating: true,
                    position: "top",
                    autoHide: true,
                });
                // reload the data after deletion
                loadPlaces();
            })
            .catch((error) => {
                console.log(error);
                showMessage({
                    message: `Oops!`,
                    description: `We encountered an error while trying to delete the place. Please try again.`,
                    type: "warning",
                    icon: 'auto',
                    floating: true,
                    position: "top",
                    autoHide: true,
                });
            });
    }

    const handleFilterChange = (index, selectedFilter) => {
        const newFilter = { ...filter };
        if (index === 0) {
            let countryName = selectedFilter.split(" ").slice(1).join(" ");
            if (newFilter.country.includes(countryName)) {
                newFilter.country = newFilter.country.filter(country => country !== countryName);
            } else {
                newFilter.country.push(countryName);
            }
        } else if (index === 1) {
            if (newFilter.city.includes(selectedFilter)) {
                newFilter.city = newFilter.city.filter(city => city !== selectedFilter);
            } else {
                newFilter.city.push(selectedFilter);
            }
        }
        setFilter(newFilter);
    };

    return (
        <View style={styles.container}>
            {loadedPlaces.length > 0 &&
                <View>
                    <Filters
                        onChange={handleFilterChange}
                        selections={[filter.country, filter.city]}
                        filters={[
                            countries.map(countryObj => `${countryObj.flag} ${countryObj.country}`),
                            [...cities],
                        ]}
                    />
                </View>
            }
            {loadedPlaces.length > 0 &&
                <View>
                    <OutlinedButton onPress={() => {
                        navigation.navigate('GalleryScreen', { places: loadedPlaces })

                    }} children="Images Gallery" icon="images-outline"/>
                </View>
            }
            {isLoading ? (
                <ActivityIndicator size="large" color="#0000ff"/>
            ) : (
                <PlacesList places={loadedPlaces}
                            onDelete={deletePlaceHandler}/>
            )}
        </View>
    );
}

export default AllPlaces;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.gray700,
    },
})
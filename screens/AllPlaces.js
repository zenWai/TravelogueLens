import PlacesList from "../components/Places/PlacesList";
import React, { useContext, useEffect, useState } from 'react';
import {useIsFocused} from "@react-navigation/native";
import {fetchPlaces, init} from "../util/database";
import {Alert, StyleSheet, View} from "react-native";
import {Colors} from "../constants/colors";
import Filters from "../util/Filters";
import { SortContext} from "../util/SortContext";

function AllPlaces({ route }) {
    const { sort, setSort } = useContext(SortContext);
    const [loadedPlaces, setLoadedPlaces] = useState([]);
    const isFocused = useIsFocused();
    const [filter, setFilter] = useState({ city: [], country: []});
    const [cities, setCities] = useState([]);
    const [countries, setCountries] = useState([]);


    useEffect(() => {
        async function loadPlaces() {
            try {
                await init();
                const places = await fetchPlaces(filter, sort);
                setLoadedPlaces(places)
                console.log('logPlaces',places[0])
                const uniqueCities = [...new Set(places.map(place => place.city))];
                const uniqueCountries = [...new Set(places.map(place => place.country))];
                const countryObjects = uniqueCountries.map(country => {
                    const flag = places.find(place => place.country === country).countryFlagEmoji;
                    return { country, flag };
                });
                setCountries(countryObjects);

                setCities(uniqueCities);
            } catch (error) {
                console.log('Error loading places:', error);
            }
        }

        if (isFocused) {
            loadPlaces();
            /*setLoadedPlaces(curPlaces => [...curPlaces, route.params.place]);*/
        }
    }, [isFocused, filter, sort]);

    const deletePlaceHandler = (id) => {
        setLoadedPlaces(places => places.filter(place => place.id !== id));
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
            <PlacesList places={loadedPlaces}
                        onDelete={deletePlaceHandler}/>
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
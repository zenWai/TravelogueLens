import PlacesList from "../components/Places/PlacesList";
import {useEffect, useState} from "react";
import {useIsFocused} from "@react-navigation/native";
import {fetchPlaces, init} from "../util/database";

function AllPlaces({ route }) {
    const [loadedPlaces, setLoadedPlaces] = useState([]);
    const isFocused = useIsFocused();

    useEffect(() => {
        async function loadPlaces() {
            await init();
            const places = await fetchPlaces();
            setLoadedPlaces(places)
        }

        if (isFocused) {
            loadPlaces();
            /*setLoadedPlaces(curPlaces => [...curPlaces, route.params.place]);*/
        }
    }, [isFocused, loadedPlaces]);

    return (
        <PlacesList places={loadedPlaces}/>
    );
}

export default AllPlaces;
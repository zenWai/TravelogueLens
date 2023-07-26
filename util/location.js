import Constants from 'expo-constants';

const GOOGLE = Constants.expoConfig.extra.GOOGLE;

export function getMapPreview(lat, lng) {
    return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=14&size=400x200&maptype=roadmap&markers=color:red%7Clabel:S%7C${lat},${lng}&key=${GOOGLE}`;
}

export function getPOIPhoto(photo_reference) {
    const photoReference = photo_reference.replace(/(\r\n|\n|\r)/gm, '');
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoReference}&key=${GOOGLE}`;
}

export async function getAddress(lat, lng) {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE}`;
    try {
        const response = await fetch(url);
        const data = await response.json();

        let city = '';
        let country = '';
        let countryCode = '';
        console.log(JSON.stringify(data.results[0].address_components, null, 2));
        // Extract city and country from address components
        const addressComponents = data.results[0].address_components;
        for (const component of addressComponents) {
            const componentType = component.types[0];
            // Sometimes locality, postal_town empty, in UK specially
            if (!city && (componentType === 'locality' || componentType === 'postal_town')) {
                city = component.long_name;
            } else if (!city && (componentType === 'administrative_area_level_2')) {
                city = component.long_name;
            } else if (!city && (componentType === 'administrative_area_level_1')) {
                city = component.long_name;
            } else if (componentType === 'country') {
                country = component.long_name;
                countryCode = component.short_name;
            }
        }

        return {
            address: data.results[0].formatted_address,
            city: city,
            country: country,
            countryCode: countryCode,
        };
    } catch (error) {
        console.log('Error fetching address:');
        throw error;
    }
}

export function getNearbyPointsOfInterest(lat, lng, maxResults) {
    const radius = 20000; // Search radius in meters

    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&type=tourist_attraction&rankby=prominence&radius=${radius}&key=${GOOGLE}`;

    return fetch(url)
        .then(response => response.json())
        .then(data => {
            const desirableTypes = [
                'aquarium',
                'art_gallery',
                'casino',
                'museum',
                'landmark',
                'natural_feature',
                'town_square',
                'tourist_attraction',
                'park',
            ];
            //  the desirable places get prioritized and are moved to the front of the array.
            //  If there are not enough desirable places, point_of_interest places fill up the remaining spots up to maxResults
            const sortedPlaces = data.results.sort((a, b) => {
                const aIsDesirable = a.types.some(type => desirableTypes.includes(type));
                const bIsDesirable = b.types.some(type => desirableTypes.includes(type));
                // If a is desirable and b isn't, it returns -1, meaning a comes first
                if (aIsDesirable && !bIsDesirable) return -1;
                // If b is desirable and a isn't, it returns 1, meaning b comes first
                if (!aIsDesirable && bIsDesirable) return 1;
                // If both are desirable or neither are desirable, it then checks if a or b is a point_of_interest
                // If a is a point_of_interest and b isn't, it returns -1, meaning a comes first
                if (a.types.includes('point_of_interest') && !b.types.includes('point_of_interest')) return -1;
                // If b is a point_of_interest and a isn't, it returns 1, meaning b comes first
                if (!a.types.includes('point_of_interest') && b.types.includes('point_of_interest')) return 1;
                // If both or neither are point_of_interest, it returns 0, meaning their current order is preserved
                return 0;
            });

            return sortedPlaces
                .slice(0, maxResults)
                .map(formatPlace);
        })
        .catch(error => {
            console.log('Error fetching nearby points of interest:');
            throw error;
        });
}

function formatPlace(place) {
    return {
        name: place.name,
        photo_reference: place.photos ? place.photos[0].photo_reference : null,
        place_id: place.place_id,
        rating: place.rating,
        user_ratings_total: place.user_ratings_total,
        types: place.types.map(type => type.replace(/_/g, ' ')),
    };
}

export async function fetchPointOfInterestReviews(placeId) {
    const response = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&key=${GOOGLE}`);
    const data = await response.json();
    return data.result.reviews;
}
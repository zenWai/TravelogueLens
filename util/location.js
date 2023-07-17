import {GOOGLE_API_KEY} from '@env'


export function getMapPreview(lat, lng) {
    return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=14&size=400x200&maptype=roadmap&markers=color:red%7Clabel:S%7C${lat},${lng}&key=${GOOGLE_API_KEY}`;
}

export function getPOIPhoto(photo_reference) {
    const photoReference = photo_reference.replace(/(\r\n|\n|\r)/gm, '');
    const s = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoReference}&key=${GOOGLE_API_KEY}`;
    console.log(s);
    return s;
}

export async function getAddress(lat, lng) {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}`;
    try {
        const response = await fetch(url);
        const data = await response.json();

        let city = '';
        let country = '';
        let countryCode = '';

        // Extract city and country from address components
        const addressComponents = data.results[0].address_components;
        for (const component of addressComponents) {
            const componentType = component.types[0];
            if (componentType === 'locality') {
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
        console.log('Error fetching address:', error);
        throw error;
    }
}

export function getNearbyPointsOfInterest(lat, lng, maxResults) {
    const radius = 50000; // Search radius in meters

    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&key=${GOOGLE_API_KEY}`;

    return fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log('data results',data.results);
            console.log('data', data);
            console.log('data types:',data.types)
            const desirableTypes = [
                'aquarium',
                'art_gallery',
                'casino',
                'museum',
                'landmark',
                'natural_feature',
                'town_square',
                'tourist_attraction',
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

            const nearbyPOIs = sortedPlaces
                .slice(0, maxResults)
                .map(formatPlace);

            console.log(nearbyPOIs);
            return nearbyPOIs;
        })
        .catch(error => {
            console.log('Error fetching nearby points of interest:', error);
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
    const response = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&key=${GOOGLE_API_KEY}`);
    const data = await response.json();
    console.log(JSON.stringify(data.result, null, 2));
    return data.result.reviews;
}
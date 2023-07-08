import {GOOGLE_API_KEY} from '@env'

export function getMapPreview(lat, lng) {
    const imagePreviewUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=14&size=400x200&maptype=roadmap&markers=color:red%7Clabel:S%7C${lat},${lng}&key=${GOOGLE_API_KEY}`;
    return imagePreviewUrl;
}

export async function getAddress(lat, lng) {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
        if (data.results.length > 0) {
            const addressComponents = data.results[0].address_components;
            let city = '';
            let country = '';

            // Extract city and country from address components
            for (const component of addressComponents) {
                const componentType = component.types[0];
                if (componentType === 'locality') {
                    city = component.long_name;
                } else if (componentType === 'country') {
                    country = component.long_name;
                }
            }
            //TODO: city, country
            console.log(city);
            console.log(country);
            console.log(data.results[0].formatted_address);

            console.log('Address Components:', addressComponents);
        }
        return data.results[0].formatted_address;
    } catch (error) {
        console.log('Error fetching address:', error);
        throw error;
    }
}

export function getNearbyPointsOfInterest(lat, lng) {
    const radius = 5000; // Search radius in meters
    const maxResults = 2; // Maximum number of results to retrieve

    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&types=point_of_interest|tourist_attraction&key=${GOOGLE_API_KEY}`;

    return fetch(url)
        .then(response => response.json())
        .then(data => {
            // Filter and process the nearby places
            const nearbyPOIs = data.results.filter(place =>
                place.types.includes('point_of_interest') && place.types.includes('tourist_attraction')
            )
                .slice(0, maxResults) // Limit the number of results
                .map(place => {
                    return {
                        name: place.name,
                        photo_reference: place.photos ? place.photos[0].photo_reference : null,
                        place_id: place.place_id,
                        rating: place.rating
                    };
                });

            console.log(nearbyPOIs);

            return nearbyPOIs;
        })
        .catch(error => {
            console.log('Error fetching nearby points of interest:', error);
            throw error;
        });
}

export function InterestingFacts(city, country) {
    return fetch('https://us-central1-react-native-diary-photo.cloudfunctions.net/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            city: city,
            country: country
        }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                return data.message;
            } else {
                console.error('Unexpected API response');
                return '';
            }
        })
}
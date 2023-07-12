import {API_KEY} from '@env'

export function InterestingFacts(city) {
    return fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: 'You are a travel guide' },
                {
                    role: 'user',
                    content: `In less than 200 letters please tell me an intriguing geographical fact about the city of ${city} that a traveler would find fascinating.`
                }
            ],
            max_tokens: 88,
        }),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Received data:', data.choices[0].message);
            if (data.choices && data.choices[0] && data.choices[0].message) {
                return data.choices[0].message.content;
            } else {
                throw new Error('Unexpected API response');
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}
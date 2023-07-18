import {API_KEY} from '@env'

export function InterestingFacts(city, country) {
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
                    content: `Please tell me in less than 200 letters an intriguing geographical fact about the city of ${city},${country} that a tourist would find fascinating.`
                }
            ],
            max_tokens: 88,
        }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.choices && data.choices[0] && data.choices[0].message) {
                return data.choices[0].message.content;
            } else {
                console.error('Unexpected API response');
                return '';
            }
        })
}
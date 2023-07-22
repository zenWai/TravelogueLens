/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const functions = require("firebase-functions");
const axios = require('axios');
const API_KEY = functions.config().openai.key;

exports.chat = functions.https.onRequest(async (request, response) => {
    const { city, country } = request.body;

    try {
        const apiResponse = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: 'You are a travel guide' },
                {
                    role: 'user',
                    content: `Please tell me in less than 200 letters an intriguing geographical fact about the city of ${city},${country} that a tourist would find fascinating.`
                }
            ],
            max_tokens: 88,
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            }
        });

        if (apiResponse.data.choices && apiResponse.data.choices[0] && apiResponse.data.choices[0].message) {
            response.send({ message: apiResponse.data.choices[0].message.content });
        } else {
            console.error('Unexpected API response');
            response.status(500).send({ error: 'Unexpected API response' });
        }
    } catch (error) {
        console.error(error);
        response.status(500).send({ error: 'Error fetching data' });
    }
});

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

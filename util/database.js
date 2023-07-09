import * as SQLite from 'expo-sqlite';
import {Place} from "../models/place";
import * as FileSystem from 'expo-file-system';
import {getPOIPhoto} from "./location";
import countryCodeToEmoji from "./countryCodeToEmoji";
import AsyncStorage from "@react-native-async-storage/async-storage";

const database = SQLite.openDatabase('places.db');

export function init() {
    const promise = new Promise((resolve, reject) => {
        database.transaction((tx) => {
            tx.executeSql(`CREATE TABLE IF NOT EXISTS places
                           (
                               id               INTEGER PRIMARY KEY NOT NULL,
                               title            TEXT                NOT NULL,
                               imageUri         TEXT                NOT NULL,
                               address          TEXT                NOT NULL,
                               lat              REAL                NOT NULL,
                               lng              REAL                NOT NULL,
                               date             TEXT                NOT NULL,
                               nearbyPOIS       TEXT,
                               country          TEXT,
                               city             TEXT,
                               poiPhotoPaths    TEXT,
                               countryFlagEmoji TEXT
                           )`,
                [],
                () => {
                    resolve();
                },
                (_, error) => {
                    reject(error);
                }
            );
        });
    });
    return promise;
}

export function insertPlace(place) {
    const currentDate = new Date();
    const dateOptions = {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    };
    const formattedDate = currentDate.toLocaleDateString('en-US', dateOptions);
    console.log('place id:', place.id);
    console.log(place.city)
    console.log(place.country);
    const countryFlagEmoji = countryCodeToEmoji(place.countryCode);
    // expo-sqlite does not support array storing
    // So we convert the arrays into JSON strings
    const nearbyPOISString = JSON.stringify(place.nearbyPOIS);
    const poiPhotoPathsString = JSON.stringify(place.poiPhotoPaths);
    const promise = new Promise((resolve, reject) => {
        database.transaction((tx) => {
            tx.executeSql(
                `INSERT INTO places (title, imageUri, address, lat, lng, date, nearbyPOIS, country, countryFlagEmoji,
                                     city, poiPhotoPaths)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    place.title,
                    place.imageUri,
                    place.address,
                    place.location.lat,
                    place.location.lng,
                    formattedDate,
                    nearbyPOISString,
                    place.country,
                    countryFlagEmoji,
                    place.city,
                    poiPhotoPathsString,
                ],
                (_, result) => {
                    console.log("insert place:");
                    console.log(result);
                    resolve(result);
                },
                (_, error) => {
                    console.log(error);
                    reject(error);
                }
            );
        });
    });
    return promise;
}

export function updatePOIS(placeId, nearbyPOIS, poiPhotoPaths) {
    // Convert the arrays into JSON strings
    const nearbyPOISString = JSON.stringify(nearbyPOIS);
    const poiPhotoPathsString = JSON.stringify(poiPhotoPaths);

    const promise = new Promise((resolve, reject) => {
        database.transaction((tx) => {
            tx.executeSql(
                `UPDATE places
                 SET nearbyPOIS    = ?,
                     poiPhotoPaths = ?
                 WHERE id = ?`,
                [nearbyPOISString, poiPhotoPathsString, placeId],
                (_, result) => {
                    console.log("update POIS:");
                    console.log(result);
                    resolve(result);
                },
                (_, error) => {
                    console.log(error);
                    reject(error);
                }
            );
        });
    });

    return promise;
}

export function fetchPlaces() {
    const promise = new Promise((resolve, reject) => {
        database.transaction((tx) => {
            tx.executeSql('SELECT * FROM places',
                [],
                (_, result) => {
                    const places = [];
                    for (const dp of result.rows._array) {
                        places.push(new Place(
                                dp.title,
                                dp.imageUri,
                                {
                                    address: dp.address,
                                    lat: dp.lat,
                                    lng: dp.lng,
                                    country: dp.country,
                                    city: dp.city,
                                    countryFlagEmoji: dp.countryFlagEmoji,
                                },
                                dp.id,
                                dp.date,
                            )
                        );
                    }
                    resolve(places);
                },
                (_, error) => {
                    console.log(error);
                    reject(error);
                });
        });
    });
    return promise;
}

export function fetchPlaceDetails(id) {
    const promise = new Promise((resolve, reject) => {
        database.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM places WHERE id = ?',
                [id],
                (_, result) => {
                    const dbPlace = result.rows._array[0];
                    const place = new Place(
                        dbPlace.title,
                        dbPlace.imageUri,
                        {
                            lat: dbPlace.lat,
                            lng: dbPlace.lng,
                            address: dbPlace.address,
                            country: dbPlace.country,
                            countryFlagEmoji: dbPlace.countryFlagEmoji,
                            city: dbPlace.city
                        },
                        dbPlace.id,
                        dbPlace.date,
                        dbPlace.nearbyPOIS,
                        dbPlace.poiPhotoPaths,
                    );
                    place.nearbyPOIS = JSON.parse(dbPlace.nearbyPOIS);
                    place.poiPhotoPaths = JSON.parse(dbPlace.poiPhotoPaths);
                    console.log(place.poiPhotoPaths)
                    resolve(place);
                },
                (_, error) => {
                    reject(error);
                }
            );
        });
    });
    return promise;
}

export function deletePlace(id) {
    const promise = new Promise((resolve, reject) => {
        database.transaction((tx) => {
            tx.executeSql(
                'DELETE FROM places WHERE id = ?',
                [id],
                (_, result) => {
                    resolve(result);
                },
                (_, error) => {
                    reject(error);
                }
            );
        });
    });
    return promise;
}


export async function getMaxPOIResultsSetting() {
    const DEFAULT_MAX_RESULTS = 4;
    const storedMaxResults = await AsyncStorage.getItem('maxResults');
    return storedMaxResults ? parseInt(storedMaxResults, 10) : DEFAULT_MAX_RESULTS;
}

export async function downloadAndSavePOIPhoto(photo_reference) {
    const photoUrl = getPOIPhoto(photo_reference);

    // Define the path to save the image
    const path = `${FileSystem.documentDirectory}${photo_reference}.jpg`;

    // Download the image
    try {
        const downloadRes = await FileSystem.downloadAsync(photoUrl, path);

        if (downloadRes.status === 200) {
            console.log('Image downloaded and saved at path:', path);
            return path;
        } else {
            console.log('Failed to download image');
            return null;
        }
    } catch (error) {
        console.error(error);
        return null;
    }
}
import * as SQLite from 'expo-sqlite';
import {Place} from "../models/place";
import * as FileSystem from 'expo-file-system';
import {getPOIPhoto} from "./location";
import countryCodeToEmoji from "./countryCodeToEmoji";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {placeImages} from "./createFakeInfoPlaces";
import {Image} from 'react-native';
import {showMessage} from "react-native-flash-message";
import formatDate from "./FormatDate";

const database = SQLite.openDatabase('places.db');

export function init() {
    return new Promise((resolve, reject) => {
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
                               countryFlagEmoji TEXT,
                               interestingFact  TEXT
                           )`,
                [],
                () => {
                    tx.executeSql(
                        'CREATE INDEX IF NOT EXISTS idx_places_country ON places(country);',
                        [],
                        () => {
                            tx.executeSql(
                                'CREATE INDEX IF NOT EXISTS idx_places_city ON places(city);',
                                [],
                                resolve,
                                (_, error) => {
                                    reject(error);
                                    return false;
                                }
                            );
                        },
                        (_, error) => {
                            reject(error);
                            return false;
                        }
                    );
                },
                (_, error) => {
                    reject(error);
                }
            );
        });
    });
}

export function insertPlace(place) {
    // formattedDate = YYYY-MM-DD
    let formattedDate;
    if (place.date == null) {
        const currentDate = new Date();
        formattedDate = currentDate.toISOString().split('T')[0];
    } else {
        formattedDate = place.date;
    }
    const countryFlagEmoji = countryCodeToEmoji(place.countryCode);
    // expo-sqlite does not support array storing
    // converting the arrays into JSON strings
    const nearbyPOISString = JSON.stringify(place.nearbyPOIS);
    const poiPhotoPathsString = JSON.stringify(place.poiPhotoPaths);
    return new Promise((resolve, reject) => {
        database.transaction((tx) => {
            tx.executeSql(
                `INSERT INTO places (title, imageUri, address, lat, lng, date, nearbyPOIS, country, countryFlagEmoji,
                                     city, poiPhotoPaths, interestingFact)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
                    place.interestingFact,
                ],
                (_, result) => {
                    resolve(result);
                    showMessage({
                        message: `Congratulations!`,
                        description: `You've successfully created ${place.title.toUpperCase()}. This exciting place, captured on ${formatDate(formattedDate).toUpperCase()}, showcases the beauty of ${place.city.toUpperCase()}, ${countryFlagEmoji}. You must have had quite an adventure!`,
                        type: "success",
                        icon: 'auto',
                        floating: true,
                        position: "top",
                        autoHide: false,
                    });
                },
                (_, error) => {
                    console.log(error);
                    reject(error);
                }
            );
        });
    });
}

/* for FakeInfo */
export function insertFakePlaces(place) {
    // formattedDate = YYYY-MM-DD

    let formattedDate;
    if (place.date == null) {
        const currentDate = new Date();
        formattedDate = currentDate.toISOString().split('T')[0];
    } else {
        formattedDate = place.date;
    }
    const countryFlagEmoji = countryCodeToEmoji(place.countryCode);
    // expo-sqlite does not support array storing
    // converting the arrays into JSON strings
    const nearbyPOISString = JSON.stringify(place.nearbyPOIS);
    const poiPhotoPathsString = JSON.stringify(place.poiPhotoPaths);

    return new Promise((resolve, reject) => {
        database.transaction((tx) => {
            tx.executeSql(
                `INSERT INTO places (title, imageUri, address, lat, lng, date, nearbyPOIS, country, countryFlagEmoji,
                                     city, poiPhotoPaths, interestingFact)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
                    place.interestingFact,
                ],
                (_, result) => {
                    resolve(result);
                },
                (_, error) => {
                    console.log(error);
                    reject(error);
                }
            );
        });
    });
}

/* for FakeInfo */
export function getFakeImageURI(placeTitle) {
    // Return the local URI for the image
    return Image.resolveAssetSource(placeImages[placeTitle]).uri;
}

export function editPlace(id, title, date) {
    // Convert the arrays into JSON strings

    return new Promise((resolve, reject) => {
        database.transaction((tx) => {
            tx.executeSql(
                `UPDATE places
                 SET title = ?,
                     date  = ?
                 WHERE id = ?`,
                [title, date, id],
                (_, result) => {
                    resolve(result);
                },
                (_, error) => {
                    console.log(error);
                    reject(error);
                }
            );
        });
    });
}

export function updatePOIS(placeId, nearbyPOIS, poiPhotoPaths) {
    // Convert the arrays into JSON strings
    const nearbyPOISString = JSON.stringify(nearbyPOIS);
    const poiPhotoPathsString = JSON.stringify(poiPhotoPaths);

    return new Promise((resolve, reject) => {
        database.transaction((tx) => {
            tx.executeSql(
                `UPDATE places
                 SET nearbyPOIS    = ?,
                     poiPhotoPaths = ?
                 WHERE id = ?`,
                [nearbyPOISString, poiPhotoPathsString, placeId],
                (_, result) => {
                    resolve(result);
                },
                (_, error) => {
                    console.log(error);
                    reject(error);
                }
            );
        });
    });
}

export function fetchPlaces(filter = {}, sort) {
    // Filter Logic
    const { country, city } = filter;
    const params = [];
    let query = 'SELECT * FROM places';
    const conditions = [];
    if (city && city.length > 0) {
        const cityPlaceholders = city.map(() => '?').join(',');
        conditions.push(`city IN (${cityPlaceholders})`);
        params.push(...city);
    }
    if (country && country.length > 0) {
        const countryPlaceholders = country.map(() => '?').join(',');
        conditions.push(`country IN (${countryPlaceholders})`);
        params.push(...country);
    }
    if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
    }

    if (sort === "date_asc") {
        query += ' ORDER BY date ASC';
    } else if (sort === "date_desc") {
        query += ' ORDER BY date DESC';
    }

    return new Promise((resolve, reject) => {
        database.transaction((tx) => {
            tx.executeSql(
                query,
                params,
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
                                dp.poiPhotoPaths,
                                dp.interestingFact,
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
}

export function fetchPlaceDetails(id) {
    return new Promise((resolve, reject) => {
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
                        dbPlace.poiPhotoPaths,
                        dbPlace.interestingFact,
                    );
                    place.nearbyPOIS = JSON.parse(dbPlace.nearbyPOIS);
                    place.poiPhotoPaths = JSON.parse(dbPlace.poiPhotoPaths);
                    resolve(place);
                },
                (_, error) => {
                    reject(error);
                }
            );
        });
    });
}

export function deletePlace(id) {
    return new Promise((resolve, reject) => {
        database.transaction((tx) => {
            tx.executeSql(
                'DELETE FROM places WHERE id = ?',
                [id],
                (_, result) => {
                    resolve(result);
                },
                (_, error) => {
                    console.log(error);
                    reject(error);
                }
            );
        });
    });
}


export async function getMaxPOIResultsSetting(DEFAULT_MAX_RESULTS = 3) {
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
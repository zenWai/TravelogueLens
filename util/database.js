import * as SQLite from 'expo-sqlite';
import {Place} from "../models/place";

const database = SQLite.openDatabase('places.db');

export function init() {
    const promise = new Promise((resolve, reject) => {
        database.transaction((tx) => {
            tx.executeSql(`CREATE TABLE IF NOT EXISTS places
                           (
                               id       INTEGER PRIMARY KEY NOT NULL,
                               title    TEXT                NOT NULL,
                               imageUri TEXT                NOT NULL,
                               address  TEXT                NOT NULL,
                               lat      REAL                NOT NULL,
                               lng      REAL                NOT NULL,
                               date     TEXT                NOT NULL
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
    const promise = new Promise((resolve, reject) => {
        database.transaction((tx) => {
            tx.executeSql(
                `INSERT INTO places (title, imageUri, address, lat, lng, date)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    place.title,
                    place.imageUri,
                    place.address,
                    place.location.lat,
                    place.location.lng,
                    formattedDate,
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
                        { lat: dbPlace.lat, lng: dbPlace.lng, address: dbPlace.address },
                        dbPlace.id,
                        dbPlace.date,
                    );
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
import React from 'react';
import {AsyncStorage} from 'react-native';
import SQLite from 'react-native-sqlite-storage'

var db = SQLite.openDatabase({name: 'sqllite.db', location: 'default'},
    (() => console.log('Database opened successfully')),
    (() => console.log('Could not open database'))
);

function receiveLocations(locations) {
    return {
        payload: locations,
        type: 'LOCATIONS_CHANGED'
    };
}


export function fetchLocationsFromStorage() {
    console.log('fetching');
    return async dispatch => {
        db.transaction((tx) => {
            console.log('transaction started');
            tx.executeSql(
                'SELECT * FROM Locations', [], (tx, results) => {
                    console.log('transaction success');
                    console.log(JSON.parse(results.rows.item(0)));
                    return dispatch(receiveLocations((results.rows.item(0))));
                }
            )
        });
    }
}

//     return async dispatch => {
//         return await AsyncStorage.getItem('locationsCache')
//             .then(locations => {
//                 return dispatch(receiveLocations(JSON.parse(locations)))
//             });
//     };
// }


export function updateLocationsIntoStorage(locations) {

    db.transaction((tx) => {
        tx.executeSql('DROP TABLE Locations', [], () => console.log('Locations dropped'));
        tx.executeSql('CREATE TABLE Locations (json)', [], () => console.log('Locations created'));
        tx.executeSql('INSERT INTO Locations (json) VALUES (?)', [JSON.stringify(locations)], () => {
            console.log('locations updated')})
    });
    return async dispatch => {

    };
}

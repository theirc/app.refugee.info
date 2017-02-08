import SQLite from 'react-native-sqlite-storage';
import store from '../store';

SQLite.enablePromise(true);

function receiveLocations(locations) {
    return {
        payload: locations,
        type: 'LOCATIONS_CHANGED'
    };
}

function queryLocations(tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS locations (json blob)');

    tx.executeSql('SELECT * FROM locations').then(([, results]) => {
        let len = results.rows.length;
        let locations = [];
        for (let i = 0; i < len; i++) {
            locations.push((JSON.parse(results.rows.item(i).json)));
        }
        store.dispatch(receiveLocations(locations));
    }).catch((error) => {});
}


export function fetchLocationsFromStorage() {
    return async dispatch => {
        return await SQLite.openDatabase({name: 'sqllite.db', location: 'default'}).then((db) => {
            return db.transaction(queryLocations);
        }).catch((error) => {
        });
    };
}


export function updateLocationsIntoStorage(locations) {
    return async dispatch => {
        return await SQLite.openDatabase({name: 'sqllite.db', location: 'default'}).then((db) => {
            return db.transaction((tx) => {
                tx.executeSql('DELETE FROM locations');
                locations.forEach((location) => {
                    tx.executeSql('INSERT INTO locations values (?)', [JSON.stringify(location)]);
                });
            });
        }).catch((error) => {});
    };
}

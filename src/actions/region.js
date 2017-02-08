import SQLite from 'react-native-sqlite-storage';
import store from '../store';

SQLite.enablePromise(true);

function receiveRegion(region) {
    return {
        payload: region,
        type: 'REGION_CHANGED'
    };
}

function queryRegions(tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS regions (json blob)');

    tx.executeSql('SELECT * FROM regions').then(([, results]) => {
        let len = results.rows.length;
        let region = null;
        if (len > 0) {
            region = JSON.parse(results.rows.item(0).json);

        }
        return store.dispatch(receiveRegion(region));
    }).catch((error) => {});
}


export function fetchRegionFromStorage() {
    return async dispatch => {
        return await SQLite.openDatabase({name: 'sqllite.db', location: 'default'}).then((db) => {
            return db.transaction(queryRegions);
        }).catch((error) => {
        });
    };
}

export function updateRegionIntoStorage(region) {
    return async dispatch => {
        return await SQLite.openDatabase({name: 'sqllite.db', location: 'default'}).then((db) => {
            return db.transaction((tx) => {
                tx.executeSql('DELETE FROM regions');
                tx.executeSql('INSERT INTO regions values (?)', [JSON.stringify(region)]);
            });
        }).catch((error) => {});
    };
}

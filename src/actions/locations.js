import {AsyncStorage} from 'react-native';

function receiveLocations(locations) {
    return {
        payload: locations,
        type: 'RECEIVE_LOCATIONS'
    };
}

export function fetchLocationsFromStorage() {
    return async dispatch => {
        return await AsyncStorage.getItem('locationsCache')
            .then(locations => {
                return dispatch(receiveLocations(JSON.parse(locations)))
            });
    };
}


export function updateLocationsIntoStorage(locations) {
    return async dispatch => {
        return await AsyncStorage.setItem('locationsCache', JSON.stringify(locations));
    };
}

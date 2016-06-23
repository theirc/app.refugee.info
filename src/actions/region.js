import {AsyncStorage} from 'react-native';

function receiveRegion(region) {
    return {
        payload: region,
        type: 'RECEIVE_REGION'
    };
}

export function fetchRegionFromStorage() {
    return async dispatch => {
        return await AsyncStorage.getItem('regionCache')
            .then(region => {
              return dispatch(receiveRegion(JSON.parse(region)))
            });
    };
}


export function updateRegionIntoStorage(region) {
    return async dispatch => {
        return await AsyncStorage.setItem('regionCache', JSON.stringify(region));
    };
}

import {AsyncStorage} from 'react-native';

function receiveRegion(region) {
    return {
        payload: region,
        type: 'RECEIVE_REGION'
    };
}

export function fetchRegionFromStorage() {
    return dispatch => {
        AsyncStorage.getItem('region')
            .then(region => dispatch(receiveRegion(JSON.parse(region))));
    };
}

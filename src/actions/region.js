import {AsyncStorage} from 'react-native';
import {Regions} from '../data'

function receiveRegion(region) {
    return {
        payload: region,
        type: 'REGION_CHANGED'
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
        if (region) {
            await Regions.loadImportantInformation(region);
        }

        return await AsyncStorage.setItem('regionCache', JSON.stringify(region));
    };
}

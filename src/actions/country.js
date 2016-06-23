import {AsyncStorage} from 'react-native';

function receiveCountry(country) {
    return {
        payload: country,
        type: 'COUNTRY_CHANGED'
    };
}

export function fetchCountryFromStorage() {
    return async dispatch => {
        return await AsyncStorage.getItem('countryCache')
            .then(country => {
              return dispatch(receiveCountry(JSON.parse(country)))
            });
    };
}


export function updateCountryIntoStorage(country) {
    return async dispatch => {
        return await AsyncStorage.setItem('countryCache', JSON.stringify(country));
    };
}

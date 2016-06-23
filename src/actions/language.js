import {AsyncStorage} from 'react-native';

function reloadLanguage(language) {
    return {
        payload: language,
        type: 'CHANGE_LANGUAGE'
    };
}

export function fetchLanguageFromStorage() {
    return async dispatch => {
        return await AsyncStorage.getItem('language')
            .then(language => {
              return dispatch(reloadLanguage(language || 'en'))
            });
    };
}


export function updateLanguageIntoStorage(language) {
    return async dispatch => {
         return await AsyncStorage.setItem('language', language);
    };
}

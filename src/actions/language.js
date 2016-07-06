import {AsyncStorage} from 'react-native';
import I18n from '../constants/Messages'

function reloadLanguage(language) {
    return {
        payload: language,
        type: 'CHANGE_LANGUAGE'
    };
}

export function fetchLanguageFromStorage() {
    return async dispatch => {
        let currentLocale = I18n.locale.split('-')[0];

        return await AsyncStorage.getItem('language')
            .then(language => {
              return dispatch(reloadLanguage(language || currentLocale))
            });
    };
}


export function updateLanguageIntoStorage(language) {
    return async dispatch => {
         return await AsyncStorage.setItem('language', language);
    };
}

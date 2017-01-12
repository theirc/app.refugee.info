import {AsyncStorage} from 'react-native';
import I18n from '../constants/Messages';

function reloadDirection(direction) {
    return {
        payload: direction,
        type: 'DIRECTION_CHANGED'
    };
}

export function fetchDirectionFromStorage() {
    return async dispatch => {
        let currentLocale = I18n.locale.split('-')[0];
        let currentDirection = ['ar','fa'].indexOf(currentLocale) > -1 ? 'rtl' : 'ltr';

        return await AsyncStorage.getItem('direction')
            .then(direction => {
                return dispatch(reloadDirection(direction || currentDirection));
            });
    };
}

export function updateDirectionIntoStorage(direction) {
    return async dispatch => {
        return await AsyncStorage.setItem('direction', direction);
    };
}

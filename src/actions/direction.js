import {AsyncStorage} from 'react-native';

function reloadDirection(direction) {
    return {
        payload: direction,
        type: 'CHANGE_DIRECTION'
    };
}

export function fetchDirectionFromStorage() {
    return async dispatch => {
        return await AsyncStorage.getItem('direction')
            .then(direction => {
              return dispatch(reloadDirection(direction || 'ltr'))
            });
    };
}

export function updateDirectionIntoStorage(direction) {
    return async dispatch => {
        return await AsyncStorage.setItem('direction', direction);
    };
}

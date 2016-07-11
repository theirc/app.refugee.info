import {AsyncStorage} from 'react-native';

function receiveTheme(theme) {
    return {
        payload: theme,
        type: 'RECEIVE_THEME'
    };
}

export function fetchThemeFromStorage() {
    return async (dispatch) => {
        return await AsyncStorage.getItem('theme')
            .then(theme => {
              return dispatch(receiveTheme(theme || 'dark'))
            });
    };
}


export function updateThemeIntoStorage(theme) {
    return async (dispatch) => {
        return await AsyncStorage.setItem('theme', theme);
    };
}

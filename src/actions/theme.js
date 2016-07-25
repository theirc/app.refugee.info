import {AsyncStorage} from 'react-native';

function receiveTheme(theme) {
    return {
        payload: theme,
        type: 'THEME_CHANGED'
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

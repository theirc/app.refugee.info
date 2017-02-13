import {AsyncStorage} from 'react-native';

function receiveAbout(about) {
    return {
        payload: about,
        type: 'ABOUT_CHANGED'
    };
}

export function fetchAboutFromStorage() {
    return async dispatch => {
        return await AsyncStorage.getItem('aboutCache')
            .then(about => {
                return dispatch(receiveAbout(JSON.parse(about)));
            });
    };
}


export function updateAboutIntoStorage(about) {
    return async dispatch => {
        return await AsyncStorage.setItem('aboutCache', JSON.stringify(about));
    };
}

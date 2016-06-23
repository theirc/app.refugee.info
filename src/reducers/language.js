import { AsyncStorage } from 'react-native'

export default (state = 'en', action) => {
    switch (action.type) {
    case 'CHANGE_LANGUAGE':
        return action.payload;
    default:
        return state;
    }
};

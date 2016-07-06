import { AsyncStorage } from 'react-native'
import I18n from '../constants/Messages';

export default (state = null, action) => {
    switch (action.type) {
    case 'CHANGE_LANGUAGE':
        I18n.locale = action.payload;

        return action.payload;
    default:
        return state;
    }
};

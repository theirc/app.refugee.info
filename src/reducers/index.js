import { combineReducers } from 'redux';

import region from './region';
import navigation from './navigation';
import language from './language';

const refugeeApp = combineReducers({
    region,
    navigation,
    language
});

export default refugeeApp;

import { combineReducers } from 'redux';

import region from './region';
import navigation from './navigation';

const refugeeApp = combineReducers({
    region,
    navigation
});

export default refugeeApp;

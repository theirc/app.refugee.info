import { combineReducers } from 'redux';

import region from './region';
import navigation from './navigation';
import language from './language';
import theme from './theme';

const refugeeApp = combineReducers({
    region,
    navigation,
    language,
    theme
});

export default refugeeApp;

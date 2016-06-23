import { combineReducers } from 'redux';

import region from './region';
import navigation from './navigation';
import language from './language';
import direction from './direction';
import theme from './theme';
import country from './country';

const refugeeApp = combineReducers({
    region,
    navigation,
    language,
    direction,
    theme,
    country
});

export default refugeeApp;

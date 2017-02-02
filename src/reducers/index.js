import {combineReducers} from 'redux';

import region from './region';
import language from './language';
import direction from './direction';
import country from './country';
import drawerOpen from './drawerOpen';
import locations from './locations';
import routes from './routes';

const refugeeApp = combineReducers({
    region,
    language,
    direction,
    country,
    drawerOpen,
    locations,
    routes
});

export default refugeeApp;

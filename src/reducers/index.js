import {combineReducers} from 'redux';

import region from './region';
import language from './language';
import direction from './direction';
import country from './country';
import drawerOpen from './drawerOpen';
import locations from './locations';
import routes from './routes';
import about from './about';

const refugeeApp = combineReducers({
    region,
    language,
    direction,
    country,
    drawerOpen,
    locations,
    routes,
    about
});

export default refugeeApp;

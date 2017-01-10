import { combineReducers } from 'redux';

import region from './region';
import navigation from './navigation';
import language from './language';
import direction from './direction';
import country from './country';
import drawerOpen from './drawerOpen';
import toolbarTitle from './toolbarTitle';
import toolbarTitleIcon from './toolbarTitleIcon';
import toolbarTitleImage from './toolbarTitleImage';
import locations from './locations';

const refugeeApp = combineReducers({
    region,
    navigation,
    language,
    direction,
    country,
    drawerOpen,
    toolbarTitle,
    toolbarTitleIcon,
    toolbarTitleImage,
    locations
});

export default refugeeApp;

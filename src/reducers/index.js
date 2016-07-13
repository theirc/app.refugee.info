import { combineReducers } from 'redux';

import region from './region';
import navigation from './navigation';
import language from './language';
import direction from './direction';
import theme from './theme';
import country from './country';
import drawerOpen from './drawerOpen';
import toolbarTitle from './toolbarTitle';
import toolbarTitleIcon from './toolbarTitleIcon';

const refugeeApp = combineReducers({
    region,
    navigation,
    language,
    direction,
    theme,
    country,
    drawerOpen,
    toolbarTitle,
    toolbarTitleIcon
});

export default refugeeApp;

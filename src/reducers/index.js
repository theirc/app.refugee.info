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
import toolbarTitleImage from './toolbarTitleImage';

const refugeeApp = combineReducers({
    region,
    navigation,
    language,
    direction,
    theme,
    country,
    drawerOpen,
    toolbarTitle,
    toolbarTitleIcon,
    toolbarTitleImage,
});

export default refugeeApp;

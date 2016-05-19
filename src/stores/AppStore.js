import { AsyncStorage } from 'react-native';
import alt from '../alt';
import AppActions from '../actions/AppActions';

const THEME = '@Storage:theme';
const PRIMARY = '@Storage:primary';

class AppStore {

    constructor() {
        this._loadTheme();
        this._loadPrimary();

        this.bindListeners({
            handleUpdateTheme: AppActions.UPDATE_THEME,
            handleUpdatePrimary: AppActions.UPDATE_PRIMARY
        });
    }

    _loadTheme = () => {
        AsyncStorage.getItem(THEME).then((value) => {
            this.theme = value || 'light';
            AppActions.updateTheme(this.theme);
        });
    };

    _loadPrimary = () => {
        AsyncStorage.getItem(PRIMARY).then((value) => {
            this.primary = value || 'googleBlue';
            AppActions.updatePrimary(this.primary);
        });
    };

    handleUpdateTheme(name) {
        this.theme = name;
        AsyncStorage.setItem(THEME, name);
    }
    handleUpdatePrimary(name) {
        this.primary = name;
        AsyncStorage.setItem(PRIMARY, name);
    }

}

export default alt.createStore(AppStore, 'AppStore');

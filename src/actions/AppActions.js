import alt from '../alt';

class AppActions {

    updateTheme(theme) {
        return theme;
    }

    updatePrimary(primary) {
        return primary;
    }

}

export default alt.createActions(AppActions);

import React, {Component} from 'react';
import {
    AsyncStorage,
    View,
    AppState,
    UIManager
} from 'react-native';
import {connect} from 'react-redux';
import I18n from '../constants/Messages';
import Welcome from './Welcome';
import App from './App';
import {Presence} from '../data';
import {
    fetchCountryFromStorage,
    fetchDirectionFromStorage,
    fetchLanguageFromStorage,
    fetchLocationsFromStorage,
    fetchRegionFromStorage
} from '../actions';

let PushNotification = require('react-native-push-notification');

/**
 This class is the skeleton of the app.

 This was removed from the index.*.js because of loading the language on start up and showing up
 welcome screen.

 */
class Skeleton extends Component {
    constructor(props) {
        super(props);

        this.state = {
            firstLoad: true,
            storageLoaded: false
        };
        this.presenceData = new Presence(props, props.context);
    }

    componentWillMount() {
        this.checkLanguageSelected().then(() => {
            this.setState({storageLoaded: true});
        });

        this.askForPermissions();
        UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    componentDidMount() {
        AppState.addEventListener('change', this._handleAppStateChange);
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);
    }

    _handleAppStateChange() {
    }

    askForPermissions() {
        PushNotification.configure({
            // (optional) Called when Token is generated (iOS and Android)
            onRegister (token) {
                Presence.registerToken(token);
                monitor();
            },

            // (required) Called when a remote or local notification is opened or received
            onNotification () {
            },

            senderID: '5963561492',

            popInitialNotification: true,
            requestPermissions: true
        });

        const monitor = () => {
            const {region, language} = this.props;

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    // PUT ME IN THE REDUX
                    let {coords} = position;
                    Presence.registerLocation(coords).then(() => {
                        this.presenceData.recordPresence(region, language);
                    });

                    setTimeout(monitor, MONITOR_TIME_OUT);
                },
                (error) => {
                    this.presenceData.recordPresence(region, language);

                    setTimeout(monitor, MONITOR_TIME_OUT);
                }, {enableHighAccuracy: false, timeout: 5000, maximumAge: 1000}
            );
        };
        monitor();
    }

    async checkLanguageSelected() {
        let code = (I18n.currentLocale() || 'en').split('-')[0].split('_')[0];
        if (!I18n.translations.hasOwnProperty(code)) {
            // This means we don't have a translation for it
            // So fallback to English
            code = 'en';
        }

        // Instead of having the app handling the language selection we should
        // let the user override whatever they have set in their device
        await this.reloadStorage();

        let firstLoad = await AsyncStorage.getItem('firstLoad');
        let region = await AsyncStorage.getItem('regionCache');

        let isFirstLoad = (firstLoad !== 'false' || !(region));

        this.setState({firstLoad: isFirstLoad});
    }

    async reloadStorage() {
        const {dispatch} = this.props;

        await dispatch(fetchRegionFromStorage());
        await dispatch(fetchDirectionFromStorage());
        await dispatch(fetchLanguageFromStorage());
        await dispatch(fetchCountryFromStorage());
        await fetchLocationsFromStorage();
    }

    render() {
        if (!this.state.storageLoaded) {
            return <View />;
        }

        if (this.state.firstLoad) {
            return (
                <Welcome
                    finished={() => {
                        this.reloadStorage().then(() => {
                            AsyncStorage.setItem('firstLoad', 'false');
                            this.setState({ firstLoad: false });
                        });
                    }}
                    firstLoad={this.state.firstLoad}
                />
            );
        } else {
            return (
                <App />
            );
        }
    }
}

const mapStateToProps = (state) => {
    return {
        theme: state.theme,
        ...state
    };
};
const MONITOR_TIME_OUT = 5 * 60 * 1000; // 5 * 60 * 1000 milliseconds (5 minutes)

export default connect(mapStateToProps)(Skeleton);
import React, {Component, PropTypes} from 'react';
import {AsyncStorage, Image, StyleSheet, View, Text, AppState} from 'react-native';
import {connect} from 'react-redux';
import I18n from '../constants/Messages';
import Welcome from './Welcome';
import App from './App';
import {Presence} from '../data'

import {fetchRegionFromStorage} from '../actions/region';
import {fetchDirectionFromStorage} from '../actions/direction';
import {fetchLanguageFromStorage} from '../actions/language';
import {fetchCountryFromStorage} from '../actions/country';
import {fetchThemeFromStorage} from '../actions/theme'


var PushNotification = require('react-native-push-notification');

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
            storageLoaded: false,
        }
        this.presenceData = new Presence(props, props.context);
    }

    componentWillMount() {
        this.languagePromise = this.checkLanguageSelected().then(() => {
            this.setState({ storageLoaded: true });
        });

        this.askForPermissions();
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
            onRegister: function (token) {
                Presence.registerToken(token);
            },

            // (required) Called when a remote or local notification is opened or received
            onNotification: function (notification) {
            },

            // ANDROID ONLY: (optional) GCM Sender ID.

            // Should the initial notification be popped automatically
            // default: true
            popInitialNotification: true,
            requestPermissions: true,
        });

        const monitor = () => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    // PUT ME IN THE REDUX
                    let {coords} = position;
                    this.presenceData.registerPresence(coords, this.props.region);

                    setTimeout(monitor, MONITOR_TIME_OUT);
                },
                (error) => {
                    this.presenceData.registerPresence(null, this.props.region);

                    setTimeout(monitor, MONITOR_TIME_OUT);
                }, { enableHighAccuracy: false, timeout: 5000, maximumAge: 1000 }
            );
        }
        monitor();
    }

    async checkLanguageSelected() {
        let code = (I18n.currentLocale() || 'en').split('-')[0];
        if (!I18n.translations.hasOwnProperty(code)) {
            // This means we don't have a translation for it
            // So fallback to English
            code = 'en';
        }

        // Instead of having the app handling the language selection we should
        // let the user override whatever they have set in their device
        const {language} = this.state;
        await this.reloadStorage();

        let firstLoad = await AsyncStorage.getItem('firstLoad');
        let region = await AsyncStorage.getItem('regionCache');
        let theme = await AsyncStorage.getItem('theme');

        let isFirstLoad = (firstLoad !== 'false' || !(region && theme));

        this.setState({ firstLoad: isFirstLoad });
    }

    async reloadStorage() {
        const {dispatch} = this.props;

        await dispatch(fetchRegionFromStorage());
        await dispatch(fetchDirectionFromStorage());
        await dispatch(fetchLanguageFromStorage());
        await dispatch(fetchCountryFromStorage());
        await dispatch(fetchThemeFromStorage());
    }

    render() {
        if (!this.state.storageLoaded) {
            return <View />;
        }

        if (this.state.firstLoad) {
            return (
                <Welcome
                    theme={this.props.theme}
                    firstLoad={this.state.firstLoad}
                    finished={() => {
                        this.reloadStorage().then(() => {
                            AsyncStorage.setItem('firstLoad', 'false');
                            this.setState({ firstLoad: false });
                        });
                    } }
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
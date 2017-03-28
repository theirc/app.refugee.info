import React, {Component} from 'react';
import {
    AsyncStorage,
    View,
    AppState,
    UIManager,
    I18nManager,
    Platform
} from 'react-native';
import {connect} from 'react-redux';
import Welcome from './Welcome';
import App from './App';
import {Presence} from '../data';
import {
    fetchCountryFromStorage,
    fetchDirectionFromStorage,
    fetchLanguageFromStorage,
    fetchLocationsFromStorage,
    fetchRegionFromStorage,
    fetchAboutFromStorage
} from '../actions';
import RNRestart from 'react-native-restart';
import PushNotification from 'react-native-push-notification';
import {APP_DATA_VERSION} from '../constants';
import {updateRegionIntoStorage, updateLocationsIntoStorage} from '../actions';
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
        if (Platform.OS === 'ios') {
            const isRTL = I18nManager.isRTL;
            AsyncStorage.getItem('language').then((res) => {
                if (res === 'en') {
                    I18nManager.allowRTL(false);
                    I18nManager.forceRTL(false);
                } else {
                    I18nManager.allowRTL(true);
                    I18nManager.forceRTL(true);
                }
                if (I18nManager.isRTL && res === 'en') {
                    I18nManager.allowRTL(false);
                    I18nManager.forceRTL(false);
                    RNRestart.Restart();
                }
                if (!isRTL && (res === 'ar' || res === 'fa')) {
                    I18nManager.allowRTL(true);
                    I18nManager.forceRTL(true);
                    RNRestart.Restart();
                }
            });
        }
        AsyncStorage.getItem('appDataVersion').then((res) => {
            if (res !== APP_DATA_VERSION) {
                const dispatch = props.dispatch;
                Promise.all([
                    dispatch(updateRegionIntoStorage(null)),
                    dispatch(updateLocationsIntoStorage(null)),
                    AsyncStorage.setItem('language', ''),
                    AsyncStorage.setItem('firstLoad', '')
                ]).then(() => {
                    AsyncStorage.setItem('appDataVersion', APP_DATA_VERSION);
                });
            }
        });
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
        // Instead of having the app handling the language selection we should
        // let the user override whatever they have set in their device
        await this.reloadStorage();
        const firstLoad = await AsyncStorage.getItem('firstLoad');
        const region = this.state.region;
        const language = await AsyncStorage.getItem('language');
        const isFirstLoad = !language && (firstLoad !== 'false' || !(region));
        this.setState({firstLoad: isFirstLoad});
    }

    async reloadStorage() {
        const {dispatch} = this.props;

        await dispatch(fetchLanguageFromStorage());
        await dispatch(fetchCountryFromStorage());
        await dispatch(fetchDirectionFromStorage());
        await dispatch(fetchRegionFromStorage());
        await dispatch(fetchLocationsFromStorage());
        await dispatch(fetchAboutFromStorage());
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
                            this.setState({firstLoad: false});
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
        ...state
    };
};
const MONITOR_TIME_OUT = 5 * 60 * 1000; // 5 * 60 * 1000 milliseconds (5 minutes)

export default connect(mapStateToProps)(Skeleton);
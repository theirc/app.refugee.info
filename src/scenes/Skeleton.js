import React, {Component, PropTypes} from 'react';
import {AsyncStorage, Image, StyleSheet, View, Text, AppState} from 'react-native';
import {connect} from 'react-redux';
import DrawerCommons from '../utils/DrawerCommons';
import styles from '../styles';
import I18n from '../constants/Messages'
import Welcome from './Welcome'

import App from './App'
import store from '../store';

import {Provider} from 'react-redux';


/**
 This class is the skeleton of the app.

 This was removed from the index.*.js because of loading the language on start up and showing up
 welcome screen.

 */
class Skeleton extends Component {
    constructor(props) {
        super(props);

        this.state = {
            firstLoad: true
        }
    }

    componentWillMount() {
        this.languagePromise = this.checkLanguageSelected();
    }

    componentDidMount() {
        AppState.addEventListener('change', this._handleAppStateChange);
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);
    }

    _handleAppStateChange() {
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
        const firstLoad = await AsyncStorage.getItem('firstLoad', () => {
            this.setState({firstLoad: firstLoad !== 'false'});
        });
    }

    render() {
        if (this.state.firstLoad) {
            return (
                <Welcome
                    theme={this.props.theme}
                    firstLoad={this.state.firstLoad}
                    finished={()=> {
                        AsyncStorage.setItem('firstLoad','false');
                        this.setState({firstLoad: false});
                    }}
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
        theme: state.theme.theme,
        ...state
    };
};

export default connect(mapStateToProps)(Skeleton);

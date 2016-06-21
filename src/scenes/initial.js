import React, {Component, PropTypes} from 'react';
import {AsyncStorage, Image, StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import DrawerCommons from '../utils/DrawerCommons';
import styles from '../styles';
import I18n from '../constants/Messages'

class Initial extends Component {

    static contextTypes = {
        drawer: PropTypes.object.isRequired,
        navigator: PropTypes.object.isRequired
    };


    constructor(props) {
        super(props);
        this.drawerCommons = new DrawerCommons(this);
    }

    componentDidMount() {
        this.checkLanguageSelected().done();
    }

    async checkLanguageSelected() {

        const theme = await AsyncStorage.getItem('theme');
        const color = await AsyncStorage.getItem('color');
        const location = JSON.parse(await AsyncStorage.getItem('region'));

        let code = (I18n.currentLocale() || 'en').split('-')[0];
        if(!I18n.translations.hasOwnProperty(code)) {
          // This means we don't have a translation for it
          // So fallback to English
          code = 'en';
        }

        // Instead of having the app handling the language selection we should
        // let the user override whatever they have set in their device
        const languageOverride = await AsyncStorage.getItem('languageOverride');
        if (languageOverride) {
          code = languageOverride;
        }

        await AsyncStorage.setItem('langCode', code);

        this.drawerCommons.changeLanguage(code, false);

        if (theme && color) {
            this.drawerCommons.changeTheme(theme, color, false);
        }

        // If the location is already stored in the storage send to info page directly
        if (location) {
            if(location.content && location.content.length == 1) {
              // If info page has only one section, show only that section
              return this.context.navigator.to('infoDetails', location.content[0].title, {section: location.content[0].section})
            } else {
              let pageTitle = location.metadata.page_title.replace('\u060c', ',').split(',')[0];
              return this.context.navigator.to('info', pageTitle);
            }
        } else {
          // No location selected, so manual selection
          return this.context.navigator.to('countryChoice');
        }
    }

    render() {
        return (
            <View />
        );
    }
}

const mapStateToProps = (state) => {
    return {
        route: state.navigation,
        code: state.language,
        theme: state.theme.theme
    };
};

export default connect(mapStateToProps)(Initial);

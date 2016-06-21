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

        const isLanguageSelected = await AsyncStorage.getItem('isLanguageSelected');
        const theme = await AsyncStorage.getItem('theme');
        const color = await AsyncStorage.getItem('color');
        let location = await AsyncStorage.getItem('region');
        const code = await AsyncStorage.getItem('langCode');

        if (!code) {
          let languageCode = I18n.currentLocale().split('-')[0];
          await AsyncStorage.setItem('langCode', languageCode);
          await AsyncStorage.setItem('isLanguageSelected', 'true');
        }

        if (code) {
            this.drawerCommons.changeLanguage(code, false);
        }
        if (theme && color) {
            this.drawerCommons.changeTheme(theme, color, false);
        }

        if (location) {
            location = JSON.parse(location)
            if(location.content && location.content.length == 1) {
              return this.context.navigator.to('infoDetails', location.content[0].title, {section: location.content[0].section})
            } else {
              return this.context.navigator.to('info');
            }
        }
        return this.context.navigator.to('languageSelection');
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

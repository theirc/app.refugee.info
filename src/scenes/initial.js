import React, {Component, PropTypes} from 'react';
import {AsyncStorage, Image, StyleSheet, View} from 'react-native';

import Spinner from 'react-native-loading-spinner-overlay';
import {connect} from 'react-redux';
import {Drawer, Button} from 'react-native-material-design';
import LoadingView from '../components/LoadingView';
import DrawerCommons from '../utils/DrawerCommons';
import I18n from '../constants/Messages';

var styles = require('../styles');

class Initial extends Component {

    static contextTypes = {
        drawer: PropTypes.object.isRequired,
        navigator: PropTypes.object.isRequired
    };


    constructor(props) {
        super(props);
        this.state = {
            loaded: false
        };
        this.drawerCommons = new DrawerCommons(this);
    }

    componentDidMount() {
        this.checkLanguageSelected().done();
    }

    async checkLanguageSelected() {
        const isLanguageSelected = await AsyncStorage.getItem('isLanguageSelected');
        const code = await AsyncStorage.getItem('langCode');
        const theme = await AsyncStorage.getItem('theme');
        const color = await AsyncStorage.getItem('color');
        const location = await AsyncStorage.getItem('region');

        this.setState({'loaded': true});
        if (JSON.parse(isLanguageSelected)) {
            if (code) {
                this.drawerCommons.changeLanguage(code, false);
            }
            if (theme && color) {
                this.drawerCommons.changeTheme(theme, color, false);
            }

            if (location) {
                this.context.navigator.to('info');
            }
        }
        this.context.navigator.to('languageSelection');
    }

    render() {
        
        let {theme} = this.props;

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

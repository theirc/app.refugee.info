import React, { Component, PropTypes } from 'react';
import { AsyncStorage, Image, StyleSheet, View } from 'react-native';

import Spinner from 'react-native-loading-spinner-overlay';
import { connect } from 'react-redux';
import { Drawer, Button } from 'react-native-material-design';

import DrawerCommons from '../utils/DrawerCommons';
import I18n from '../constants/Messages';


class LanguageSelection extends Component {

    static contextTypes = {
        drawer: PropTypes.object.isRequired,
        navigator: PropTypes.object.isRequired
    };

    static renderLoadingView() {
        return (
            <View style={{ flex: 1 }}>
                <Spinner
                    overlayColor="#EEE"
                    visible
                />
            </View>
        );
    }

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
    }

    onPress() {
        AsyncStorage.setItem('isLanguageSelected', JSON.stringify(true));
        this.context.navigator.to('countryChoice');
    }

    render() {
        if (!this.state.loaded) {
            return LanguageSelection.renderLoadingView();
        }
        let {theme} = this.props;

        return (
            <Drawer theme={theme} style={styles.container}>
                <Image
                    resizeMode={Image.resizeMode.stretch}
                    source={require('../assets/earthsmall.png')}
                    style={styles.icon}
                />
                {this.drawerCommons.renderLanguageSection()}
                {this.drawerCommons.renderThemeSection()}
                <View style={styles.buttonContainer}>
                    <Button
                        onPress={() => this.onPress()}
                        raised
                        text={I18n.t('SELECT')}
                    />
                </View>
            </Drawer>
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column'
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'column'
    },
    icon: {
        flex: 0.33,
        width: 360,
        height: 185
    }
});

export default connect(mapStateToProps)(LanguageSelection);

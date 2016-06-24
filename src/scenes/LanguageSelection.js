import React, {Component, PropTypes} from 'react';
import {AsyncStorage, Image, StyleSheet, View} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import {connect} from 'react-redux';
import {Drawer, Button} from 'react-native-material-design';
import DrawerCommons from '../utils/DrawerCommons';
import I18n from '../constants/Messages';
import styles from '../styles';

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
                if(location.content && location.content.length == 1) {
                  this.context.navigator.to('infoDetails', null, {section: location.content[0].section, sectioNTitle: location.content[0].title})
                  return;

                } else {
                  this.context.navigator.to('info');
                }
            }
        }
    }

    onPress() {
        AsyncStorage.setItem('isLanguageSelected', JSON.stringify(true));
        this.context.navigator.to('countryChoice');
    }

    render() {
        let {theme} = this.props;

        return (
            <View style={styles.container}>
                <Image
                    resizeMode={Image.resizeMode.cover}
                    source={require('../assets/earthsmall.png')}
                    style={styles.logo}
                />
                <View style={styles.containerBelowLogo}>
                    <Drawer theme={theme}>
                        {this.drawerCommons.renderLanguageSection()}
                        {this.drawerCommons.renderThemeSection()}
                    </Drawer>
                    <View>
                        <Button
                            onPress={() => this.onPress()}
                            raised
                            text={I18n.t('SELECT')}
                        />
                    </View>
                </View>
            </View>
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

export default connect(mapStateToProps)(LanguageSelection);

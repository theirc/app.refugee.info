import React, {Component, PropTypes} from 'react';
import {AsyncStorage, Image, StyleSheet, View, Text, Dimensions, TouchableHighlight} from 'react-native';
import {connect} from 'react-redux';
import DrawerCommons from '../utils/DrawerCommons';
import styles, {themes, generateTextStyles, getUnderlayColor} from '../styles';
import I18n from '../constants/Messages'

import {updateLanguageIntoStorage} from '../actions/language'
import {updateDirectionIntoStorage} from '../actions/direction'
import {updateRegionIntoStorage} from '../actions/region'
import {updateCountryIntoStorage} from '../actions/country'
import {updateThemeIntoStorage} from '../actions/theme'

class Welcome extends Component {
    static propTypes = {
        firstLoad: React.PropTypes.bool,
        finished: React.PropTypes.func
    };
    state = {
        showTheme: false,
        showLanguage: false,
        languageSelected: false,
        themeSelected: false,
    }

    componentDidMount() {
        if (!this.props.firstLoad) {
            this.props.finished();
        }

        const {props} = this;

        let {language} = props;
        if (!language || this.state.languageSelected) {
            return;
        }

        if (['ar', 'fa'].indexOf(language) > -1) {
            /* Showing theme selection to arabic and farsi speakers
            TODO: Make this a little more dynamic */
            setTimeout(() => {
                if (!props.firstLoad) {
                    return;
                }

                this.setState({
                    showTheme: true,
                    languageSelected: true,
                    showLanguage: false,
                    themeSelected: false,
                });
            }, 1000);
        } else {
            setTimeout(() => {
                if (!props.firstLoad) {
                    return;
                }

                this.setState({
                    showTheme: false,
                    languageSelected: false,
                    showLanguage: true,
                    themeSelected: true,
                });
            }, 1000);
        }
    }

    async setLanguage(language) {
        const {dispatch} = this.props;

        await this.setState({
            languageSelected: true,
        });
        const direction = ['ar', 'fa'].indexOf(language) > -1 ? 'rtl' : 'ltr';

        await Promise.all([
            dispatch(updateDirectionIntoStorage(direction)),
            dispatch(updateLanguageIntoStorage(language)),
            dispatch({ type: "DIRECTION_CHANGED", payload: direction }),
            dispatch({ type: "CHANGE_LANGUAGE", payload: language })
        ]).then(() => {
            return this.setState({
                language: language,
                showTheme: true,
                showLanguage: false,
                themeSelected: false,
            });
        });
    }

    setTheme(theme) {
        const {dispatch} = this.props;
        Promise.all([
            dispatch(updateThemeIntoStorage(theme)),
            dispatch({ type: "THEME_CHANGED", payload: theme }),
        ]).then(() => this.props.finished());
    }


    renderLanguageSelection() {
        let {language} = this.props;

        return (
            <View>
                <View style={[
                    {
                        flexDirection: 'row',
                        position: 'absolute',
                        bottom: 45 * 3,
                        height: 45,
                        justifyContent: 'center',
                        borderBottomWidth: 1,
                        width: Dimensions.get('window').width,
                        backgroundColor: themes.dark.backgroundColor,
                    },
                ]}>
                    <View style={{ justifyContent: 'center' }}>
                        <Text style={[
                            styles.textAccentGreen,
                            generateTextStyles(language),
                            { fontSize: 13, alignItems: 'center' }
                        ]}>
                            {I18n.t('LANGUAGE').toUpperCase() } / LANGUAGE
                        </Text>
                    </View>
                </View>
                <TouchableHighlight
                    onPress={this.setLanguage.bind(this, 'en') }
                    underlayColor={getUnderlayColor('light') }
                    style={{ position: 'absolute', alignItems: 'center', bottom: 45 * 2, width: Dimensions.get('window').width }}
                    >
                    <View
                        style={{
                            flex: 1,
                            height: 45,
                            justifyContent: 'center',
                            backgroundColor: themes.light.backgroundColor,
                        }}
                        >
                        <Text style={[
                            { fontSize: 13, color: themes.light.textColor, },
                            generateTextStyles('en')
                        ]}>
                            English
                        </Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight
                    onPress={this.setLanguage.bind(this, 'ar') }
                    underlayColor={getUnderlayColor('light') }
                    style={{ position: 'absolute', alignItems: 'center', bottom: 45, width: Dimensions.get('window').width }}
                    >
                    <View
                        style={{
                            flex: 1,
                            height: 45,
                            justifyContent: 'center',
                            backgroundColor: themes.light.backgroundColor,
                        }}
                        >
                        <Text style={[
                            { fontSize: 13, color: themes.light.textColor, },
                            generateTextStyles('ar')
                        ]}>
                            العربيـة
                        </Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight
                    onPress={this.setLanguage.bind(this, 'fa') }
                    underlayColor={getUnderlayColor('light') }
                    style={{ position: 'absolute', alignItems: 'center', bottom: 0, width: Dimensions.get('window').width }}
                    >
                    <View
                        style={{
                            flex: 1,
                            height: 45,
                            justifyContent: 'center',
                            backgroundColor: themes.light.backgroundColor,
                        }}
                        >
                        <Text style={[
                            { fontSize: 13, color: themes.light.textColor, },
                            generateTextStyles('fa')
                        ]}>
                            فارسی
                        </Text>
                    </View>
                </TouchableHighlight>
            </View>);
    }

    renderThemeSelection() {
        let {language} = this.props;

        return (
            <View>
                <View style={[
                    {
                        flexDirection: 'row',
                        position: 'absolute',
                        bottom: 90,
                        height: 45,
                        justifyContent: 'center',
                        borderBottomWidth: 1,
                        width: Dimensions.get('window').width,
                        backgroundColor: themes.dark.backgroundColor,
                    },
                ]}>
                    <View style={{ justifyContent: 'center' }}>
                        <Text style={[
                            styles.textAccentGreen,
                            generateTextStyles(language),
                            { fontSize: 13, alignItems: 'center' }
                        ]}>
                            {I18n.t('THEME').toUpperCase() }
                        </Text>
                    </View>
                </View>
                <TouchableHighlight
                    onPress={this.setTheme.bind(this, 'light') }
                    underlayColor={getUnderlayColor('light') }
                    style={{ position: 'absolute', alignItems: 'center', bottom: 45, width: Dimensions.get('window').width }}
                    >
                    <View
                        style={{
                            flex: 1,
                            height: 45,
                            justifyContent: 'center',
                        }}
                        >
                        <Text style={[
                            { fontSize: 13, color: themes.light.textColor, },
                            generateTextStyles(language)
                        ]}>
                            {I18n.t('LIGHT') }
                        </Text>
                    </View>
                </TouchableHighlight>

                <TouchableHighlight
                    onPress={this.setTheme.bind(this, 'dark') }
                    underlayColor={getUnderlayColor('dark') }
                    style={{
                        position: 'absolute', bottom: 0, width: Dimensions.get('window').width,
                        backgroundColor: themes.dark.toolbarColor,
                    }}
                    >
                    <View
                        style={{
                            flex: 1,
                            height: 45,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                        >
                        <Text style={[
                            { fontSize: 13, color: themes.dark.textColor },
                            generateTextStyles(language)
                        ]}>
                            {I18n.t('DARK') }
                        </Text>
                    </View>
                </TouchableHighlight>
            </View>);
    }

    render() {
        const {theme} = this.props;
        const {showTheme, showLanguage} = this.state;
        const logo = require('../assets/splash-screen.png');

        return (
            <View style={localStyles.screen}>
                <View>
                    <Image
                        source={logo}
                        resizeMode={Image.resizeMode.contain}
                        style={[localStyles.logo]}
                        />
                    {showTheme && this.renderThemeSelection() }
                    {showLanguage && this.renderLanguageSelection() }
                </View>
            </View>
        )

    }
}

const localStyles = StyleSheet.create({
    screen: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: '#000000'
    },
    logo: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height
    }
});

function mapStateToProps(state) {
    return {
        language: state.language,
        direction: state.direction,
    };
}

export default connect(mapStateToProps)(Welcome);

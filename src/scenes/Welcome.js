import React, {Component, PropTypes} from 'react';
import {Image, StyleSheet, View, Text, Dimensions, TouchableOpacity, TouchableHighlight} from 'react-native';
import {connect} from 'react-redux';
import styles, {themes, getFontFamily, getUnderlayColor} from '../styles';
import I18n from '../constants/Messages';

import {updateLanguageIntoStorage} from '../actions/language';
import {updateDirectionIntoStorage} from '../actions/direction';


class Welcome extends Component {
    static propTypes = {
        dispatch: PropTypes.func,
        finished: PropTypes.func,
        firstLoad: PropTypes.bool
    };
    state = {
        showLanguage: false,
        languageSelected: false
    };

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
                
                this.setLanguage(language);
            }, 1000);
        } else {
            setTimeout(() => {
                if (!props.firstLoad) {
                    return;
                }

                this.setState({
                    languageSelected: false,
                    showLanguage: true
                });
            }, 1000);
        }
    }

    async setLanguage(language) {
        const {dispatch} = this.props;

        await this.setState({
            languageSelected: true
        });
        const direction = ['ar', 'fa'].indexOf(language) > -1 ? 'rtl' : 'ltr';
        this.setTheme('light');
        await Promise.all([
            dispatch(updateDirectionIntoStorage(direction)),
            dispatch(updateLanguageIntoStorage(language)),
            dispatch({ type: 'DIRECTION_CHANGED', payload: direction }),
            dispatch({ type: 'LANGUAGE_CHANGED', payload: language })
        ]).then(() => {
            return this.setState({
                language,
                showTheme: false,
                showLanguage: false,
                themeSelected: true
            });
        }).then(() => this.props.finished());
    }

    setTheme(theme) {
        const {dispatch} = this.props;
        Promise.all([
            dispatch(updateThemeIntoStorage(theme)),
            dispatch({ type: 'THEME_CHANGED', payload: theme })
        ]).then(() => this.props.finished());
    }


    renderLanguageSelection() {
        const {language} = this.props;

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
                        backgroundColor: themes.dark.backgroundColor
                    }
                ]}
                >
                    <View style={{ justifyContent: 'center' }}>
                        <Text style={[
                            styles.textAccentGreen,
                            getFontFamily(language),
                            { fontSize: 13, alignItems: 'center' }
                        ]}
                        >
                            {I18n.t('LANGUAGE').toUpperCase() }
                        </Text>
                    </View>
                </View>
                <TouchableHighlight
                    onPress={this.setLanguage.bind(this, 'en')}
                    underlayColor={getUnderlayColor('light')}
                    style={[buttonStyle, { bottom: 45 * 2 }]}
                >
                    <Text style={[
                        { fontSize: 13, color: themes.light.textColor },
                        getFontFamily('en')
                    ]}
                    >
                        English
                    </Text>
                </TouchableHighlight>
                <TouchableHighlight
                    onPress={this.setLanguage.bind(this, 'ar')}
                    underlayColor={getUnderlayColor('light')}
                    style={[buttonStyle, { bottom: 45 }]}
                >
                    <Text style={[
                        { fontSize: 13, color: themes.light.textColor },
                        getFontFamily('ar')
                    ]}
                    >
                        العربيـة
                    </Text>
                </TouchableHighlight>
                <TouchableHighlight
                    onPress={this.setLanguage.bind(this, 'fa')}
                    underlayColor={getUnderlayColor('light')}
                    style={[buttonStyle, { bottom: 0 }]}
                >
                    <Text style={[
                        { fontSize: 13, color: themes.light.textColor },
                        getFontFamily('fa')
                    ]}
                    >
                        فارسی
                    </Text>
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
                        backgroundColor: themes.dark.backgroundColor
                    }
                ]}
                >
                    <View style={{ justifyContent: 'center' }}>
                        <Text style={[
                            styles.textAccentGreen,
                            getFontFamily(language),
                            { fontSize: 13, alignItems: 'center' }
                        ]}
                        >
                            {I18n.t('THEME').toUpperCase() }
                        </Text>
                    </View>
                </View>
                <TouchableHighlight
                    onPress={this.setTheme.bind(this, 'light')}
                    underlayColor={getUnderlayColor('light')}
                    style={[buttonStyle, { bottom: 45 }]}
                >
                    <Text style={[
                        { fontSize: 13, color: themes.light.textColor },
                        getFontFamily(language)
                    ]}
                    >
                        {I18n.t('LIGHT') }
                    </Text>
                </TouchableHighlight>
                <TouchableOpacity
                    onPress={this.setTheme.bind(this, 'dark')}
                    activeOpacity={0.8}
                    style={[buttonStyle,
                        { bottom: 0, backgroundColor: themes.dark.toolbarColor }]}
                >
                    <Text style={[
                        { fontSize: 13, color: themes.dark.textColor },
                        getFontFamily(language)
                    ]}
                    >
                        {I18n.t('DARK') }
                    </Text>
                </TouchableOpacity>
            </View>);
    }

    render() {
        const {showLanguage} = this.state;
        const logo = require('../assets/splash-screen.png');

        return (
            <View style={localStyles.screen}>
                <View>
                    <Image
                        resizeMode={Image.resizeMode.cover}
                        source={logo}
                        style={[localStyles.logo]}
                    />
                    {showLanguage && this.renderLanguageSelection()}
                </View>
            </View>
        );
    }
}



const buttonStyle = {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    height: 45,
    width: Dimensions.get('window').width
};

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
        direction: state.direction
    };
}

export default connect(mapStateToProps)(Welcome);

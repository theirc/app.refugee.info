import React, {Component, PropTypes} from 'react';
import {
    AsyncStorage,
    Image,
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableHighlight
} from 'react-native';
import {connect} from 'react-redux';
import I18n from '../constants/Messages';
import styles, {themes, generateTextStyles, getUnderlayColor, getRowOrdering} from '../styles';
import Icon from 'react-native-vector-icons/Ionicons';
import {ListItem} from '../components';

import {updateLanguageIntoStorage} from '../actions/language'
import {updateDirectionIntoStorage} from '../actions/direction'
import {updateRegionIntoStorage} from '../actions/region'
import {updateCountryIntoStorage} from '../actions/country'
import {updateThemeIntoStorage} from '../actions/theme'

class Settings extends Component {

    static contextTypes = {
        navigator: PropTypes.object.isRequired
    };

    componentDidMount() {
        
    }

    setLanguage(lang) {
        this.setState({
            language: lang
        }, this.updateSettings(lang));
    }

    setTheme(theme) {
        const {navigator} = this.context;
        const {dispatch} = this.props;
        Promise.all([
            dispatch(updateThemeIntoStorage(theme)),
            dispatch({type: "THEME_CHANGED", payload: theme})
        ]).then(() => navigator.to('initial'));
    }

    updateSettings(language) {
        const {navigator} = this.context;
        const {theme, dispatch} = this.props;
        const direction = ['ar', 'fa'].indexOf(language) > -1 ? 'rtl' : 'ltr';

        AsyncStorage.getAllKeys().then(k => {
            AsyncStorage.multiRemove(k, (e) => {
                Promise.all([
                    dispatch(updateLanguageIntoStorage(language)),
                    dispatch(updateDirectionIntoStorage(direction)),
                    dispatch(updateRegionIntoStorage(null)),
                    dispatch(updateCountryIntoStorage(null)),
                    dispatch(updateThemeIntoStorage(theme)),
                    dispatch({type: "REGION_CHANGED", payload: null}),
                    dispatch({type: 'COUNTRY_CHANGED', payload: null}),
                    dispatch({type: "CHANGE_LANGUAGE", payload: language}),
                    dispatch({type: "DIRECTION_CHANGED", payload: direction}),
                    dispatch({type: "THEME_CHANGED", payload: theme})
                ]).then(() => navigator.to('initial'))
            });
        });
    }

    goToCountryChoice() {
        const {navigator} = this.context;
        navigator.to('countryChoice')
    }

    render() {
        const {theme, language, direction} = this.props;

        return (
            <ScrollView style={styles.container}>
                <ListItem
                    text={I18n.t('CHANGE_COUNTRY')}
                    icon="ios-flag"
                    iconColor={theme=='dark' ? themes.dark.textColor : themes.light.textColor}
                    fontSize={13}
                    onPress={this.goToCountryChoice.bind(this)}
                />

                <View style={[
                    getRowOrdering(direction),
                    {marginTop: 30, borderBottomWidth: 1},
                    theme=='dark' ? styles.bottomDividerDark : styles.bottomDividerLight
                ]}>
                    <View style={[
                        styles.alignCenter,
                        {height: 50, width: 50, marginRight: 10}
                    ]}>
                        <Icon
                            name="ios-chatboxes"
                            style={[
                            {fontSize: 24},
                            styles.textAccentGreen
                        ]}
                        />
                    </View>
                    <View style={{justifyContent: 'center'}}>
                        <Text style={[
                            styles.textAccentGreen,
                            generateTextStyles(language),
                            {fontSize: 13}
                        ]}>
                            {I18n.t('CHANGE_LANGUAGE').toUpperCase()}
                        </Text>
                    </View>
                </View>

                <ListItem
                    text={I18n.t('ENGLISH')}
                    onPress={this.setLanguage.bind(this, 'en')}
                    image={require('../assets/flags/gb.png')}
                />
                <ListItem
                    text={I18n.t('ARABIC')}
                    onPress={this.setLanguage.bind(this, 'ar')}
                    image={require('../assets/flags/_Arab_League.png')}

                />
                <ListItem
                    text={I18n.t('FARSI')}
                    onPress={this.setLanguage.bind(this, 'fa')}
                    image={require('../assets/flags/ir.png')}
                />
                
                <View style={[
                    getRowOrdering(direction),
                    {marginTop: 40, borderBottomWidth: 1},
                    theme=='dark' ? styles.bottomDividerDark : styles.bottomDividerLight
                ]}>
                    <View style={[
                        styles.alignCenter,
                        {height: 50, width: 50, marginRight: 10}
                    ]}>
                        <Icon
                            name="md-color-palette"
                            style={[
                            {fontSize: 24},
                            styles.textAccentGreen
                        ]}
                        />
                    </View>
                    <View style={{justifyContent: 'center'}}>
                        <Text style={[
                            styles.textAccentGreen,
                            generateTextStyles(language),
                            {fontSize: 13}
                        ]}>
                            {I18n.t('CHANGE_THEME').toUpperCase()}
                        </Text>
                    </View>
                </View>

                <TouchableHighlight
                    onPress={this.setTheme.bind(this, 'light')}
                    underlayColor={getUnderlayColor('light')}
                >
                    <View
                        style={{
                            flex: 1,
                            height: 45,
                            justifyContent: 'center',
                            backgroundColor: themes.light.backgroundColor,
                            paddingLeft: 20,
                            paddingRight: 20,
                            alignItems: direction=='rtl' ? 'flex-end' : 'flex-start'
                        }}
                    >
                        <Text style={[
                            {fontSize: 13, color: themes.light.textColor},
                            generateTextStyles(language)
                        ]}>
                            {I18n.t('LIGHT')}
                        </Text>
                    </View>
                </TouchableHighlight>

                <TouchableHighlight
                    onPress={this.setTheme.bind(this, 'dark')}
                    underlayColor={getUnderlayColor('dark')}
                >
                    <View
                        style={{
                            flex: 1,
                            height: 45,
                            justifyContent: 'center',
                            backgroundColor: themes.dark.toolbarColor,
                            paddingLeft: 20,
                            paddingRight: 20,
                            alignItems: direction=='rtl' ? 'flex-end' : 'flex-start'
                        }}
                    >
                        <Text style={[
                            {fontSize: 13, color: themes.dark.textColor},
                            generateTextStyles(language)
                        ]}>
                            {I18n.t('DARK')}
                        </Text>
                    </View>
                </TouchableHighlight>

            </ScrollView>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        route: state.navigation,
        language: state.language,
        theme: state.theme.theme,
        direction: state.direction
    };
};

export default connect(mapStateToProps)(Settings);

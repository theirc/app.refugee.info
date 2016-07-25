import React, {Component, PropTypes} from 'react';
import {
    AsyncStorage,
    Image,
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableHighlight,
    Dimensions
} from 'react-native';
import {connect} from 'react-redux';
import I18n from '../constants/Messages';
import styles, {
    themes,
    getFontFamily,
    getUnderlayColor,
    getRowOrdering,
    getBottomDividerColor
} from '../styles';
import {
    Icon,
    LoadingOverlay,
    ListItem
} from '../components';
import {
    updateCountryIntoStorage,
    updateDirectionIntoStorage,
    updateLanguageIntoStorage,
    updateLocationsIntoStorage,
    updateRegionIntoStorage,
    updateThemeIntoStorage
} from '../actions'

import ApiClient from '../utils/ApiClient';
import {Regions} from '../data';

var {width, height} = Dimensions.get('window');

class Settings extends Component {

    static contextTypes = {
        navigator: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            lastSync: null,
            loading: false
        };
    }

    setTheme(theme) {
        requestAnimationFrame(() => {
            const {dispatch} = this.props;
            Promise.all([
                dispatch(updateThemeIntoStorage(theme)),
                dispatch({type: "THEME_CHANGED", payload: theme})
            ]);
        });
    }

    async updateSettings(language) {
        this.setState({
            loading: true
        });
        const {navigator} = this.context;
        const {dispatch, region, country} = this.props;
        const direction = ['ar', 'fa'].indexOf(language) > -1 ? 'rtl' : 'ltr';

        this.apiClient = new ApiClient(this.context, {language: language});
        const regionData = new Regions({language: language});

        let newRegion = null;
        let newCountry = null;
        let newLocations = null;

        Promise.all([
            this.apiClient.getLocation(region.id),
            this.apiClient.getLocation(country.id),
        ]).then((values) => {
            newRegion = values[0];
            newCountry = values[1];
        }).then(() => {
            regionData.listChildren(newCountry, true, newRegion).then((value) => {
                newLocations = value.filter((c) => c.level != 2);
                newLocations.forEach((location) => {
                    if (location && location.metadata) {
                        location.pageTitle = (location.metadata.page_title || '').replace('\u060c', ',').split(',')[0];
                    }
                });
                Promise.all([
                    dispatch(updateLanguageIntoStorage(language)),
                    dispatch(updateDirectionIntoStorage(direction)),
                    dispatch(updateCountryIntoStorage(newCountry)),
                    dispatch(updateRegionIntoStorage(newRegion)),
                    dispatch(updateLocationsIntoStorage(newLocations)),
                    dispatch({type: "CHANGE_LANGUAGE", payload: language}),
                    dispatch({type: "CHANGE_DIRECTION", payload: direction}),
                    dispatch({type: "REGION_CHANGED", payload: newRegion}),
                    dispatch({type: 'COUNTRY_CHANGED', payload: newCountry}),
                    dispatch({type: 'LOCATIONS_CHANGED', payload: newLocations}),
                    dispatch({type: 'TOOLBAR_TITLE_CHANGED', payload: I18n.t('SETTINGS')})
                ]).then(this.setState({loading: false}))
            })})
    }

    goToCountryChoice() {
        const {navigator} = this.context;
        requestAnimationFrame(() => navigator.to('countryChoice'));
    }

    render() {
        const {theme, language, direction} = this.props;
        const {loading} = this.state;
        return (
            <ScrollView style={styles.container}>
                <ListItem
                    text={I18n.t('CHANGE_COUNTRY')}
                    icon="ios-flag"
                    iconColor={theme == 'dark' ? themes.dark.textColor : themes.light.textColor}
                    fontSize={13}
                    onPress={this.goToCountryChoice.bind(this)}
                />

                <View style={[
                    getRowOrdering(direction),
                    {marginTop: 30, borderBottomWidth: 1},
                    getBottomDividerColor(theme)
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
                            getFontFamily(language),
                            {fontSize: 13}
                        ]}>
                            {I18n.t('CHANGE_LANGUAGE').toUpperCase()}
                        </Text>
                    </View>
                </View>

                <ListItem
                    text={I18n.t('ENGLISH')}
                    onPress={this.updateSettings.bind(this, 'en')}
                />
                <ListItem
                    text={I18n.t('ARABIC')}
                    onPress={this.updateSettings.bind(this, 'ar')}

                />
                <ListItem
                    text={I18n.t('FARSI')}
                    onPress={this.updateSettings.bind(this, 'fa')}
                />

                <View style={[
                    getRowOrdering(direction),
                    getBottomDividerColor(theme),
                    {marginTop: 40, borderBottomWidth: 1}
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
                            getFontFamily(language),
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
                            alignItems: direction == 'rtl' ? 'flex-end' : 'flex-start'
                        }}
                    >
                        <Text style={[
                            {fontSize: 13, color: themes.light.textColor},
                            getFontFamily(language)
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
                            alignItems: direction == 'rtl' ? 'flex-end' : 'flex-start'
                        }}
                    >
                        <Text style={[
                            {fontSize: 13, color: themes.dark.textColor},
                            getFontFamily(language)
                        ]}>
                            {I18n.t('DARK')}
                        </Text>
                    </View>
                </TouchableHighlight>
                {loading && <LoadingOverlay theme={theme} height={height - 140} width={width}/>}
            </ScrollView>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        route: state.navigation,
        language: state.language,
        theme: state.theme,
        direction: state.direction,
        region: state.region,
        country: state.country
    };
};

export default connect(mapStateToProps)(Settings);

import React, {Component, PropTypes} from 'react';
import {Text, Image, View, ScrollView, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import {Avatar, Drawer, Divider, COLOR, TYPO} from 'react-native-material-design';

import {typography} from 'react-native-material-design-styles';

import { TouchableNativeFeedback, Platform} from "react-native";
import {Ripple, Icon} from 'react-native-material-design';

import I18n from '../constants/Messages';
import {capitalize} from '../utils/helpers';
import ApiClient from '../utils/ApiClient';
import DrawerCommons from '../utils/DrawerCommons';
import {Header, Section, DirectionalText, MenuSection, MenuItem} from '../components'
import CountryHeaders from '../constants/CountryHeaders'

import {updateRegionIntoStorage} from '../actions/region';
import {updateCountryIntoStorage} from '../actions/country';
import store from '../store';
import {Regions} from '../data';

const bullseye = require('../assets/icons/bullseye.png');

import styles, {generateTextStyles, themes} from '../styles'


export function isCompatible(feature) {
    const version = Platform.Version;

    switch (feature) {
        case 'TouchableNativeFeedback':
            return version >= 21;
            break;
        case 'elevation':
            return version >= 21;
            break;
        default:
            return true;
            break;
    }
}

class Navigation extends Component {

    static contextTypes = {
        drawer: PropTypes.object.isRequired,
        navigator: PropTypes.object
    };

    constructor(props) {
        super(props);
        this.drawerCommons = new DrawerCommons(this);
        this.state = {
            otherLocations: [],
        }
    }

    async componentWillReceiveProps(props) {
        if (props.country && props.region) {
            const children = await this.loadCities(props.country);

            this.setState({ otherLocations: children.slice(0, 5) });
        }
    }

    async loadCities(country) {
        let cities = [];
        const regionData = new Regions(new ApiClient(this.context, this.props));

        let children = await regionData.listChildren(country);

        children.forEach((c) => {
            if (c && c.metadata) {
                const pageTitle = (c.metadata.page_title || '')
                    .replace('\u060c', ',').split(',')[0];
                c.pageTitle = pageTitle;
            } 
        });

        return children;
    }

    _getImportantInformation() {
        const region = this.props.region;
        if (!region || !region.important_information) {
            return <View />;
        }
        let s = (scene, props) => this.drawerCommons.changeScene(scene, null, props);
        return region.important_information.map((i, index) => {
            if (i && i.metadata) {
                const pageTitle = (i.metadata.page_title || '')
                    .replace('\u060c', ',').split(',')[0];
                i.pageTitle = pageTitle;
            } 

            return (
                <MenuItem key={index} onPress={() => s('info', {information:i}) }>{i.pageTitle}</MenuItem>
            );
        });
    }

    async selectCity(city) {
        const { dispatch, country } = this.props;

        city.detected = false;
        city.coords = {};
        city.country = country;
        
        dispatch(updateRegionIntoStorage(city));
        dispatch(updateCountryIntoStorage(city.country));

        dispatch({ type: 'REGION_CHANGED', payload: city });
        dispatch({ type: 'COUNTRY_CHANGED', payload: city.country });

        this.drawerCommons.closeDrawer();

        if (city.content && city.content.length == 1) {
            return this.context.navigator.to('infoDetails', null, { section: city.content[0].section, sectionTitle: city.pageTitle });
        } else {
            return this.context.navigator.to('info', null, null, store.getState());
        }
    }

    render() {
        const {theme, route, region, country, direction, language} = this.props;
        const {navigator} = this.context;

        if (!this.props.region) {
            return <Text>Choose location first</Text>;
        }

        if (!this.props.country) {
            return <Text>Choose location first</Text>;
        }

        let importantInformationItems = this._getImportantInformation();
        let nearbyCitiesItems = this.state.otherLocations.map((i, index) => {
            return <MenuItem key={index} onPress={() => this.selectCity(i) }>{i.pageTitle}</MenuItem>;
        });
        let rectangularLogo = theme == 'light' ? themes.light.rectangularLogo : themes.dark.rectangularLogo;
        let styles = theme == 'light' ? lightNavigationStyles : darkNavigationStyles;

        // Shorthand to change scene
        let s = (scene) => this.drawerCommons.changeScene(scene);

        let headerImage = <Image source={bullseye} style={[
            { resizeMode: 'stretch', height: 20, width: 20, },
            (direction == 'ltr' ? { marginRight: 10 } : { marginLeft: 10 })
        ]} />;



        const isLTR = direction == 'ltr';

        return <ScrollView style={styles.view}>
            <View style={[styles.logoContainer, { justifyContent: ((isLTR) ? 'flex-start' : 'flex-end') }]}>
                <Image source={rectangularLogo} style={ styles.logo } />
            </View>
            <View style={[styles.titleWrapper, { justifyContent: ((isLTR) ? 'flex-start' : 'flex-end'), }]}>
                {(isLTR) && headerImage}
                <Text style={[generateTextStyles(language), styles.cityText]}>{region.pageTitle.toUpperCase() }</Text>
                {(!isLTR) && headerImage}
            </View>
            <MenuSection title={I18n.t("REFUGEE_INFO") }>
                <MenuItem icon="info" active={route === 'info'} onPress={() => s('info') }>{I18n.t('GENERAL_INFO') }</MenuItem>
                <MenuItem icon="list" active={route === 'services'} onPress={() => s('services') }>{I18n.t('SERVICE_LIST') }</MenuItem>
                <MenuItem icon="map" active={route === 'map'} onPress={() => s('map') }>{I18n.t('EXPLORE_MAP') }</MenuItem>
            </MenuSection>
            <MenuSection title={I18n.t("IMPORTANT_INFORMATION") }>
                {importantInformationItems}
            </MenuSection>
            <MenuSection title={I18n.t("CHANGE_LOCATION") }>
                {nearbyCitiesItems}
            </MenuSection>
            <MenuSection>
                <MenuItem icon="settings" active={route === 'settings'} onPress={() => s('settings') }>{I18n.t('SETTINGS') }</MenuItem>
                <MenuItem icon="info" active={route === 'about'} onPress={() => s('about') }>{I18n.t('ABOUT') }</MenuItem>
                <MenuItem icon="public" active={route === 'settings'} onPress={() => s('settings') }>{I18n.t('CONTACT_US') }</MenuItem>
                <MenuItem icon="settings" active={route === 'settings'} onPress={() => s('settings') }>{I18n.t('FEEDBACK') }</MenuItem>
            </MenuSection>
            <View style={{ paddingBottom: 15 }}>
            </View>
        </ScrollView>;
    }
}

const mapStateToProps = (state) => {
    return {
        route: state.navigation,
        region: state.region,
        country: state.country,
        language: state.language,
        direction: state.direction,
        theme: state.theme.theme,
        drawerOpen: state.drawerOpen
    };
};

const lightNavigationStyles = StyleSheet.create({
    logo: {
        width: 150,
        resizeMode: 'contain',
        marginTop: 10,
    },
    logoContainer: {
        flex: 1,
        flexDirection: 'row',
        marginRight: 10,
    },
    view: {
        flexDirection: 'column',
        flex: 1,
        paddingLeft: 20,
    },
    middleBorder: {
        borderLeftColor: themes.light.darkerDividerColor,
        borderLeftWidth: 1,
    },
    outermostBorder: {
        borderLeftColor: themes.light.dividerColor,
        borderLeftWidth: 1,
    },
    titleWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 30,
        marginBottom: 15,
        paddingRight: 10
    },
    cityText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: themes.light.textColor,
    }
});

const darkNavigationStyles = StyleSheet.create({
    logo: {
        width: 150,
        resizeMode: 'contain',
        marginTop: 10,
    },
    logoContainer: {
        flex: 1,
        flexDirection: 'row',
        marginRight: 10,
    },
    view: {
        flexDirection: 'column',
        flex: 1,
        paddingLeft: 20,
    },
    middleBorder: {
        borderLeftColor: themes.dark.darkerDividerColor,
        borderLeftWidth: 1,
    },
    outermostBorder: {
        borderLeftColor: themes.dark.dividerColor,
        borderLeftWidth: 1,
    },
    titleWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 30,
        marginBottom: 15,
        paddingRight: 10
    },
    cityText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: themes.dark.textColor,
    }
});

export default connect(mapStateToProps)(Navigation);

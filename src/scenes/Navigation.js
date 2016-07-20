import React, {Component, PropTypes} from 'react';
import {Text, Image, View, ScrollView, StyleSheet, Linking} from 'react-native';
import {connect} from 'react-redux';
import I18n from '../constants/Messages';
import ApiClient from '../utils/ApiClient';
import DrawerCommons from '../utils/DrawerCommons';
import {MenuSection, MenuItem} from '../components'
import {updateRegionIntoStorage} from '../actions/region';
import {updateCountryIntoStorage} from '../actions/country';
import store from '../store';
import {Regions} from '../data';
import {Icon} from '../components';
import styles, {getFontFamily, getRowOrdering, themes} from '../styles'

const FEEDBACK_MAP = {
    ar: 'https://docs.google.com/forms/d/16KxtpLbQbdj7ohkpAxws65aZuWfeQa8jjgCBvcptfkk/viewform?entry.1237329743=',
    en: 'https://docs.google.com/forms/d/1gc-hN_p5pqC3DoPXxTfCAmlIiCEd1mOIdQMWeAz2n_U/viewform?entry.1237329743=',
    fa: 'https://docs.google.com/forms/d/1Kn2L3mEEFAGgn1YrRpaA7bHNTrKXrw8-zp0w6xfz5o0/viewform?entry.1237329743=',
    ps: 'https://docs.google.com/forms/d/1pQD6q3dE-0SsFtxmTGnn5q9GJHNeLBPoIJ_sZjBR1VQ/viewform?entry.1237329743=',
};

class Navigation extends Component {

    static contextTypes = {
        drawer: PropTypes.object.isRequired,
        navigator: PropTypes.object
    };

    constructor(props) {
        super(props);
        this.drawerCommons = new DrawerCommons(this);
        this.state = {
            otherLocations: []
        }
    }

    async componentWillReceiveProps(props) {
        if (props.country && props.region) {
            const children = await this.loadCities(props.country);

            this.setState({otherLocations: children});
        }
    }

    async loadCities(country) {
        let cities = [];
        const regionData = new Regions(this.props);
        const {region} = this.props;

        let children = (await regionData.listChildren(country, false, region)).filter((c) => c.level != 2);

        children.forEach((c) => {
            if (c && c.metadata) {
                const pageTitle = (c.metadata.page_title || '')
                    .replace('\u060c', ',').split(',')[0];
                c.pageTitle = pageTitle;
            }
        });

        return children;
    }

    _getImportantInformationImage(theme, pageTitle) {
        if (theme == 'dark') {
            if (pageTitle.toLowerCase().includes('safe'))
                return require('../assets/icons/staying-safe-dark.png');
            else return require('../assets/icons/asylum-procedure-dark.png')
        }
        else {
            if (pageTitle.toLowerCase().includes('safe'))
                return require('../assets/icons/staying-safe-light.png');
            else return require('../assets/icons/asylum-procedure-light.png')
        }
    }

    _getImportantInformation() {
        const {region, theme} = this.props;
        if (!region || !region.important_information) {
            return <View />;
        }

        return region.important_information.map((i, index) => {
            if (i && i.metadata) {
                const pageTitle = (i.metadata.page_title || '')
                    .replace('\u060c', ',').split(',')[0];
                i.pageTitle = pageTitle;
            }

            return (
                <MenuItem
                    icon={i.icon}
                    key={index}
                    onPress={() => this._defaultOrFirst(i, true) }
                >
                    {i.pageTitle}
                </MenuItem>
            );
        });
    }

    _defaultOrFirst(page, showTitle = false) {
        this.drawerCommons.closeDrawer();

        if (page.content && page.content.length == 1) {
            return this.context.navigator.to('infoDetails', null, {
                section: page.content[0].section,
                sectionTitle: page.pageTitle,
                showTitle: showTitle
            });
        } else {
            let payload = {region: page.code ? page : null, information: page.code ? null : page}
            return this.context.navigator.to('info', null, payload);
        }
    }

    async selectCity(city) {
        const {dispatch, country} = this.props;

        city.detected = false;
        city.coords = {};
        city.country = country;

        dispatch(updateRegionIntoStorage(city));
        dispatch(updateCountryIntoStorage(city.country));

        dispatch({type: 'REGION_CHANGED', payload: city});
        dispatch({type: 'COUNTRY_CHANGED', payload: city.country});


        return this._defaultOrFirst(city);
    }

    render() {
        const {theme, route, region, country, direction, language} = this.props;
        const {navigator} = this.context;
        let feedbackUrl = (FEEDBACK_MAP[language] || FEEDBACK_MAP.en) + (region && region.slug);

        if (!this.props.region || !this.props.country) {
            return <Text>Choose location first</Text>;
        }

        let importantInformationItems = this._getImportantInformation();
        let nearbyCitiesItems = this.state.otherLocations.map((i, index) => {
            return <MenuItem key={index} onPress={() => this.selectCity(i) }>{i.pageTitle || i.name}</MenuItem>;
        });
        let logo = theme == 'light' ? themes.light.drawerLogo : themes.dark.drawerLogo;
        let styles = theme == 'light' ? lightNavigationStyles : darkNavigationStyles;

        // Shorthand to change scene
        let s = (scene) => this.drawerCommons.changeScene(scene);

        let headerImage = <Icon
            name="md-locate"
            style={[
                { fontSize: 20, color: themes.light.greenAccentColor, marginTop: 2 },
                (direction == 'ltr' ? { marginRight: 10 } : { marginLeft: 10 })
            ]}
        />;

        let bannerCount = region.metadata.banners.length;
        const isLTR = direction == 'ltr';

        return <ScrollView style={styles.view}>
            <View style={[styles.logoContainer, getRowOrdering(direction)]}>
                <Image source={logo} style={ styles.logo }/>
            </View>
            <View style={[styles.titleWrapper, getRowOrdering(direction)]}>
                <Icon
                    name="md-locate"
                    style={[
                        { fontSize: 20, color: themes.light.greenAccentColor, marginTop: 2 },
                        (direction == 'ltr' ? { marginRight: 10 } : { marginLeft: 10 })
                    ]}
                />
                <Text style={[
                    getFontFamily(language),
                    styles.cityText
                ]}>
                    {region.pageTitle.toUpperCase() }
                </Text>
            </View>
            <MenuSection title={I18n.t("REFUGEE_INFO") }>
                <MenuItem
                    icon="fa-info"
                    active={route === 'info'}
                    onPress={() => this._defaultOrFirst(region) }
                >
                    {I18n.t('GENERAL_INFO') }
                </MenuItem>
                <MenuItem
                    icon="fa-list"
                    active={route === 'services'}
                    onPress={() => s('services') }
                >
                    {I18n.t('SERVICE_LIST') }
                </MenuItem>
                <MenuItem
                    icon="fa-map"
                    active={route === 'map'}
                    onPress={() => s('map') }
                >
                    {I18n.t('EXPLORE_MAP') }
                </MenuItem>
            </MenuSection>
            <MenuSection>
                <MenuItem
                    icon="ios-mail" onPress={() => s('notifications') }
                    badge={bannerCount}>{I18n.t('ANNOUNCEMENTS') }</MenuItem>
                <MenuItem
                    icon="ios-paper" onPress={() => s('news') }>{I18n.t('NEWS') }</MenuItem>
            </MenuSection>
            <MenuSection title={I18n.t("IMPORTANT_INFORMATION") }>
                {importantInformationItems}
            </MenuSection>
            <MenuSection title={I18n.t("CHANGE_LOCATION") }>
                {nearbyCitiesItems}
            </MenuSection>
            <MenuSection>
                <MenuItem
                    icon="fa-gear"
                    active={route === 'settings'}
                    onPress={() => s('settings') }
                >
                    {I18n.t('SETTINGS') }
                </MenuItem>
                <MenuItem
                    icon="fa-question"
                    active={route === 'about'}
                    onPress={() => s('about') }
                >
                    {I18n.t('ABOUT') }
                </MenuItem>
                <MenuItem
                    icon="fa-envelope"
                    active={route === 'contact'}
                    onPress={() => s('contact') }
                >
                    {I18n.t('CONTACT_US') }
                </MenuItem>
                <MenuItem
                    icon="fa-comment"
                    onPress={() => Linking.openURL(feedbackUrl) }>
                    {I18n.t('FEEDBACK') }
                </MenuItem>
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
        theme: state.theme,
        drawerOpen: state.drawerOpen
    };
};

const lightNavigationStyles = StyleSheet.create({
    logo: {
        width: 150,
        resizeMode: 'contain',
        marginTop: 40
    },
    logoContainer: {
        flex: 1,
        flexDirection: 'row',
        marginRight: 10
    },
    view: {
        flexDirection: 'column',
        flex: 1,
        paddingLeft: 20
    },
    middleBorder: {
        borderLeftColor: themes.light.darkerDividerColor,
        borderLeftWidth: 1
    },
    outermostBorder: {
        borderLeftColor: themes.light.dividerColor,
        borderLeftWidth: 1
    },
    titleWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 30,
        marginBottom: 30,
        paddingRight: 10
    },
    cityText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: themes.light.textColor
    }
});

const darkNavigationStyles = StyleSheet.create({
    logo: {
        width: 150,
        resizeMode: 'contain',
        marginTop: 40
    },
    logoContainer: {
        flex: 1,
        flexDirection: 'row',
        marginRight: 10,
        marginTop: 0
    },
    view: {
        flexDirection: 'column',
        flex: 1,
        paddingLeft: 20
    },
    middleBorder: {
        borderLeftColor: themes.dark.darkerDividerColor,
        borderLeftWidth: 1
    },
    outermostBorder: {
        borderLeftColor: themes.dark.dividerColor,
        borderLeftWidth: 1
    },
    titleWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 30,
        marginBottom: 30,
        paddingRight: 10
    },
    cityText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: themes.dark.textColor
    }
});

export default connect(mapStateToProps)(Navigation);

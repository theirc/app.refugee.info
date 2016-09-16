import React, {
    Component,
    PropTypes
} from 'react';
import {
    Text,
    Image,
    View,
    ScrollView,
    StyleSheet,
    Linking,
    Platform
} from 'react-native';
import {connect} from 'react-redux';
import I18n from '../constants/Messages';
import DrawerCommons from '../utils/DrawerCommons';
import {MenuSection, MenuItem} from '../components';
import {
    updateRegionIntoStorage,
    updateCountryIntoStorage,
    updateLocationsIntoStorage
} from '../actions';
import {Icon} from '../components';
import {
    getFontFamily,
    getRowOrdering,
    themes
} from '../styles'
import {Regions} from '../data';
import {RNMail as Mailer} from 'NativeModules';

const FEEDBACK_MAP = {
    ar: 'https://docs.google.com/forms/d/16KxtpLbQbdj7ohkpAxws65aZuWfeQa8jjgCBvcptfkk/viewform?entry.1237329743=',
    en: 'https://docs.google.com/forms/d/1gc-hN_p5pqC3DoPXxTfCAmlIiCEd1mOIdQMWeAz2n_U/viewform?entry.1237329743=',
    fa: 'https://docs.google.com/forms/d/1Kn2L3mEEFAGgn1YrRpaA7bHNTrKXrw8-zp0w6xfz5o0/viewform?entry.1237329743=',
    ps: 'https://docs.google.com/forms/d/1pQD6q3dE-0SsFtxmTGnn5q9GJHNeLBPoIJ_sZjBR1VQ/viewform?entry.1237329743=',
};

const LIKE_URL = 'https://www.facebook.com/refugee.info/';

class Navigation extends Component {

    static contextTypes = {
        drawer: PropTypes.object.isRequired,
        navigator: PropTypes.object
    };

    constructor(props) {
        super(props);
        this.drawerCommons = new DrawerCommons(this);
    }

    _getImportantInformation() {
        const region = this._getRegion();
        const {route} = this.props;
        const {navigator} = this.context;
        if (!region || !region.important_information) {
            return <View />;
        }

        let importantInformation = region.important_information;
        importantInformation = importantInformation.filter((i) => !i.hidden);

        return importantInformation.map((i, index) => {
            return (
                <MenuItem
                    icon={i.icon}
                    key={index}
                    active={route === 'infoDetails' && navigator.currentRoute.props.slug == i.slug}
                    onPress={() => this._defaultOrFirst(i, true)}
                >
                    {i.pageTitle}
                </MenuItem>
            );
        });
    }

    _getRegion() {
        const {region} = this.props;

        if (!region) {
            return null;
        }

        if (!region.important_information) {
            return region
        }

        return {
            important_information: region.important_information.map((i) => {
                if (i && i.metadata) {
                    i.pageTitle = (i.metadata.page_title || '').replace('\u060c', ',').split(',')[0];
                }
                i.type = 'info';
                return i;
            }),
            ...region
        }
    }

    _sendEmail() {
        const destination = 'mailto:info@refugee.info';

        if (Platform.OS == 'android') {
            let email = destination.split('mailto:')[1];
            Mailer.mail({
                recipients: [email],
            }, (error, event) => {
            });
        } else {
            Linking.openURL(destination);
        }
    }

    _defaultOrFirst(page, showTitle = false) {
        this.drawerCommons.closeDrawer();

        if (page.content && page.content.length == 1) {
            return this.context.navigator.to('infoDetails', null, {
                slug: page.slug,
                section: page.content[0].section,
                sectionTitle: page.pageTitle,
                showTitle: showTitle
            });
        } else {
            let payload = {region: page.type != 'info' ? page : null, information: page.type == 'info' ? null : page};
            return this.context.navigator.to('info', null, payload);
        }
    }

    async selectCity(city) {
        const {dispatch, country} = this.props;
        city.country = country;

        dispatch(updateRegionIntoStorage(city));
        dispatch(updateCountryIntoStorage(city.country));
        dispatch({type: 'REGION_CHANGED', payload: city});
        dispatch({type: 'COUNTRY_CHANGED', payload: city.country});

        return this._defaultOrFirst(city)
    }

    render() {
        const {theme, route, country, direction, language, locations} = this.props;
        const {navigator} = this.context;
        const region = this._getRegion();

        if (!this.props.region || !this.props.country) {
            return <Text>Choose location first</Text>;
        }
        let feedbackUrl = (FEEDBACK_MAP[language] || FEEDBACK_MAP.en) + (region && region.slug);
        const aboutUs = region.important_information.find(a => a.slug === 'about-us');

        let importantInformationItems = this._getImportantInformation();
        let nearbyCitiesItems = null;
        if (locations) {
            nearbyCitiesItems = locations.map((i, index) => {
                return <MenuItem
                    active={i.id == region.id}
                    key={index}
                    onPress={() => this.selectCity(i)}
                >
                    {i.pageTitle || i.name}
                </MenuItem>;
            });
        }
        let logo = theme == 'light' ? themes.light.drawerLogo : themes.dark.drawerLogo;
        let styles = theme == 'light' ? lightNavigationStyles : darkNavigationStyles;

        // Shorthand to change scene
        let s = (scene) => this.drawerCommons.changeScene(scene);

        let bannerCount = region.metadata.banners.length;

        return <ScrollView style={styles.view}>
            <View style={[styles.logoContainer, getRowOrdering(direction)]}>
                <Image source={logo} style={ styles.logo }/>
            </View>
            <View style={[styles.titleWrapper, getRowOrdering(direction)]}>
                <Icon
                    name="md-locate"
                    style={[
                        {fontSize: 20, color: themes.light.greenAccentColor, marginTop: 2},
                        (direction == 'ltr' ? {marginRight: 10} : {marginLeft: 10})
                    ]}
                />
                <Text style={[
                    getFontFamily(language),
                    styles.cityText
                ]}>
                    {(region.pageTitle || region.name).toUpperCase() }
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
                    active={route === 'notifications'}
                    icon="ios-mail" onPress={() => s('notifications')}
                    badge={bannerCount}>
                    {I18n.t('ANNOUNCEMENTS')}
                </MenuItem>
                <MenuItem
                    icon="ios-paper"
                    active={route === 'news'}
                    onPress={() => s('news')}>
                    {I18n.t('NEWS')}
                </MenuItem>
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
                {aboutUs &&
                <MenuItem
                    icon="fa-question"
                    active={route === 'infoDetails' && navigator.currentRoute.props.slug == aboutUs.slug}
                    onPress={() => this._defaultOrFirst(aboutUs, true)}
                >
                    {I18n.t('ABOUT') }
                </MenuItem>
                }
                <MenuItem
                    icon="fa-comment"
                    onPress={() => Linking.openURL(feedbackUrl) }>
                    {I18n.t('FEEDBACK') }
                </MenuItem>

                <MenuItem
                    icon="fa-facebook-square"
                    onPress={() => Linking.openURL(LIKE_URL) }>
                    {I18n.t('LIKE_US') }
                </MenuItem>

            </MenuSection>
            <View style={{paddingBottom: 15}}>
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
        drawerOpen: state.drawerOpen,
        locations: state.locations
    };
};

const lightNavigationStyles = StyleSheet.create({
    logo: {
        width: 150,
        resizeMode: 'contain',
        marginTop: 40,
    },
    logoContainer: {
        flex: 1,
        flexDirection: 'row',
        paddingHorizontal: 20
    },
    view: {
        flexDirection: 'column',
        flex: 1
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
        marginBottom: 20,
        paddingHorizontal: 20
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

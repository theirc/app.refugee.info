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
    Linking
} from 'react-native';
import {connect} from 'react-redux';
import I18n from '../constants/Messages';
import DrawerCommons from '../utils/DrawerCommons';
import {MenuSection, MenuItem} from '../components';
import {
    updateRegionIntoStorage,
    updateCountryIntoStorage,
} from '../actions';
import {Icon} from '../components';
import {
    getFontFamily,
    getRowOrdering,
    themes
} from '../styles'
import {RNMail as Mailer} from 'NativeModules';
import {LIKE_PATH, FEEDBACK_MAP} from '../constants'


class Navigation extends Component {

    static contextTypes = {
        drawer: PropTypes.object.isRequired,
        navigator: PropTypes.object
    };

    constructor(props) {
        super(props);
        this.drawerCommons = new DrawerCommons(this);
    }

    getImportantInformation() {
        const {route, region} = this.props;
        const {navigator} = this.context;
        if (!region || !region.important) {
            return <View />;
        }
        return region.important.map((item, index) => {
            return (
                <MenuItem
                    active={route === 'infoDetails' && navigator.currentRoute.props.slug == item.slug}
                    icon={item.icon}
                    key={index}
                    onPress={() => this._defaultOrFirst(item, true)}
                >
                    {item.title}
                </MenuItem>
            );
        });
    }

    getNearbyCities() {
        const {locations, region} = this.props;
        if (locations) {
            return locations.map((i, index) => {
                return (
                    <MenuItem
                        active={i.id == region.id}
                        key={index}
                        onPress={() => this.selectCity(i)}
                    >
                        {i.pageTitle || i.name}
                    </MenuItem>
                );
            });
        }
    }

    _defaultOrFirst(page, showTitle = false) {
        this.drawerCommons.closeDrawer();
        if (page.content && page.content.length == 1) {
            return this.context.navigator.to('infoDetails', null, {
                slug: page.slug || `info${page.index}`,
                section: page.content[0].section,
                sectionTitle: page.pageTitle,
                showTitle,
                index: page.content[0].index,
                content_slug: page.slug
            });
        } else {
            let payload = {
                region: page.type != 'info' ? page : null,
                information: page.type == 'info' ? null : page
            };
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

        return this._defaultOrFirst(city);
    }

    render() {
        const {theme, route, direction, language, region} = this.props;
        const {navigator} = this.context;

        if (!this.props.region || !this.props.country) {
            return <Text>Choose location first</Text>;
        }
        let feedbackUrl = (FEEDBACK_MAP[language] || FEEDBACK_MAP.en) + (region && region.slug);
        const aboutUs = region.important_information && region.important_information.find(a => a.slug === 'about-us');

        let importantInformationItems = this.getImportantInformation();
        let nearbyCitiesItems = this.getNearbyCities();

        let logo = theme == 'light' ? themes.light.drawerLogo : themes.dark.drawerLogo;
        let styles = theme == 'light' ? lightNavigationStyles : darkNavigationStyles;

        // Shorthand to change scene
        let s = (scene) => this.drawerCommons.changeScene(scene);
        let bannerCount = region.banners && region.banners.length;
        let regionName = region.name ? region.name.toUpperCase() : '';
        return (
            <ScrollView style={styles.view}>
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
                    ]}
                    >
                        {regionName}
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
                        onPress={() => Linking.openURL(LIKE_PATH) }>
                        {I18n.t('LIKE_US') }
                    </MenuItem>

                </MenuSection>
                <View style={{paddingBottom: 15}}>
                </View>
            </ScrollView>);
    }
}

const mapStateToProps = (state) => {
    return {
        locations: state.locations,
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
        marginTop: 40,
    },
    logoContainer: {
        flexGrow: 1,
        height: 70,
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

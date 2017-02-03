import React, {Component, PropTypes} from 'react';
import {
    Image,
    View,
    ScrollView,
    StyleSheet,
    Linking,
    Dimensions,
    TouchableWithoutFeedback
} from 'react-native';
import {connect} from 'react-redux';
import I18n from '../constants/Messages';
import {MenuSection, MenuItem, DirectionalText, LoadingOverlay} from '../components';
import {updateRegionIntoStorage} from '../actions';
import {Icon} from '../components';
import styles, {themes} from '../styles';
import {LIKE_PATH, FEEDBACK_MAP} from '../constants';
import ApiClient from '../utils/ApiClient';
import {getRegionAllContent} from '../utils/helpers';
import {Actions} from 'react-native-router-flux';

const {width, height} = Dimensions.get('window');


class Navigation extends Component {

    static contextTypes = {
        drawer: PropTypes.object
    };

    constructor(props) {
        super(props);
        this.apiClient = new ApiClient(this.context, props);
        this.state = {
            loading: false
        };
    }

    _defaultOrFirst(section) {
        this.context.drawer.close();
        if (section.html && section.content.length == 1) {
            return Actions.infoDetails({section});
        } else {
            return Actions.info();
        }
    }

    async selectCity(city) {
        const {dispatch} = this.props;
        this.setState({loading: true});
        let region = await this.apiClient.getLocation(city.slug);
        region.allContent = getRegionAllContent(region);
        this.setState({region});

        requestAnimationFrame(() => {
            Promise.all([
                dispatch(updateRegionIntoStorage(region)),
                dispatch({type: 'REGION_CHANGED', payload: region}),
                this.setState({loading: false})
            ]);
            return this._defaultOrFirst(city);
        });
    }

    navigateToMicroApp(app) {
        this.context.drawer.close();
        requestAnimationFrame(() => {
            Actions.microApp({app});
        });
    }


    navigateToImportantInformation(section) {
        this.context.drawer.close();
        requestAnimationFrame(() => {
            Actions.infoDetails({section});
        });
    }

    navigateToNotifications() {
        const section = {
            html: this.props.region.banners.map((banner) => `<div class="banner">${banner.html}</div>`).join('<br />'),
            notifications: true
        };
        this.context.drawer.close();
        requestAnimationFrame(() => {
            Actions.notifications({section});
        });

    }

    getImportantInformation() {
        const {routes, region} = this.props;
        if (!region || !region.important) {
            return;
        }
        return region.important.map((item, index) => {
            return (
                <MenuItem
                    active={routes.scene.sceneKey === 'infoDetails' && routes.scene.title == item.title}
                    icon={item.icon}
                    key={index}
                    onPress={() => this.navigateToImportantInformation(item)}
                >
                    {item.title}
                </MenuItem>
            );
        });
    }

    getImportantInformationSection() {
        let importantInformationItems = this.getImportantInformation();
        if (importantInformationItems) {
            return (
                <MenuSection title={I18n.t('IMPORTANT_INFORMATION')}>
                    {importantInformationItems}
                </MenuSection>
            );
        }
    }


    getNearbyCities() {
        const {locations, region} = this.props;
        if (locations) {
            return locations.map((location, index) => {
                return (
                    <MenuItem
                        active={location.slug == region.slug}
                        key={index}
                        onPress={() => this.selectCity(location)}
                    >
                        {location.pageTitle || location.name}
                    </MenuItem>
                );
            });
        }
    }

    getAvailableApps() {
        const {region, currentApp} = this.props;
        if (region && region.apps) {
            if (region.apps.length == 0) {
                return null;
            }
            return (
                <MenuSection title={I18n.t('MICRO_APPS')}>
                    {region.apps.map((app, index) => {
                        return (
                            <MenuItem
                                active={app.id == (currentApp && currentApp.id)}
                                key={index}
                                onPress={() => this.navigateToMicroApp(app)}
                            >
                                {app.name}
                            </MenuItem>
                        );
                    })}
                </MenuSection>
            );
        }
    }

    getNearbyCitiesSection() {
        let nearbyCitiesItems = this.getNearbyCities();
        if (nearbyCitiesItems) {
            return (
                <MenuSection title={I18n.t('CHANGE_LOCATION')}>
                    {nearbyCitiesItems}
                </MenuSection>
            );
        }
    }

    render() {
        const {routes, language, region} = this.props;
        const {loading} = this.state;

        if (!this.props.region) {
            return <View />;
        }

        let feedbackUrl = (FEEDBACK_MAP[language] || FEEDBACK_MAP.en) + (region && region.slug);
        const aboutUs = region && region.allContent ? region.allContent.find(content => content.slug === 'about-us') : {};

        let importantInformationSection = this.getImportantInformationSection();
        let nearbyCitiesSection = this.getNearbyCitiesSection();

        let logo = themes.light.drawerLogo;

        let bannerCount = region.banners && region.banners.length;
        let regionName = region.name ? region.name.toUpperCase() : '';

        let availableApps = this.getAvailableApps();

        // Shorthand to change scene
        return (
            <ScrollView style={componentStyles.view}>
                <TouchableWithoutFeedback onPress={() => this._defaultOrFirst(region)}>
                    <View style={[componentStyles.logoContainer, styles.row]}>
                        <Image
                            source={logo}
                            style={componentStyles.logo}
                        />
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => this._defaultOrFirst(region)}>
                    <View style={[componentStyles.titleWrapper, styles.row]}>
                        <Icon
                            name="md-locate"
                            style={[
                                {fontSize: 20, color: themes.light.greenAccentColor, marginTop: 2, marginHorizontal: 5}
                            ]}
                        />
                        <DirectionalText style={[
                            componentStyles.cityText
                        ]}
                        >
                            {regionName}
                        </DirectionalText>
                    </View>
                </TouchableWithoutFeedback>

                <MenuSection title={I18n.t('REFUGEE_INFO')}>
                    <MenuItem
                        active={routes.scene.sceneKey === 'info'}
                        icon="fa-info"
                        onPress={() => this._defaultOrFirst(region)}
                    >
                        {I18n.t('GENERAL_INFO')}
                    </MenuItem>
                    <MenuItem
                        active={routes.scene.sceneKey === 'serviceList'}
                        icon="fa-list"
                        onPress={() => {
                            Actions.service({list: true});
                            this.context.drawer.close();
                        }}
                    >
                        {I18n.t('SERVICE_LIST')}
                    </MenuItem>
                    <MenuItem
                        active={routes.scene.sceneKey === 'serviceMap'}
                        icon="fa-map"
                        onPress={() => {
                            Actions.service({map: true});
                            this.context.drawer.close();
                        }}
                    >
                        {I18n.t('EXPLORE_MAP')}
                    </MenuItem>
                </MenuSection>

                <MenuSection>
                    <MenuItem
                        active={routes.scene.sceneKey === 'notifications'}
                        badge={bannerCount}
                        icon="ios-mail"
                        onPress={() => this.navigateToNotifications()}
                    >
                        {I18n.t('ANNOUNCEMENTS')}
                    </MenuItem>
                    <MenuItem
                        active={routes.scene.sceneKey === 'news'}
                        icon="ios-paper"
                        onPress={() => {
                            Actions.news();
                            this.context.drawer.close();
                        }}
                    >
                        {I18n.t('NEWS')}
                    </MenuItem>
                </MenuSection>
                {availableApps}
                {importantInformationSection}
                {nearbyCitiesSection}

                <MenuSection>
                    <MenuItem
                        active={routes.scene.sceneKey === 'settings'}
                        icon="fa-gear"
                        onPress={() => {
                            Actions.settings();
                            this.context.drawer.close();
                        }}
                    >
                        {I18n.t('SETTINGS')}
                    </MenuItem>
                    {aboutUs &&
                    <MenuItem
                        active={routes.scene.sceneKey === 'infoDetails' && routes.scene.title == aboutUs.title}
                        icon="fa-question"
                        onPress={() => this.navigateToImportantInformation(aboutUs, true)}
                    >
                        {I18n.t('ABOUT')}
                    </MenuItem>
                    }
                    <MenuItem
                        icon="fa-comment"
                        onPress={() => Linking.openURL(feedbackUrl)}
                    >
                        {I18n.t('FEEDBACK')}
                    </MenuItem>

                    <MenuItem
                        icon="fa-facebook-square"
                        onPress={() => Linking.openURL(LIKE_PATH)}
                    >
                        {I18n.t('LIKE_US')}
                    </MenuItem>

                </MenuSection>
                {loading &&
                <LoadingOverlay
                    height={height}
                    width={width}
                />}
            </ScrollView>);
    }
}

const mapStateToProps = (state) => {
    return {
        locations: state.locations,
        region: state.region,
        language: state.language,
        drawerOpen: state.drawerOpen,
        routes: state.routes
    };
};

const componentStyles = StyleSheet.create({
    logo: {
        width: 150,
        resizeMode: 'contain',
        marginTop: 20
    },
    logoContainer: {
        flexGrow: 1,
        height: 100,
        flexDirection: 'row',
        paddingHorizontal: 20
    },
    view: {
        flexDirection: 'column',
        flex: 1,
        paddingBottom: 15
    },

    titleWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 30,
        marginBottom: 10,
        paddingHorizontal: 20
    },
    cityText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: themes.light.textColor
    }
});

export default connect(mapStateToProps)(Navigation);

import React, {Component, PropTypes} from 'react';
import {Text, Image, View, ScrollView, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import I18n from '../constants/Messages';
import ApiClient from '../utils/ApiClient';
import DrawerCommons from '../utils/DrawerCommons';
import {MenuSection, MenuItem} from '../components'
import {updateRegionIntoStorage} from '../actions/region';
import {updateCountryIntoStorage} from '../actions/country';
import store from '../store';
import {Regions} from '../data';
import Icon from 'react-native-vector-icons/Ionicons';
import styles, {generateTextStyles, themes} from '../styles'

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
        const regionData = new Regions(new ApiClient(this.context, this.props));

        let children = (await regionData.listChildren(country)).filter((c)=>c.level==3);

        children.forEach((c) => {
            if (c && c.metadata) {
                const pageTitle = (c.metadata.page_title || '')
                    .replace('\u060c', ',').split(',')[0];
                c.pageTitle = pageTitle;
            }
        });

        return children;
    }

    _getImportantInformationImage(theme, pageTitle){
        if (theme=='dark'){
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
        let s = (scene, props) => this.drawerCommons.changeScene(scene, null, props);
        return region.important_information.map((i, index) => {
            if (i && i.metadata) {
                const pageTitle = (i.metadata.page_title || '')
                    .replace('\u060c', ',').split(',')[0];
                i.pageTitle = pageTitle;
            }

            return (
                <MenuItem
                    image={this._getImportantInformationImage(theme, i.pageTitle)}
                    key={index}
                    onPress={() => s('info', {information:i,title: i.pageTitle}) }
                >
                    {i.pageTitle}
                </MenuItem>
            );
        });
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

        this.drawerCommons.closeDrawer();

        if (city.content && city.content.length == 1) {
            return this.context.navigator.to('infoDetails', null, { section: city.content[0].section, sectionTitle: city.pageTitle });
        } else {
            return this.context.navigator.to('info',null, null, store.getState());
        }
    }

    render() {
        const {theme, route, region, country, direction, language} = this.props;
        const {navigator} = this.context;

        if (!this.props.region || !this.props.country) {
            return <Text>Choose location first</Text>;
        }

        let importantInformationItems = this._getImportantInformation();
        let nearbyCitiesItems = this.state.otherLocations.map((i, index) => {
            return <MenuItem key={index} onPress={() => this.selectCity(i) }>{i.pageTitle}</MenuItem>;
        });
        let logo = theme == 'light' ? themes.light.drawerLogo : themes.dark.drawerLogo;
        let styles = theme == 'light' ? lightNavigationStyles : darkNavigationStyles;

        // Shorthand to change scene
        let s = (scene) => this.drawerCommons.changeScene(scene);

        let headerImage = <Icon
            name="md-locate"
            style={[
                {fontSize: 20, color: themes.light.greenAccentColor, marginTop: 2},
                (direction == 'ltr' ? {marginRight: 10} : {marginLeft: 10})
            ]}
        />;


        const isLTR = direction == 'ltr';

        return <ScrollView style={styles.view}>
            <View style={[styles.logoContainer, { justifyContent: ((isLTR) ? 'flex-start' : 'flex-end') }]}>
                <Image source={logo} style={ styles.logo }/>
            </View>
            <View style={[styles.titleWrapper, { justifyContent: ((isLTR) ? 'flex-start' : 'flex-end'), }]}>
                {(isLTR) && headerImage}
                <Text style={[
                    generateTextStyles(language),
                    styles.cityText
                ]}>
                    {region.pageTitle.toUpperCase()}
                </Text>
                {(!isLTR) && headerImage}
            </View>
            <MenuSection title={I18n.t("REFUGEE_INFO") }>
                <MenuItem
                    image={theme=='dark' ?
                        require('../assets/icons/information-dark.png') :
                        require('../assets/icons/information-light.png')
                    }
                    active={route === 'info'}
                    onPress={() => s('info') }
                >
                    {I18n.t('GENERAL_INFO') }
                </MenuItem>
                <MenuItem
                    image={theme=='dark' ?
                        require('../assets/icons/services-dark.png') :
                        require('../assets/icons/services-light.png')
                    }
                    active={route === 'services'}
                    onPress={() => s('services') }
                >
                    {I18n.t('SERVICE_LIST') }
                </MenuItem>
                <MenuItem
                    image={theme=='dark' ?
                        require('../assets/icons/map-dark.png') :
                        require('../assets/icons/map-light.png')
                    }
                    active={route === 'map'}
                    onPress={() => s('map') }
                >
                    {I18n.t('EXPLORE_MAP') }
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
                    image={theme=='dark' ?
                        require('../assets/icons/settings-dark.png') :
                        require('../assets/icons/settings-light.png')
                    }
                    active={route === 'settings'}
                    onPress={() => s('settings')}
                >
                    {I18n.t('SETTINGS')}
                </MenuItem>
                <MenuItem
                    image={theme=='dark' ?
                        require('../assets/icons/about-dark.png') :
                        require('../assets/icons/about-light.png')
                    }
                    active={route === 'about'}
                    onPress={() => s('about') }
                >
                    {I18n.t('ABOUT') }
                </MenuItem>
                <MenuItem
                    image={theme=='dark' ?
                        require('../assets/icons/contact-dark.png') :
                        require('../assets/icons/contact-light.png')
                    }
                    active={route === 'settings'}
                    onPress={() => s('settings') }
                >
                    {I18n.t('CONTACT_US') }
                </MenuItem>
                <MenuItem
                    image={theme=='dark' ?
                        require('../assets/icons/give-feedback-dark.png') :
                        require('../assets/icons/give-feedback-light.png')
                    }
                    active={route === 'settings'}
                    onPress={() => s('settings')}>
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
        theme: state.theme.theme,
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
        marginBottom: 30,
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
        marginBottom: 30,
        paddingRight: 10
    },
    cityText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: themes.dark.textColor,
    }
});

export default connect(mapStateToProps)(Navigation);

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
import {Header, Section, DirectionalText} from '../components'
import CountryHeaders from '../constants/CountryHeaders'

import {updateRegionIntoStorage} from '../actions/region';
import {updateCountryIntoStorage} from '../actions/country';
import store from '../store';

const rectangularLogo = require('../assets/logo-rect.png');
const bullseye = require('../assets/icons/bullseye.png');


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
        if (props.country) {
            const children = await this.loadCities(props.country.id);

            this.setState({ otherLocations: children.slice(0, 5) });
        }
    }
    
    async loadCities(countryId) {
        let cities = [];
        let apiClient = new ApiClient(this.context, this.props);

        const regions = await apiClient.getRegions(countryId);
        const children = await apiClient.getCities(countryId);
        cities = cities.concat(children);
        const promises = [];
        for (let region of regions) {
            promises.push(apiClient.getCities(region.id));
        }
        return await Promise.all(promises).then((citiesList) => {
            for (let _cities of citiesList) {
                cities = cities.concat(_cities);
            }
            cities.forEach((c)=>{
              if(c && c.metadata) {
                const pageTitle = (c.metadata.page_title || '')
                  .replace('\u060c', ',').split(',')[0];
                c.pageTitle = pageTitle;
              }
            });

            return cities
        });
    }

    _getImportantInformation() {
        const region = this.props.region;
        if (!region || !region.important_information) {
            return <View />;
        }

        return region.important_information.map((i) => {
            return {
                value: i.metadata.page_title,
                active: false,
                onPress: () => false,
                onLongPress: () => false
            }
        });
    }

    renderItem(item, index) {
        if (this.props.direction == 'rtl') {
            return (
                <View
                    key={index}
                    style={itemStyles.item}
                    >
                    <View style={itemStyles.valueRTL}>
                        <Text style={[TYPO.paperFontBody2, {}, { textAlign: 'right' }]}>
                            {item.value}
                        </Text>
                    </View>
                    {item.label &&
                        <View style={itemStyles.label}>
                            <Text style={[TYPO.paperFontBody2, {}]}>
                                {item.label}
                            </Text>
                        </View>
                    }
                    {item.icon &&
                        <Icon
                            name={item.icon}
                            size={22}
                            style={itemStyles.iconRTL}
                            />
                    }
                </View>
            );
        }
        return (
            <View
                key={index}
                style={itemStyles.item}
                >
                {item.icon &&
                    <Icon
                        name={item.icon}
                        size={22}
                        style={itemStyles.icon}
                        />
                }
                <View style={itemStyles.value}>
                    <Text style={[TYPO.paperFontBody2, {}]}>
                        {item.value}
                    </Text>
                </View>
                {item.label &&
                    <View style={itemStyles.label}>
                        <Text style={[TYPO.paperFontBody2, {}]}>
                            {item.label}
                        </Text>
                    </View>
                }
            </View>
        );
    }

    renderItemList(items) {
        return items && items.map((item, i) => {
            if (item.disabled) {
            }

            if (!isCompatible('TouchableNativeFeedback')) {
                return (
                    <Ripple
                        key={i}
                        rippleColor="rgba(153,153,153,.4)"
                        onPress={item.onPress}
                        onLongPress={item.onLongPress}
                        style={{
                            flex: 1,
                            flexDirection: 'column',
                            backgroundColor: item.active ? '#ffffff' : null,
                        }}
                        >
                        {this.renderItem(item, i) }
                    </Ripple>
                );
            }

            return (
                <TouchableNativeFeedback
                    key={i}
                    background={TouchableNativeFeedback.Ripple('rgba(153,153,153,.4)') }
                    onPress={item.onPress}
                    onLongPress={item.onLongPress}
                    >
                    <View style={[item.active ? { backgroundColor: '#ffffff' } : {}, {
                    }]}>
                        {this.renderItem(item, i) }
                    </View>
                </TouchableNativeFeedback>
            );
        });

    }
    async selectCity(city) {
        const { dispatch, country } = this.props;

        city.detected = false;
        city.coords = {};
        city.country = country;

        dispatch(updateCountryIntoStorage(city.country));
        dispatch(updateRegionIntoStorage(city));

        dispatch({type: 'REGION_CHANGED', payload: city});
        dispatch({type: 'COUNTRY_CHANGED', payload: city.country});

        this.drawerCommons.closeDrawer();

        if(city.content && city.content.length == 1) {
          return this.context.navigator.to('infoDetails', null, {section: city.content[0].section, sectionTitle: city.content[0].title });
        } else {
          return this.context.navigator.to('info', null, null, store.getState());
        }
    }

    render() {
        const {theme, route, region, country} = this.props;
        const {navigator} = this.context;

        if (!this.props.region) {
            return <Text>Choose location first</Text>;
        }

        if (!this.props.country) {
            return <Text>Choose location first</Text>;
        }

        let navigateTo = region.content.length == 1 ?
            () => this.drawerCommons.changeScene('infoDetails', null, {
                section: region.content[0].section,
                sectionTitle: region.content[0].title
            }) :
            () => this.drawerCommons.changeScene('info');

        let title = require('../assets/RI-logo.png');
        let headerInformation = CountryHeaders.rs;

        if (country) {
            const countryCode = country.code.toLowerCase();
            if (CountryHeaders.hasOwnProperty(countryCode)) {
                headerInformation = CountryHeaders[countryCode];
            }
        }

        let styles = lightNavigationStyles;
        let mainItems = [
            {
                icon: 'info',
                value: I18n.t('GENERAL_INFO'),
                active: route === 'info',
                onPress: navigateTo,
                onLongPress: navigateTo
            },
            {
                icon: 'list',
                value: I18n.t('SERVICE_LIST'),
                active: route === 'services',
                onPress: () => this.drawerCommons.changeScene('services'),
                onLongPress: () => this.drawerCommons.changeScene('services')
            }, {
                icon: 'map',
                value: I18n.t('EXPLORE_MAP'),
                active: route === 'map',
                onPress: () => this.drawerCommons.changeScene('map'),
                onLongPress: () => this.drawerCommons.changeScene('map')
            }
        ];

        let bottomItems = [{
            icon: 'public',
            value: I18n.t('CHANGE_COUNTRY'),
            active: !route || route === 'countryChoice',
            onPress: () => this.drawerCommons.changeScene('countryChoice'),
            onLongPress: () => this.drawerCommons.changeScene('countryChoice')
        }, {
                icon: 'settings',
                value: I18n.t('SETTINGS'),
                active: !route || route === 'settings',
                onPress: () => this.drawerCommons.changeScene('settings'),
                onLongPress: () => this.drawerCommons.changeScene('settings')
            }
        ]

        let importantInformationItems = this._getImportantInformation();
        let nearbyCitiesItems = this.state.otherLocations.map((i) => {
            return {
                value: i.pageTitle,
                active: false,
                onPress: () => this.selectCity(i),
                onLongPress: () => this.selectCity(i)
            }
        })

        return <View style={styles.view}>
            <View>
                <Image source={rectangularLogo} style={styles.logo} />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', height: 30, marginBottom: 15 }}>
                <Image source={bullseye} style={{ resizeMode: 'stretch', height: 20, width: 20, marginRight: 10 }} />
                <Text style={styles.pageTitle}>{region.pageTitle.toUpperCase() }</Text>
            </View>
            <ScrollView>
                <View style={{ borderBottomColor: "#000000", borderBottomWidth: 1, paddingBottom: 15 }}>
                    <Text style={{ color: "#49b050", fontWeight: "bold" }}>{"REFUGEE.INFO"}</Text>
                </View>
                {this.renderItemList(mainItems).map((item, index) => {
                    return <View key={"wrapper-" + index} style={{ borderBottomColor: "#b2b2b2", borderBottomWidth: 1 }}>
                        {item}
                    </View>;
                }) }
                <View style={{ borderBottomColor: "#000000", borderBottomWidth: 1, paddingTop: 45, paddingBottom: 15 }}>
                    <Text style={{ color: "#49b050", fontWeight: "bold" }}>{"IMPORTANT INFORMATION"}</Text>
                </View>
                {this.renderItemList(importantInformationItems).map((item, index) => {
                    return <View key={"wrapper-" + index} style={{ borderBottomColor: "#b2b2b2", borderBottomWidth: 1 }}>
                        {item}
                    </View>;
                }) }
                <View style={{ borderBottomColor: "#000000", borderBottomWidth: 1, paddingTop: 45, paddingBottom: 15 }}>
                    <Text style={{ color: "#49b050", fontWeight: "bold" }}>{"CHANGE LOCATION"}</Text>
                </View>
                {this.renderItemList(nearbyCitiesItems).map((item, index) => {
                    return <View key={"wrapper-" + index} style={{ borderBottomColor: "#b2b2b2", borderBottomWidth: 1 }}>
                        {item}
                    </View>;
                }) }
                <View style={{ borderBottomColor: "#000000", borderBottomWidth: 1, paddingTop: 45, paddingBottom: 15 }}>
                </View>
                {this.renderItemList(bottomItems).map((item, index) => {
                    return <View key={"wrapper-" + index} style={[{ borderBottomColor: "#000000", borderBottomWidth: 1 }]}>
                        {item}
                    </View>;
                }) }
                <View style={{ paddingBottom: 15 }}>
                </View>
            </ScrollView>
        </View>;
    }
}

const mapStateToProps = (state) => {
    return {
        route: state.navigation,
        region: state.region,
        country: state.country,
        language: state.language,
        direction: state.direction,
        theme: state.theme.theme
    };
};

const lightNavigationStyles = StyleSheet.create({
    logo: {
        width: 150,
        resizeMode: 'contain',
        marginTop: 10,
    },
    view: {
        flexDirection: 'column',
        flex: 1,
        alignItems: 'stretch',
        marginLeft: 20,
    },
    pageTitle: {
        fontSize: 14,
        fontWeight: 'bold',
    }
});

const itemStyles = {
    header: {
        paddingHorizontal: 16,
        marginBottom: 0
    },
    section: {
        flex: 1,
        marginTop: 0
    },
    item: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        height: 48,
        paddingLeft: 16
    },
    subheader: {
        flex: 1
    },
    icon: {
        position: 'absolute',
        top: 13,
        left: 5
    },
    iconRTL: {
        position: 'absolute',
        top: 13,
        right: 5
    },
    value: {
        flex: 1,
        paddingLeft: 26,
        paddingRight: 5,
        top: (Platform.OS === 'ios') ? -5 : 2
    },
    valueRTL: {
        flex: 1,
        paddingRight: 36,
        top: (Platform.OS === 'ios') ? -5 : 2,
        paddingLeft: 5,
        alignItems: 'flex-end'
    },
    label: {
        paddingRight: 16,
        top: 2
    }
};

export default connect(mapStateToProps)(Navigation);

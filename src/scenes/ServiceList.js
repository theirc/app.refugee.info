import React, {Component, PropTypes} from 'react';
import {
    View,
    Text,
    ListView,
    RefreshControl,
    StyleSheet,
    TouchableHighlight,
    AsyncStorage,
    TextInput,
    Image
} from 'react-native';
import I18n from '../constants/Messages';
import ApiClient from '../utils/ApiClient';
import ServiceCommons from '../utils/ServiceCommons';
import MapButton from '../components/MapButton';
import {OfflineView, SearchBar, SearchFilterButton} from '../components';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';

import styles, {themes, getUnderlayColor, generateTextStyles} from '../styles';

export default class ServiceList extends Component {

    static contextTypes = {
        navigator: PropTypes.object.isRequired
    };

    static propTypes = {
        savedState: React.PropTypes.object
    };

    constructor(props) {
        super(props);

        if (props.hasOwnProperty('savedState') && props.savedState) {
            this.state = props.savedState;
        } else {
            this.state = {
                dataSource: new ListView.DataSource({
                    rowHasChanged: (row1, row2) => row1 !== row2
                }),
                loaded: false,
                refreshing: false,
                offline: false,
                lastSync: null
            };
        }
        this.serviceCommons = new ServiceCommons();
    }


    componentWillMount() {
        this.apiClient = new ApiClient(this.context, this.props);
        if (!this.state.loaded) {
            this.fetchData().done();
        }
    }

    async setLocation() {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                this.setState({
                    location: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    }
                });
            },
            (error) => {
                this.setState({
                    location: {
                        latitude: 0,
                        longitude: 0
                    }
                });
            }, {enableHighAccuracy: false, timeout: 5000, maximumAge: 1000}
        );
    }

    async fetchData() {
        // the region comes from the state now
        const {region} = this.props;
        if (!region) {
            this.setState({
                loaded: true
            });
            return;
        }
        let serviceTypes, services, locations;
        await this.setLocation();
        try {
            serviceTypes = await this.apiClient.getServiceTypes(true);
            services = await this.apiClient.getServices(
                region.slug,
                this.state.location.latitude,
                this.state.location.longitude,
                true
            );
            locations = await this.apiClient.getLocations(region.id, true);
            await AsyncStorage.setItem('serviceTypesCache', JSON.stringify(serviceTypes));
            await AsyncStorage.setItem('servicesCache', JSON.stringify(services));
            await AsyncStorage.setItem('locationsCache', JSON.stringify(locations));
            await AsyncStorage.setItem('lastServicesSync', new Date().toISOString());
            this.setState({
                offline: false
            });
        }
        catch (e) {
            this.setState({
                offline: true
            });
            serviceTypes = JSON.parse(await AsyncStorage.getItem('serviceTypesCache'));
            services = JSON.parse(await AsyncStorage.getItem('servicesCache'));
            locations = JSON.parse(await AsyncStorage.getItem('locationsCache'));
        }
        if (!services || !locations) {
            return;
        }
        locations.push(region);
        let lastSync = await AsyncStorage.getItem('lastServicesSync');
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(services),
            loaded: true,
            serviceTypes,
            locations,
            region,
            services,
            lastSync: Math.ceil(Math.abs(new Date() - new Date(lastSync)) / 60000)
        });
    }

    onRefresh() {
        this.setState({refreshing: true});
        this.fetchData().then(() => {
            this.setState({refreshing: false});
        });
    }

    onClick(params) {
        const {navigator} = this.context;
        navigator.forward(null, null, params, this.state);
    }

    renderRow(service) {
        const {theme, direction, language} = this.props;
        let location = this.state.locations.find(function (loc) {
            return loc.id == service.region;
        });
        let serviceType = this.state.serviceTypes.find(function (type) {
            return type.url == service.type;
        });
        let rating = this.serviceCommons.renderStars(service.rating, direction);
        let locationName = (location) ? location.name : '';
        return (
            <TouchableHighlight
                onPress={() => this.onClick({service, serviceType, location})}
                underlayColor={getUnderlayColor(theme)}
            >
                <View
                    style={[
                            styles.listItemContainer,
                            theme=='dark' ? styles.listItemContainerDark : styles.listItemContainerLight,
                            {height: 80, borderBottomWidth: 0, paddingBottom: 0, paddingTop: 0}
                        ]}
                >
                    <View style={[styles.horizontalContainer, styles.flex]}>
                        <View style={[styles.centeredVerticalContainer, {width: 40, paddingLeft: 10}]}>
                            <Image
                                source={{uri: serviceType.icon_url}}
                                style={styles.mapIcon}
                            />
                        </View>
                        <View style={[
                                styles.listItemDividerLongInline,
                                theme=='dark' ? styles.listItemDividerDark : styles.listItemDividerLight
                            ]}/>
                        <View style={[
                                styles.container,
                                theme=='dark' ? styles.listItemContainerDark : styles.listItemContainerLight,
                                {borderBottomWidth: 1, paddingLeft: 20, paddingTop: 14}
                            ]}>
                            <Text
                                style={[
                                        generateTextStyles(language),
                                        {fontSize: 15, paddingBottom: 2, fontWeight: '500',
                                        color: theme=='dark' ? themes.dark.textColor : themes.light.textColor}

                                    ]}
                            >
                                {service.name}
                            </Text>
                            <View style={[styles.horizontalContainer, {paddingBottom: 2}]}>
                                <Icon
                                    name="ios-pin"
                                    style={[
                                        {fontSize: 13, marginRight: 8},
                                        {color: theme=='dark' ? themes.dark.greenAccentColor : themes.light.textColor}
                                    ]}
                                />
                                <Text style={[
                                    generateTextStyles(language),
                                    {color: theme=='dark' ? themes.dark.greenAccentColor : themes.light.textColor,
                                    fontSize: 11}
                            ]}>
                                    {locationName}
                                </Text>
                            </View>
                            <View style={styles.horizontalContainer}>
                                <Text style={[
                                        generateTextStyles(language),
                                        {color: themes.light.darkerDividerColor, fontSize: 11, marginTop: 1}]
                                    }>
                                    {I18n.t('RATING').toUpperCase()}
                                </Text>
                                {rating}
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableHighlight>
        );
    }

    _onChangeText(text) {
        const services = this.state.services;
        const filteredServices = services.filter((x) => x.name.toLowerCase().indexOf(text.toLowerCase()) !== -1);
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(filteredServices),
            filteredServices: filteredServices
        });
    }

    searchFilterButtonAction() {
        // TODO RID-122
        console.log('button clicked!')
    }

    render() {
        const {theme, language} = this.props;
        if (!this.state.region) {
            return (
                <View style={styles.container}>
                    <View style={styles.horizontalContainer}>
                        <SearchBar
                            theme={theme}
                        />
                        <SearchFilterButton
                            theme={theme}
                        />
                    </View>
                    <View
                        style={[
                            styles.viewHeaderContainer,
                            {backgroundColor: (theme=='dark') ? themes.dark.menuBackgroundColor : themes.light.dividerColor},
                            {paddingTop: 10}
                        ]}
                    >
                        <Text
                            style={[
                                styles.viewHeaderText,
                                theme=='dark' ? styles.viewHeaderTextDark : styles.viewHeaderTextLight
                            ]}
                        >
                            {I18n.t('LOADING_SERVICES').toUpperCase()}
                        </Text>
                    </View>
                </View>
            )
        }
        return (
            <View style={styles.container}>
                <View style={styles.horizontalContainer}>
                    <SearchBar
                        theme={theme}
                        searchFunction={(text) => this._onChangeText(text)}
                    />
                    <SearchFilterButton
                        theme={theme}
                        onPressAction={() => this.searchFilterButtonAction()}
                    />
                </View>
                <View
                    style={[
                            styles.viewHeaderContainer,
                            {backgroundColor: (theme=='dark') ? themes.dark.menuBackgroundColor : themes.light.dividerColor},
                            {paddingTop: 10}
                        ]}
                >
                    <Text
                        style={[
                                styles.viewHeaderText,
                                theme=='dark' ? styles.viewHeaderTextDark : styles.viewHeaderTextLight
                            ]}
                    >
                        {I18n.t('NEAREST_SERVICES').toUpperCase()}
                    </Text>
                </View>
                <OfflineView
                    offline={this.state.offline}
                    onRefresh={this.onRefresh.bind(this)}
                    lastSync={this.state.lastSync}
                />
                <ListView
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this.onRefresh.bind(this)}
                        />
                    }
                    dataSource={this.state.dataSource}
                    enableEmptySections
                    renderRow={(service) => this.renderRow(service)}
                    keyboardShouldPersistTaps={true}
                    keyboardDismissMode="on-drag"
                    direction={this.props.direction}
                />
                <MapButton
                    direction={this.props.direction}
                    services={this.state.filteredServices}
                />
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        country: state.country,
        region: state.region,
        theme: state.theme.theme,
        direction: state.direction,
        language: state.language
    };
};

export default connect(mapStateToProps)(ServiceList);

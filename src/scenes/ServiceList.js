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
import InfiniteScrollView from 'react-native-infinite-scroll-view';
import {Regions, Services} from '../data';
import styles, {themes, getUnderlayColor, getFontFamily, getRowOrdering, getAlignItems} from '../styles';

var _ = require('underscore');

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
                    rowHasChanged: (row1, row2) => row1.id !== row2.id
                }),
                loaded: false,
                refreshing: false,
                offline: false,
                lastSync: null,
                canLoadMoreContent: true,
                pageNumber: 1
            };
        }
        this.serviceCommons = new ServiceCommons();
    }


    componentWillMount() {
        this.serviceData = new Services(this.props);
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

    async fetchData(criteria = "") {
        // the region comes from the state now
        const {region} = this.props;
        const regionData = new Regions(this.props);
        if (!region) {
            this.setState({
                loaded: true
            });
            return;
        }

        try {
            await this.setLocation();
            const {latitude, longitude} = (this.state.location || {});
            let serviceTypes = await this.serviceData.listServiceTypes();
            let serviceResult = await this.serviceData.pageServices(
                region.slug,
                {latitude, longitude},
                criteria
            );
            let services = serviceResult.results;
            services = _.uniq(services, false, (s) => s.id);

            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(services),
                loaded: true,
                serviceTypes,
                locations: [region],
                searchCriteria: criteria,
                region,
                services,
                canLoadMoreContent: (!!serviceResult.next),
                pageNumber: 1
            });
        } catch (e) {
            console.log(e);

            this.setState({
                offline: true
            });
        }
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
        let rating = this.serviceCommons.renderStars(service.rating);
        let locationName = (location) ? location.name : '';
        return (
            <TouchableHighlight
                onPress={() => this.onClick({ service, serviceType, location }) }
                underlayColor={getUnderlayColor(theme) }
            >
                <View
                    style={[
                        styles.listItemContainer,
                        theme == 'dark' ? styles.containerDark : styles.containerLight,
                        { height: 80, borderBottomWidth: 0, paddingBottom: 0, paddingTop: 0 }
                    ]}
                >
                    <View style={[
                            getRowOrdering(direction),
                            styles.flex
                        ]}
                    >
                        <View style={styles.listItemIconContainer}>
                            <Image
                                source={{ uri: serviceType.icon_url }}
                                style={styles.mapIcon}
                            />
                        </View>
                        <View style={[
                            styles.dividerLongInline,
                            theme == 'dark' ? styles.dividerDark : styles.dividerLight
                        ]}/>
                        <View style={[
                            styles.container,
                            getAlignItems(direction),
                            theme == 'dark' ? styles.containerDark : styles.containerLight,
                            { borderBottomWidth: 1, paddingLeft: 20, paddingTop: 14, paddingRight: 20 }
                        ]}>
                            <Text
                                style={[
                                    getFontFamily(language),
                                    {fontSize: 15, paddingBottom: 2, fontWeight: '500',
                                    color: theme == 'dark' ? themes.dark.textColor : themes.light.textColor}
                                ]}
                            >
                                {service.name}
                            </Text>
                            <View style={[styles.row, { paddingBottom: 2 }]}>
                                <Icon
                                    name="ios-pin"
                                    style={[
                                        { fontSize: 13, marginRight: 8 },
                                        { color: theme == 'dark' ? themes.dark.greenAccentColor : themes.light.textColor }
                                    ]}
                                />
                                <Text style={[
                                    getFontFamily(language),
                                    {
                                        color: theme == 'dark' ? themes.dark.greenAccentColor : themes.light.textColor,
                                        fontSize: 11
                                    }
                                ]}>
                                    {locationName}
                                </Text>
                            </View>
                            <View style={getRowOrdering(direction)}>
                                <Text style={[
                                        getFontFamily(language),
                                        {color: themes.light.darkerDividerColor, fontSize: 11, marginTop: 1},
                                        direction=='rtl' ? {paddingLeft: 5} : {paddingRight: 5}
                                    ]}
                                >
                                    {I18n.t('RATING').toUpperCase() }
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
        /* Lets not do the search locally
         */
        const services = this.state.services;
        this.fetchData(text).then(() => {
        });
    }

    searchFilterButtonAction() {
        // TODO RID-122
        console.log('button clicked!')
    }

    async _loadMoreContentAsync() {
        const {pageNumber, services, region, canLoadMoreContent, searchCriteria} = this.state;
        if (!canLoadMoreContent) {
            return;
        }
        try {
            const {latitude, longitude} = (this.state.location || {});
            let serviceResult = await this.serviceData.pageServices(
                region.slug,
                {latitude, longitude},
                searchCriteria,
                pageNumber + 1
            );

            let newServices = serviceResult.results;
            let allServices = services.concat(newServices);

            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(allServices),
                services: allServices,
                pageNumber: pageNumber + 1,
                searchCriteria,
                canLoadMoreContent: (!!serviceResult.next),
            });

        } catch (e) {
            console.log('Caught', e)
        }
    }

    render() {
        const {theme, language} = this.props;
        if (!this.state.region) {
            return (
                <View style={styles.container}>
                    <View style={styles.row}>
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
                            { backgroundColor: (theme == 'dark') ? themes.dark.menuBackgroundColor : themes.light.dividerColor },
                            { paddingTop: 10 }
                        ]}
                    >
                        <Text
                            style={[
                                styles.viewHeaderText,
                                theme == 'dark' ? styles.viewHeaderTextDark : styles.viewHeaderTextLight
                            ]}
                        >
                            {I18n.t('LOADING_SERVICES').toUpperCase() }
                        </Text>
                    </View>
                </View>
            )
        }
        return (
            <View style={styles.container}>
                <View style={styles.row}>
                    <SearchBar
                        theme={theme}
                        searchFunction={(text) => this._onChangeText(text) }
                    />
                    <SearchFilterButton
                        theme={theme}
                        onPressAction={() => this.searchFilterButtonAction() }
                    />
                </View>
                <View
                    style={[
                        styles.viewHeaderContainer,
                        { backgroundColor: (theme == 'dark') ? themes.dark.menuBackgroundColor : themes.light.dividerColor },
                        { paddingTop: 10 }
                    ]}
                >
                    <Text
                        style={[
                            styles.viewHeaderText,
                            theme == 'dark' ? styles.viewHeaderTextDark : styles.viewHeaderTextLight
                        ]}
                    >
                        {I18n.t('NEAREST_SERVICES').toUpperCase() }
                    </Text>
                </View>
                <OfflineView
                    offline={this.state.offline}
                    onRefresh={this.onRefresh.bind(this) }
                    lastSync={this.state.lastSync}
                />
                <ListView
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this.onRefresh.bind(this) }
                            />
                    }
                    dataSource={this.state.dataSource}
                    enableEmptySections
                    renderRow={(service) => this.renderRow(service) }
                    renderScrollComponent={props => <InfiniteScrollView {...props} />}
                    keyboardShouldPersistTaps={true}
                    keyboardDismissMode="on-drag"
                    direction={this.props.direction}
                    canLoadMore={this.state.canLoadMoreContent}
                    onLoadMoreAsync={() => { this._loadMoreContentAsync() } }
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
        theme: state.theme,
        direction: state.direction,
        language: state.language
    };
};

export default connect(mapStateToProps)(ServiceList);

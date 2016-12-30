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
    Image,
    LayoutAnimation,
    Platform,
    Dimensions,
    ScrollView
} from 'react-native';
import I18n from '../constants/Messages';
import ServiceCommons from '../utils/ServiceCommons';
import MapButton from '../components/MapButton';
import {
    OfflineView,
    SearchBar,
    SearchFilterButton,
    SelectableListItem,
    Button,
    LoadingOverlay
} from '../components';
import {connect} from 'react-redux';
import InfiniteScrollView from 'react-native-infinite-scroll-view';
import {Regions, Services} from '../data';
import styles, {
    themes,
    getUnderlayColor,
    getFontFamily,
    getRowOrdering,
    getAlignItems,
    getTextColor,
    getContainerColor,
    getDividerColor,
    getToolbarHeight,
    getTextAlign
} from '../styles';

import {Icon} from '../components'


var _ = require('underscore');
var {width, height} = Dimensions.get('window');

const PAGE_SIZE = 10;

export class ServiceList extends Component {

    static contextTypes = {
        navigator: PropTypes.object.isRequired
    };

    static propTypes = {
        savedState: React.PropTypes.object,
        searchCriteria: React.PropTypes.string,
        serviceTypeIds: React.PropTypes.array
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
                serviceTypeDataSource: new ListView.DataSource({
                    rowHasChanged: (row1, row2) => row1.id !== row2.id
                }),
                loaded: false,
                refreshing: false,
                offline: false,
                canLoadMoreContent: true,
                pageNumber: 1,
                filteringView: false,
                searchCriteria: props.searchCriteria || '',
                serviceTypeIds: props.serviceTypeIds,
                loading: false,
                location: {latitude: 0, longitude: 0}
            };
        }
        this.serviceCommons = new ServiceCommons();
    }

    componentWillMount() {
        this.serviceData = new Services(this.props);
        if (!this.state.loaded) {
            this.fetchData().then(() => {
                this.setState({loading: false})
            });
        }
    }

    async getServiceTypes() {
        if (this.state.serviceTypeIds) {
            let serviceTypes = await this.serviceData.listServiceTypes();
            for (let i = 0; i < serviceTypes.length; i++) {
                serviceTypes[i].active = this.state.serviceTypeIds.indexOf(serviceTypes[i].number) > -1;
            }
            this.setState({serviceTypeIds: null});
            return serviceTypes;
        }
        if (this.state.serviceTypes) {
            return this.state.serviceTypes;
        } else {
            let serviceTypes = await this.serviceData.listServiceTypes();
            for (let i = 0; i < serviceTypes.length; i++) {
                serviceTypes[i].active = false
            }
            return serviceTypes
        }
    }

    setOffline(flag = true) {
        this.setState({
            offline: flag,
            loading: !flag,
            loaded: true,
            refreshing: false
        });
    }

    async fetchData(forceRefresh = false) {
        this.setState({
            loading: true
        });
        const {region} = this.props;
        if (!region) {
            this.setState({
                loaded: true,
                loading: false
            });
            return;
        }
        const criteria = this.state.searchCriteria;
        try {
            let serviceTypes = await this.getServiceTypes();
            let types = this.getServiceTypeNumbers(serviceTypes);
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    let {latitude, longitude} = position.coords;
                    this.setState({
                        location: {latitude: latitude, longitude: longitude}
                    });
                    this.serviceData.pageServices(
                        region.slug,
                        {latitude, longitude},
                        criteria,
                        1,
                        PAGE_SIZE,
                        types,
                        true
                    ).then((serviceResult) => {
                        let services = serviceResult.results;
                        services = _.uniq(services, false, (s) => s.id);

                        this.setState({
                            dataSource: this.state.dataSource.cloneWithRows(services),
                            serviceTypeDataSource: this.state.serviceTypeDataSource.cloneWithRows(serviceTypes),
                            loaded: true,
                            serviceTypes,
                            locations: [region],
                            searchCriteria: criteria,
                            region,
                            services,
                            canLoadMoreContent: (!!serviceResult.next),
                            pageNumber: 1,
                            offline: false,
                            loading: false
                        });
                    }, ((e) => {
                        this.setOffline(true)
                    }));
                },
                (error) => {
                    console.log(error);
                    this.serviceData.pageServices(
                        region.slug,
                        this.state.location,
                        criteria,
                        1,
                        PAGE_SIZE,
                        types
                    ).then((serviceResult) => {
                        let services = serviceResult.results;
                        services = _.uniq(services, false, (s) => s.id);

                        this.setState({
                            dataSource: this.state.dataSource.cloneWithRows(services),
                            serviceTypeDataSource: this.state.serviceTypeDataSource.cloneWithRows(serviceTypes),
                            loaded: true,
                            serviceTypes,
                            locations: [region],
                            searchCriteria: criteria,
                            region,
                            services,
                            canLoadMoreContent: (!!serviceResult.next),
                            pageNumber: 1,
                            offline: false,
                            loading: false
                        }, ((e) => {
                            console.log(e)
                        }));
                    });
                },
                {enableHighAccuracy: false, timeout: 5000, maximumAge: forceRefresh ? 1000 : 30 * 60 * 1000}
            );
        } catch (e) {
            console.log(e);
            this.setOffline(true)
        }
    }

    onRefresh() {
        this.setState({refreshing: true});
        this.fetchData(true).then(() => {
            this.setState({
                refreshing: false,
                loading: false
            });
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
        let locationName = (location) ? location.pageTitle : '';

        let widget = null;
        if (serviceType) {

            let iconName = (serviceType.vector_icon || '').trim();
            if (iconName) {
                widget = (<View
                    style={{
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: 48,
                        height: 48,
                        backgroundColor: themes.light.greenAccentColor,
                        borderColor: themes[theme].backgroundColor,
                        borderRadius: 12,
                        borderWidth: 1
                    }}
                >
                    <Icon
                        name={iconName}
                        style={{
                            fontSize: 24,
                            color: themes.dark.textColor,
                            textAlign: 'center',
                        }}
                    />
                </View>);
            } else {
                widget = (<Image
                    source={{uri: serviceType.icon_url}}
                    style={styles.mapIcon}
                />);
            }
        }

        return (
            <TouchableHighlight
                onPress={() => requestAnimationFrame(() => this.onClick({service, serviceType, location})) }
                underlayColor={getUnderlayColor(theme) }
            >
                <View
                    style={[
                        styles.listItemContainer,
                        getContainerColor(theme),
                        {height: 80, borderBottomWidth: 0, paddingBottom: 0, paddingTop: 0}
                    ]}
                >
                    <View style={[
                        getRowOrdering(direction),
                        styles.flex
                    ]}
                    >
                        <View style={styles.listItemIconContainer}>
                            {widget}
                        </View>
                        <View style={[
                            styles.dividerLongInline,
                            getDividerColor(theme)
                        ]}/>
                        <View style={[
                            styles.container,
                            getAlignItems(direction),
                            getContainerColor(theme),
                            {borderBottomWidth: 1, justifyContent: 'center'}
                        ]}>
                            <View style={{paddingHorizontal: 10}}>
                                <Text
                                    style={[
                                        getAlignItems(direction),
                                        getFontFamily(language),
                                        getTextColor(theme),
                                        getTextAlign(direction),
                                        {fontSize: 15, paddingBottom: 2, fontWeight: '500'}
                                    ]}
                                >
                                    {service.name}
                                </Text>
                                <View style={[styles.row, getRowOrdering(direction), {paddingBottom: 2}]}>
                                    <Icon
                                        name="ios-pin"
                                        style={[
                                            {fontSize: 13, marginHorizontal: 4},
                                            {color: theme == 'dark' ? themes.dark.greenAccentColor : themes.light.textColor}
                                        ]}
                                    />
                                    <Text style={[
                                        getFontFamily(language), {
                                            color: theme == 'dark' ? themes.dark.greenAccentColor : themes.light.textColor,
                                            fontSize: 12,
                                        }
                                    ]}>
                                        {locationName}
                                    </Text>
                                </View>
                                <Text
                                    style={[
                                        getFontFamily(language),
                                        getTextColor(theme),
                                        getTextAlign(direction),
                                        {fontSize: 11, paddingBottom: 2, fontWeight: '500'}
                                    ]}
                                >
                                    {service.provider.name.substr(0, 40)}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableHighlight>
        );
    }

    toggleServiceType(type) {
        let serviceTypes = this.state.serviceTypes;
        let index = serviceTypes.findIndex((obj) => {
            return obj.number === type.number
        });
        serviceTypes[index].active = !serviceTypes[index].active;
        this.setState({
            serviceTypeDataSource: this.state.dataSource.cloneWithRows(serviceTypes)
        })
    }

    renderServiceTypeRow(type) {
        return (
            <SelectableListItem
                text={type.name}
                onPress={this.toggleServiceType.bind(this, type) }
                selected={type.active}
                icon={type.vector_icon || null}
            />
        );
    }

    filterByText(event) {
        if (this.state.region) {
            this.setState({
                searchCriteria: event.nativeEvent.text,
                filteringView: false
            }, () => {
                this.fetchData().done()
            })
        }
    }

    searchFilterButtonAction() {
        requestAnimationFrame(() => {
            if (this.state.region) {
                this.setState({
                    filteringView: !this.state.filteringView
                })
            }
        })
    }

    async _loadMoreContentAsync() {
        const {pageNumber, services, region, canLoadMoreContent, searchCriteria, serviceTypes} = this.state;
        if (!canLoadMoreContent) {
            return;
        }

        try {
            const types = this.getServiceTypeNumbers(serviceTypes);
            const {latitude, longitude} = (this.state.location || {});
            const serviceResult = await this.serviceData.pageServices(
                region.slug,
                {latitude, longitude},
                searchCriteria,
                pageNumber + 1,
                PAGE_SIZE,
                types
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

    clearFilters() {
        let serviceTypes = this.state.serviceTypes;
        for (let i = 0; i < serviceTypes.length; i++) {
            serviceTypes[i].active = false;
        }
        this.setState({
            serviceTypes: serviceTypes,
            serviceTypeDataSource: this.state.dataSource.cloneWithRows(serviceTypes)
        }, () => {
            this.fetchData().done()
        });
    }

    getServiceTypeNumbers(serviceTypes) {
        let types = [];
        for (let i = 0; i < serviceTypes.length; i++) {
            if (serviceTypes[i].active) {
                types.push(serviceTypes[i].number)
            }
        }
        return types.join()
    }

    filterByTypes() {
        this.fetchData().then(() =>
            this.setState({
                filteringView: false
            })
        )
    }

    render() {
        const {theme, language} = this.props;
        const {region, filteringView, loading, refreshing} = this.state;
        const viewContent = (!filteringView) ? (
            <ListView
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this.onRefresh.bind(this) }
                    />
                }
                enableEmptySections={true}
                dataSource={this.state.dataSource}
                renderRow={(service) => this.renderRow(service) }
                renderScrollComponent={props => <InfiniteScrollView {...props} />}
                keyboardShouldPersistTaps={true}
                keyboardDismissMode="on-drag"
                direction={this.props.direction}
                canLoadMore={this.state.canLoadMoreContent}
                onLoadMoreAsync={() => {
                    this._loadMoreContentAsync()
                } }
            />
        ) : (
            <View style={styles.container}>
                <View
                    style={[
                        styles.searchBarContainer,
                        theme == 'dark' ? styles.searchBarContainerDark : styles.searchBarContainerLight
                    ]}
                >
                    <Button
                        color="green"
                        icon="md-close"
                        text={I18n.t('CLEAR_FILTERS').toUpperCase() }
                        onPress={this.clearFilters.bind(this) }
                        buttonStyle={{height: 44, marginRight: 2}}
                        iconStyle={Platform.OS === 'ios' ? {top: 2} : {}}
                    />
                    <Button
                        color="green"
                        icon="md-funnel"
                        text={I18n.t('FILTER_SERVICES').toUpperCase() }
                        onPress={this.filterByTypes.bind(this) }
                        buttonStyle={{height: 44, marginLeft: 2}}
                    />
                </View>
                <ListView style={{flex: 1}}
                          enableEmptySections={true}
                          dataSource={this.state.serviceTypeDataSource}
                          renderRow={(type) => this.renderServiceTypeRow(type) }
                          keyboardShouldPersistTaps={true}
                          keyboardDismissMode="on-drag"
                          direction={this.props.direction}
                />
            </View>
        );

        return (
            <View style={styles.container}>
                <View style={[
                    styles.row, {paddingHorizontal: 5},
                    {backgroundColor: (theme == 'dark') ? themes.dark.menuBackgroundColor : themes.light.dividerColor}]
                }>
                    <SearchBar
                        theme={theme}
                        searchText={this.state.searchCriteria}
                        initialSearchText={this.state.searchCriteria}
                        searchFunction={(event) => this.filterByText(event) }
                    />
                    <SearchFilterButton
                        theme={theme}
                        onPressAction={() => this.searchFilterButtonAction() }
                        active={filteringView}
                    />
                </View>
                <View
                    style={[
                        styles.viewHeaderContainer,
                        {backgroundColor: (theme == 'dark') ? themes.dark.menuBackgroundColor : themes.light.dividerColor},
                        {paddingTop: 10}
                    ]}
                >
                    <Text
                        style={[
                            styles.viewHeaderText,
                            getFontFamily(language),
                            theme == 'dark' ? styles.viewHeaderTextDark : styles.viewHeaderTextLight
                        ]}
                    >
                        {(!region)
                            ? I18n.t('LOADING_SERVICES').toUpperCase()
                            : (filteringView)
                            ? I18n.t('FILTER_BY_CATEGORY').toUpperCase()
                            : (this.state.dataSource._dataBlob.s1.length > 0)
                            ? I18n.t('NEAREST_SERVICES').toUpperCase()
                            : I18n.t('NO_SERVICES_FOUND').toUpperCase()
                        }
                    </Text>
                </View>
                <OfflineView
                    offline={this.state.offline}
                    onRefresh={this.onRefresh.bind(this)}
                />
                {viewContent}
                {!filteringView && (
                    <MapButton
                        direction={this.props.direction}
                        searchCriteria={this.state.searchCriteria}
                        serviceTypes={this.state.serviceTypes}
                    />) }
                {(loading && !refreshing) &&
                <LoadingOverlay theme={theme} height={height - getToolbarHeight() } width={width}/>
                }
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

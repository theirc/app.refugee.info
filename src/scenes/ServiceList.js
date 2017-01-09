import React, {Component, PropTypes} from 'react';
import {
    View,
    ListView,
    RefreshControl,
    Dimensions
} from 'react-native';
import I18n from '../constants/Messages';
import {
    DirectionalText,
    MapButton,
    OfflineView,
    SearchBar,
    SearchFilterButton,
    ServiceListItem,
    ServiceCategoryListView,
    LoadingOverlay
} from '../components';
import {connect} from 'react-redux';
import InfiniteScrollView from 'react-native-infinite-scroll-view';
import {Services} from '../data';
import styles, {
    themes,
    getToolbarHeight
} from '../styles';

const {width, height} = Dimensions.get('window');
const PAGE_SIZE = 10;

export class ServiceList extends Component {

    static contextTypes = {
        navigator: PropTypes.object.isRequired
    };

    static propTypes = {
        region: PropTypes.object,
        searchCriteria: PropTypes.string,
        serviceTypeIds: PropTypes.array
    };

    constructor(props) {
        super(props);

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

        this.filterByTypes = this.filterByTypes.bind(this);
        this.clearFilters = this.clearFilters.bind(this);
        this.onRefresh = this.onRefresh.bind(this);
    }

    componentWillMount() {
        this.serviceData = new Services(this.props);
        if (!this.state.loaded) {
            this.fetchData().then(() => {
                this.setState({loading: false});
            });
        }
    }

    async getServiceTypes() {
        if (this.state.serviceTypeIds) {
            let serviceTypes = await this.serviceData.listServiceTypes();
            serviceTypes.forEach((type) => {
                type.active = this.state.serviceTypeIds.indexOf(type.number) > -1;
                type.onPress = this.toggleServiceType.bind(this, type);
            });
            this.setState({serviceTypeIds: null});
            return serviceTypes;
        }
        if (this.state.serviceTypes) {
            return this.state.serviceTypes;
        } else {
            let serviceTypes = await this.serviceData.listServiceTypes();
            serviceTypes.forEach((type) => {
                type.active = false;
                type.onPress = this.toggleServiceType.bind(this, type);

            });
            return serviceTypes;
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

    getPosition(options) {
        return new Promise(function (resolve, reject) {
            navigator.geolocation.getCurrentPosition(resolve, reject, options);
        });
    }

    async fetchData(forceRefresh = false) {
        this.setState({
            loading: true
        });
        const {navigator} = this.context;
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
            const types = this.getServiceTypeNumbers(serviceTypes);
            const options = {
                enableHighAccuracy: false,
                timeout: 3000,
                maximumAge: forceRefresh ? 1000 : 30 * 60 * 1000
            };
            let {latitude, longitude} = {};
            this.getPosition(options)
                .then((position) => {
                    // when position was determined
                    latitude = position.coords.latitude;
                    longitude = position.coords.longitude;
                    this.setState({
                        location: {latitude, longitude}
                    });
                })
                .catch(() => {
                    // when position cannot be determined
                })
                .finally(() => {
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
                        services.forEach((service) => {
                            service.type = serviceTypes.find(function (type) {
                                return type.url == service.type;
                            });
                            service.locationName = region.name;
                            service.onPress = () => {
                                requestAnimationFrame(() => {
                                    navigator.forward(null, null, {service, location: region}, this.state);
                                });
                            };
                        });

                        this.setState({
                            dataSource: this.state.dataSource.cloneWithRows(services),
                            serviceTypeDataSource: this.state.serviceTypeDataSource.cloneWithRows(serviceTypes),
                            loaded: true,
                            serviceTypes,
                            services,
                            searchCriteria: criteria,
                            region,
                            canLoadMoreContent: (!!serviceResult.next),
                            pageNumber: 1,
                            offline: false,
                            loading: false
                        });
                    }, (() => {
                        this.setOffline(true);
                    }));
                });
        } catch (e) {
            this.setOffline(true);
        }
    }

    async _loadMoreContentAsync() {
        const {region} = this.props;
        const {pageNumber, services, canLoadMoreContent, searchCriteria, serviceTypes} = this.state;
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
            newServices.forEach((service) => {
                service.type = serviceTypes.find(function (type) {
                    return type.url == service.type;
                });
                service.locationName = region.name;
                service.onPress = () => {
                    requestAnimationFrame(() => {
                        navigator.forward(null, null, {service, location: region}, this.state);
                    });
                };
            });

            let allServices = services.concat(newServices);

            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(allServices),
                services: allServices,
                pageNumber: pageNumber + 1,
                searchCriteria,
                canLoadMoreContent: (!!serviceResult.next)
            });

        } catch (e) {
            this.setOffline(true);
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

    onPress(params) {
        const {navigator} = this.context;
        navigator.forward(null, null, params, this.state);
    }

    renderRow(rowData) {
        return (
            <ServiceListItem service={rowData}/>
        );
    }

    toggleServiceType(type) {
        let serviceTypes = this.state.serviceTypes;
        let index = serviceTypes.findIndex((obj) => {
            return obj.number === type.number;
        });
        serviceTypes[index].active = !serviceTypes[index].active;
        this.setState({
            serviceTypeDataSource: this.state.dataSource.cloneWithRows(serviceTypes)
        });
    }

    filterByText(event) {
        if (this.state.region) {
            this.setState({
                searchCriteria: event.nativeEvent.text,
                filteringView: false
            }, () => {
                this.fetchData().done();
            });
        }
    }

    searchFilterButtonAction() {
        requestAnimationFrame(() => {
            if (this.state.region) {
                this.setState({
                    filteringView: !this.state.filteringView
                });
            }
        });
    }

    clearFilters() {
        let serviceTypes = this.state.serviceTypes;
        for (let i = 0; i < serviceTypes.length; i++) {
            serviceTypes[i].active = false;
        }
        this.setState({
            serviceTypes,
            serviceTypeDataSource: this.state.dataSource.cloneWithRows(serviceTypes)
        }, () => {
            this.fetchData().done();
        });
    }

    getServiceTypeNumbers(serviceTypes) {
        let types = [];
        for (let i = 0; i < serviceTypes.length; i++) {
            if (serviceTypes[i].active) {
                types.push(serviceTypes[i].number);
            }
        }
        return types.join();
    }

    filterByTypes() {
        this.fetchData().then(() =>
            this.setState({
                filteringView: false
            })
        );
    }

    renderFilteringView() {
        const {serviceTypeDataSource} = this.state;
        return (
            <ServiceCategoryListView
                dataSource={serviceTypeDataSource}
                onClear={this.clearFilters}
                onFilter={this.filterByTypes}
            />
        );
    }

    renderServiceList() {
        return (
            <ListView
                canLoadMore={this.state.canLoadMoreContent}
                dataSource={this.state.dataSource}
                enableEmptySections
                keyboardDismissMode="on-drag"
                keyboardShouldPersistTaps
                onLoadMoreAsync={() => {this._loadMoreContentAsync()}}
                refreshControl={
                    <RefreshControl
                        onRefresh={this.onRefresh}
                        refreshing={this.state.refreshing}
                    />
                }
                renderRow={(service) => this.renderRow(service)}
                renderScrollComponent={props => <InfiniteScrollView {...props} />}
            />
        );
    }

    render() {
        const {region, filteringView, loading, refreshing} = this.state;
        const viewContent = (!filteringView) ? this.renderServiceList() : this.renderFilteringView();

        return (
            <View style={styles.container}>
                <View style={[
                    styles.row, {paddingHorizontal: 5},
                    {backgroundColor: themes.light.lighterDividerColor}]}
                >
                    <SearchBar
                        initialSearchText={this.state.searchCriteria}
                        searchFunction={(event) => this.filterByText(event)}
                        searchText={this.state.searchCriteria}
                    />
                    <SearchFilterButton
                        active={filteringView}
                        onPressAction={() => this.searchFilterButtonAction()}
                    />
                </View>
                <View
                    style={[
                        styles.viewHeaderContainer,
                        {backgroundColor: themes.light.lighterDividerColor},
                        {paddingTop: 10}
                    ]}
                >
                    <DirectionalText
                        style={[
                            styles.viewHeaderText,
                            styles.viewHeaderTextLight
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
                    </DirectionalText>
                </View>
                <OfflineView
                    offline={this.state.offline}
                    onRefresh={this.onRefresh}
                />
                {viewContent}
                {!filteringView && (
                    <MapButton
                        searchCriteria={this.state.searchCriteria}
                        serviceTypes={this.state.serviceTypes}
                    />) }
                {(loading && !refreshing) &&
                <LoadingOverlay
                    height={height - getToolbarHeight()}
                    width={width}
                />}
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        country: state.country,
        region: state.region,
        language: state.language
    };
};

export default connect(mapStateToProps)(ServiceList);

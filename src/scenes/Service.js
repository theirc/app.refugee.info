import React, {Component, PropTypes} from 'react';
import {
    View,
    StyleSheet,
    Dimensions
} from 'react-native';
import I18n from '../constants/Messages';
import {
    OfflineView,
    SearchBar,
    ServiceListItem,
    ServiceCategoryListView,
    LoadingOverlay,
    ServiceList,
    ServiceMap,
    ToggleButton
} from '../components';
import {connect} from 'react-redux';
import {Services} from '../data';
import styles, {themes, isStatusBarTranslucent, getElevation} from '../styles';
import {Actions} from 'react-native-router-flux';

const PAGE_SIZE = 100000;
const {width} = Dimensions.get('window');


export class Service extends Component {

    static propTypes = {
        list: PropTypes.bool,
        map: PropTypes.bool,
        region: PropTypes.object,
        searchCriteria: PropTypes.string,
        serviceTypeIds: PropTypes.array
    };

    constructor(props) {
        super(props);

        this.state = {
            loaded: false,
            refreshing: false,
            offline: false,
            canLoadMoreContent: true,
            pageNumber: 1,
            filtering: false,
            list: props.list,
            map: props.map,
            services: [],
            searchCriteria: props.searchCriteria || '',
            serviceTypeIds: props.serviceTypeIds,
            loading: true,
            location: {latitude: 0, longitude: 0}
        };

        this.filterByTypes = this.filterByTypes.bind(this);
        this.clearFilters = this.clearFilters.bind(this);
        this.onRefresh = this.onRefresh.bind(this);
        this.toggleFilteringView = this.toggleFilteringView.bind(this);
        this.toggleListView = this.toggleListView.bind(this);
        this.toggleMapView = this.toggleMapView.bind(this);
    }

    componentDidMount() {
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
            this.getPosition(options).then((position) => {
                // when position was determined
                latitude = position.coords.latitude;
                longitude = position.coords.longitude;
                this.setState({
                    location: {latitude, longitude}
                });
            }).catch(() => {
                // when position cannot be determined
            }).finally(() => {
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
                            return type.number == service.type;
                        });
                        service.locationName = region.name;
                        service.onPress = () => {
                            requestAnimationFrame(() => {
                                Actions.serviceDetails({service, location: region});
                            });
                        };
                    });

                    this.setState({
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
                    return type.number == service.type;
                });
                service.locationName = region.name;
                service.onPress = () => {
                    requestAnimationFrame(() => {
                        Actions.serviceDetails({service, location: region});
                    });
                };
            });

            let allServices = services.concat(newServices);

            this.setState({
                services: allServices,
                pageNumber: pageNumber + 1,
                searchCriteria,
                canLoadMoreContent: (!!serviceResult.next)
            });
            this._loadMoreContentAsync();
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
        Actions.serviceDetails(params);
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
        this.setState({serviceTypes});
    }

    filterByText(event) {
        if (this.state.region) {
            this.setState({
                searchCriteria: event.nativeEvent.text
            }, () => {
                this.fetchData().done();
            });
        }
    }

    toggleFilteringView() {
        requestAnimationFrame(() => {
            if (this.state.region) {
                this.setState({
                    filtering: true,
                    map: false,
                    list: false
                });
            }
        });
    }

    toggleListView() {
        this.filterByTypes();
        requestAnimationFrame(() => {
            if (this.state.region) {
                this.setState({
                    filtering: false,
                    map: false,
                    list: true
                });
            }
        });
    }

    toggleMapView() {
        this.filterByTypes();
        requestAnimationFrame(() => {
            if (this.state.region) {
                this.setState({
                    filtering: false,
                    map: true,
                    list: false
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
            serviceTypes
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
                filtering: false
            })
        );
    }

    renderFilteringView() {
        const {serviceTypes, filtering} = this.state;
        if (!filtering) {
            return <View />;
        }
        return (
            <ServiceCategoryListView
                onClear={this.clearFilters}
                onFilter={this.filterByTypes}
                serviceTypes={serviceTypes}
            />
        );
    }

    renderServiceList() {
        const {services, list} = this.state;
        if (!list || !services) {
            return (<View />);
        }
        return (
            <ServiceList services={services}/>
        );
    }

    renderServiceMap() {
        const {services, map} = this.state;
        const {region} = this.props;
        if (!map || !services) {
            return (<View />);
        }
        return (
            <ServiceMap
                region={region}
                services={services}
            />
        );
    }

    renderLoadingView() {
        const {loading} = this.state;
        if (!loading) {
            return <View />;
        }
        return (
            <LoadingOverlay />
        );
    }

    renderOfflineView() {
        const {offline} = this.state;
        if (!offline) {
            return null;
        }
        return (
            <View style={[getElevation(), componentStyles.offlineViewContainer]}>
                <OfflineView
                    floating
                    offline={offline}
                    onRefresh={this.onRefresh}
                />
            </View>
        );
    }

    renderHeaderView() {
        const {filtering, list, map} = this.state;
        const opaqueHeader = filtering || list;
        const offlineView = this.renderOfflineView();

        return (
            <View style={[
                componentStyles.header,
                opaqueHeader && componentStyles.opaqueHeader
            ]}
            >
                <View style={[
                    styles.row,
                    componentStyles.searchBarContainer
                ]}
                >
                    <SearchBar
                        drawerButton
                        floating
                        initialSearchText={this.props.searchCriteria}
                        searchFunction={(text) => this.filterByText(text)}
                        searchText={this.state.searchCriteria}
                    />
                </View>
                <View style={[
                    styles.row,
                    componentStyles.toggleBarContainer
                ]}
                >
                    <View style={[componentStyles.toggleButtonsContainer, getElevation()]}>
                        <ToggleButton
                            active={filtering}
                            icon="md-funnel"
                            onPress={this.toggleFilteringView}
                            text={I18n.t('FILTER').toUpperCase()}
                        />
                        <ToggleButton
                            active={list}
                            icon="fa-list"
                            iconStyle={{fontSize: 17}}
                            onPress={this.toggleListView}
                            text={I18n.t('LIST').toUpperCase()}
                        />
                        <ToggleButton
                            active={map}
                            icon="fa-map"
                            iconStyle={{fontSize: 17}}
                            onPress={this.toggleMapView}
                            text={I18n.t('EXPLORE_MAP').toUpperCase()}
                        />
                    </View>
                </View>
                {offlineView}
            </View>
        );
    }

    render() {
        const {loading} = this.state;

        const headerView = this.renderHeaderView(),
            loadingView = this.renderLoadingView();
        if (loading) {
            return (
                <View style={styles.flex}>
                    {headerView}
                    {loadingView}
                </View>
            );
        }
        const filteringView = this.renderFilteringView(),
            listView = this.renderServiceList(),
            mapView = this.renderServiceMap();
        return (
            <View style={styles.flex}>
                {mapView}
                {headerView}
                {filteringView}
                {listView}
                {loadingView}
            </View>
        );
    }
}


const componentStyles = StyleSheet.create({
    header: {
        position: 'absolute',
        top: 0,
        paddingTop: isStatusBarTranslucent() ? 25 : 0,
        flexDirection: 'column',
        width
    },
    opaqueHeader: {
        backgroundColor: themes.light.lighterDividerColor
    },
    searchBarContainer: {
        height: 60,
        paddingHorizontal: 5
    },
    toggleBarContainer: {
        height: 50,
        paddingHorizontal: 5
    },
    toggleButtonsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 44,
        borderRadius: 2,
        flex: 1
    },
    offlineViewContainer: {
        backgroundColor: themes.light.backgroundColor,
        position: 'absolute',
        left: 0,
        top: isStatusBarTranslucent() ? 25 : 0,
        width: width - 10,
        height: 105,
        marginHorizontal: 5
    }
});

const mapStateToProps = (state) => {
    return {
        country: state.country,
        region: state.region,
        language: state.language
    };
};

export default connect(mapStateToProps)(Service);

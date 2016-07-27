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
    getToolbarHeight
} from '../styles';

import {Icon} from '../components'


var _ = require('underscore');
var {width, height} = Dimensions.get('window');

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
                serviceTypeDataSource: new ListView.DataSource({
                    rowHasChanged: (row1, row2) => row1.id !== row2.id
                }),
                loaded: false,
                refreshing: false,
                offline: false,
                lastSync: null,
                canLoadMoreContent: true,
                pageNumber: 1,
                filteringView: false,
                searchCriteria: '',
                loading: false
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
                console.log(error);
                this.setState({
                    location: {
                        latitude: 0,
                        longitude: 0
                    }
                });
            }, { enableHighAccuracy: false, timeout: 5000, maximumAge: 100000 }
        );
    }

    async fetchData() {
        this.setState({
            loading: true
        });
        const {region} = this.props;
        const criteria = this.state.searchCriteria;
        if (!region) {
            this.setState({
                loaded: true
            });
            return;
        }
        try {
            await this.setLocation();
            const {latitude, longitude} = (this.state.location || {});

            let serviceTypes = null;
            if (this.state.serviceTypes) {
                serviceTypes = this.state.serviceTypes
            } else {
                serviceTypes = await this.serviceData.listServiceTypes(true);
                for (let i = 0; i < serviceTypes.length; i++) {
                    serviceTypes[i].active = false
                }
            }
            let types = this.getServiceTypeNumbers(serviceTypes);
            let serviceResult = await this.serviceData.pageServices(
                region.slug,
                { latitude, longitude },
                criteria,
                1,
                10,
                types
            );
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
        } catch (e) {
            console.log(e);
            this.setState({
                offline: true,
                loading: false
            });
        }
    }

    onRefresh() {
        this.setState({ refreshing: true });
        this.fetchData().then(() => {
            this.setState({ refreshing: false });
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

        let iconName = (serviceType.vector_icon || '').trim();
        let widget = null;
        if (iconName) {
            widget = (<View
                style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 36,
                    height: 36,
                    backgroundColor: themes.light.greenAccentColor,
                    borderColor: themes[theme].backgroundColor,
                    borderRadius: 10,
                    borderWidth: 1
                }}
                >
                <Icon
                    name={iconName}
                    style={{
                        fontSize: 24,
                        width: 24,
                        height: 24,
                        color: themes.dark.textColor,
                        textAlign: 'center',
                    }}
                    />
            </View>);
        } else {
            widget = (<Image
                source={{ uri: serviceType.icon_url }}
                style={styles.mapIcon}
                />);
        }


        return (
            <TouchableHighlight
                onPress={() => requestAnimationFrame(() => this.onClick({ service, serviceType, location })) }
                underlayColor={getUnderlayColor(theme) }
                >
                <View
                    style={[
                        styles.listItemContainer,
                        getContainerColor(theme),
                        { height: 80, borderBottomWidth: 0, paddingBottom: 0, paddingTop: 0 }
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
                            { borderBottomWidth: 1, paddingLeft: 20, paddingTop: 14, paddingRight: 20 }
                        ]}>
                            <Text
                                style={[
                                    getFontFamily(language),
                                    getTextColor(theme),
                                    { fontSize: 15, paddingBottom: 2, fontWeight: '500' }
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
                                    getFontFamily(language), {
                                        color: theme == 'dark' ? themes.dark.greenAccentColor : themes.light.textColor,
                                        fontSize: 11
                                    }
                                ]}>
                                    {locationName}
                                </Text>
                            </View>
                            <Text
                                style={[
                                    getFontFamily(language),
                                    getTextColor(theme),
                                    { fontSize: 11, paddingBottom: 2, fontWeight: '500' }
                                ]}
                                >
                                {service.provider.name}
                            </Text>
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
                fontSize={13}
                onPress={this.toggleServiceType.bind(this, type) }
                selected={type.active}
                image={type.icon_url ? { uri: type.icon_url } : null}
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
        let types = this.getServiceTypeNumbers(serviceTypes);

        try {
            const {latitude, longitude} = (this.state.location || {});
            let serviceResult = await this.serviceData.pageServices(
                region.slug,
                { latitude, longitude },
                searchCriteria,
                pageNumber + 1,
                10,
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

    componentWillUpdate() {
        LayoutAnimation.easeInEaseOut();
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
                            buttonStyle={{ height: 33, marginRight: 2 }}
                            iconStyle={Platform.OS === 'ios' ? { top: 2 } : {}}
                            />
                        <Button
                            color="green"
                            icon="md-funnel"
                            text={I18n.t('FILTER_SERVICES').toUpperCase() }
                            onPress={this.filterByTypes.bind(this) }
                            buttonStyle={{ height: 33, marginLeft: 2 }}
                            />
                    </View>
                    <ListView  style={{ flex: 1 }}
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
                <View style={styles.row}>
                    <SearchBar
                        theme={theme}
                        searchText={this.state.searchCriteria}
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
                        { backgroundColor: (theme == 'dark') ? themes.dark.menuBackgroundColor : themes.light.dividerColor },
                        { paddingTop: 10 }
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
                                : I18n.t('NEAREST_SERVICES').toUpperCase()
                        }
                    </Text>
                </View>
                <OfflineView
                    offline={this.state.offline}
                    onRefresh={this.onRefresh.bind(this) }
                    lastSync={this.state.lastSync}
                    />
                {viewContent}
                {!filteringView && (
                    <MapButton
                        direction={this.props.direction}
                        searchCriteria={this.state.searchCriteria}
                        serviceTypes={this.state.serviceTypes}
                        />) }
                {(loading && !refreshing) && <LoadingOverlay theme={theme} height={height - getToolbarHeight()} width={width}/>}
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

import React, {Component, PropTypes} from 'react';
import {
    View,
    ListView,
    Text,
    Dimensions,
    Platform,
    ScrollView
} from 'react-native';
import MapView from 'react-native-maps';
import styles, {
    themes,
    getFontFamily,
    getRowOrdering,
    getElevation,
    getContainerColor,
    isStatusBarTranslucent
} from '../styles';
import I18n from '../constants/Messages';
import ServiceCommons from '../utils/ServiceCommons';
import {connect} from 'react-redux';
import {
    MapPopup,
    Button,
    SearchBar,
    SelectableListItem,
    LoadingOverlay,
    Icon
} from '../components';
import {Services} from '../data';

let _ = require('underscore');
let {width, height} = Dimensions.get('window');

const RADIUS_MULTIPLIER = 1.2;
const MAX_SERVICES = 50;
const R = 6371e3; // earth R in metres

let activeMarkerScrollViewRef;

class ServiceMap extends Component {
    static noHeader = true;

    static propTypes = {
        searchCriteria: React.PropTypes.string
    };

    static contextTypes = {
        navigator: PropTypes.object.isRequired
    };

    static getInitialRegion(region) {
        if (!region || !region.envelope) {
            return null;
        }

        let lats = region.envelope.coordinates[0].map(c => c[1]), longs = region.envelope.coordinates[0].map(c => c[0]);
        let minLat = Math.min.apply(null, lats), minLong = Math.min.apply(null, longs);
        let maxLat = Math.max.apply(null, lats), maxLong = Math.max.apply(null, longs);

        return {
            latitude: (minLat + maxLat) / 2,
            longitude: (minLong + maxLong) / 2,
            latitudeDelta: (maxLat - minLat) * RADIUS_MULTIPLIER,
            longitudeDelta: (maxLong - minLong) * RADIUS_MULTIPLIER
        };
    }

    constructor(props) {
        super(props);
        this.state = {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1.id !== row2.id
            }),
            markers: [],
            filteringView: false,
            searchCriteria: '',
            initialEnvelope: null,
            loading: false,
            offline: false,
            refreshing: false,
            activeMarker: null
        };
        this.serviceCommons = new ServiceCommons();
    }

    componentDidMount() {
        const {region, searchCriteria, serviceTypes} = this.props;
        let currentEnvelope = ServiceMap.getInitialRegion(region);
        this.setState({
            initialEnvelope: currentEnvelope,
            searchCriteria,
            serviceTypes,
            regionArea: currentEnvelope
        }, () => {
            this.fetchData(currentEnvelope).then(() => {
                this.redrawMarkers(currentEnvelope);
                this._fitMap();
            });
        });

    }

    onRegionChange(regionArea) {
        if (Platform.OS === 'ios') {
            this.clearActiveMarker();
        }
        this.setState({regionArea});
    }

    onMarkerPress(marker) {
        this.setState({
            activeMarker: marker
        }, () => {
            // redrawing causes visual glitches on Android, because it center the view automatically at selected marker
            if (Platform.OS === 'ios') {
                this.redrawMarkers(this.state.regionArea);
            }
        });
        if (this.activeMarkerScrollViewRef && Platform.OS === 'android') {
            // hacky way to make sure that ScrollView content renders when switching active marker on Android
            this.activeMarkerScrollViewRef.scrollTo({x: 0, y: 0, animated: false});
        }
    }

    clearActiveMarker() {
        this.setState({
            activeMarker: null
        });
    }

    async fetchData(envelope = {}) {
        this.setState({
            loading: true
        });
        const {region, theme} = this.props;
        const criteria = this.state.searchCriteria;
        const serviceData = new Services(this.props);

        let currentEnvelope = envelope;
        if (!region) {
            this.setState({
                loading: false
            });
            return;
        }
        let serviceTypes = null;
        if (this.state.serviceTypes) {
            serviceTypes = this.state.serviceTypes;
        } else {
            serviceTypes = await serviceData.listServiceTypes();
            for (let i = 0; i < serviceTypes.length; i++) {
                serviceTypes[i].active = false;
            }
        }
        let types = this.getServiceTypeNumbers(serviceTypes);
        try {
            let serviceResult = await serviceData.pageServices(
                region.slug,
                currentEnvelope,
                criteria,
                1,
                MAX_SERVICES,
                types
            );
            let services = serviceResult.results;
            services = _.uniq(services, false, (s) => s.id);
            let markers = services.map(service => {
                let serviceType = serviceTypes.find(function (type) {
                    return type.url == service.type;
                });
                return {
                    latitude: service.location.coordinates[1],
                    longitude: service.location.coordinates[0],
                    description: service.description,
                    title: service.name,
                    service,
                    serviceType
                };
            });

            this.setState({
                serviceTypes,
                locations: [region],
                searchCriteria: criteria,
                markers,
                region,
                services,
                serviceTypeDataSource: this.state.dataSource.cloneWithRows(serviceTypes),
                loading: false,
                offline: false
            });
        } catch (e) {
            console.log(e);

            this.setState({
                serviceTypes,
                locations: [region],
                searchCriteria: criteria,
                region,
                serviceTypeDataSource: this.state.dataSource.cloneWithRows(serviceTypes),
                offline: true,
                loading: false
            });
        }
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

    renderServiceTypeRow(type) {
        return (
            <SelectableListItem
                text={type.name}
                onPress={this.toggleServiceType.bind(this, type)}
                selected={type.active}
                icon={type.vector_icon || null}
            />
        );
    }

    filterByText(event) {
        const {region, regionArea} = this.state;
        if (this.state.region) {
            this.setState({
                searchCriteria: event.nativeEvent.text,
                filteringView: false,
                markers: []
            }, () => {
                this.fetchData(this.state.initialEnvelope).then(() => this.redrawMarkers(regionArea));
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
        this.setState({markers: []});
        const {serviceTypes, regionArea} = this.state;
        for (let i = 0; i < serviceTypes.length; i++) {
            serviceTypes[i].active = false;
        }
        this.setState({
            serviceTypes,
            filteringView: false,
            serviceTypeDataSource: this.state.dataSource.cloneWithRows(serviceTypes)
        }, () => {
            this.fetchData(this.state.initialEnvelope).then(() => this.redrawMarkers(regionArea));
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
        const {regionArea} = this.state;
        this.setState({
            filteringView: false,
            markers: []
        });
        this.fetchData(this.state.initialEnvelope).then(() => this.redrawMarkers(regionArea));
    }

    onRefresh() {
        this.setState({refreshing: true});
        this.fetchData().then(() => {
            this.redrawMarkers(this.state.regionArea);
            this.setState({refreshing: false});
        });
    }

    _fitMap() {
        if (this.mapRef && this.state.markers.length > 0) {}
    }

    /** returns distance between two markers in meters */
    getDistanceBetweenMarkers(marker1, marker2) {

        Math.radians = function (degrees) {
            return degrees * Math.PI / 180;
        };
        const lat1 = marker1.latitude;
        const lon1 = marker1.longitude;
        const lat2 = marker2.latitude;
        const lon2 = marker2.longitude;

        const φ1 = lat1 * Math.PI / 180;
        const φ2 = lat2 * Math.PI / 180;
        const Δφ = (lat2 - lat1) * Math.PI / 180;
        const Δλ = (lon2 - lon1) * Math.PI / 180;

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    redrawMarkers(region) {
        const {theme} = this.props;
        let {markers, activeMarker} = this.state;

        let clusterRadius = region.longitudeDelta * R / 180 / 4;

        // sort markers by neighbourCount count

        for (i = 0; i < markers.length; i += 1) {
            let counter = 0;
            markers[i].neighbours = [];
            markers[i].hidden = false;
            for (j = 0; j < markers.length; j += 1) {
                if ((this.getDistanceBetweenMarkers(markers[i], markers[j]) < clusterRadius) && (i != j)) {
                    counter += 1;
                    markers[i].neighbours.push(markers[j]);
                }
            }
            markers[i].neighbourCount = counter;
        }
        markers.sort((a, b) => b.neighbourCount - a.neighbourCount);

        // do clustering

        markers.forEach((marker, i) => {
            if (!marker.hidden) {
                marker.neighbours.forEach((neighbour) => {
                    markers[markers.indexOf(neighbour)].hidden = true;
                });
            }
        });
        let markerElements = markers.map((marker, i) => (!marker.hidden &&
            <MapView.Marker
                coordinate={{
                    latitude: marker.latitude,
                    longitude: marker.longitude
                }}
                key={i}
                onPress={() => this.onMarkerPress(marker)}
            >
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: 48,
                        height: 48,
                        backgroundColor: (marker == activeMarker && Platform.OS === 'ios')
                            ? '#009440'
                            : themes.light.greenAccentColor,
                        borderColor: themes[theme].backgroundColor,
                        borderRadius: 10,
                        borderWidth: 1
                    }}
                >
                    {(marker.neighbourCount) ?
                        <Text
                            style={{
                                fontSize: 20,
                                color: themes.dark.textColor,
                                textAlign: 'center'
                            }}
                        >
                            {marker.neighbourCount + 1}
                        </Text> : marker.serviceType && (
                        <Icon
                            name={(marker.serviceType.vector_icon || '').trim()}
                            style={{
                                fontSize: 24,
                                color: themes.dark.textColor,
                                textAlign: 'center'
                            }}
                        />
                    )}
                </View>
            </MapView.Marker>
        ));
        this.setState({markerElements});
    }

    render() {
        const {theme, language, direction} = this.props;
        let {filteringView, loading, markers, markerElements, offline, activeMarker} = this.state;
        return (
            <View style={styles.container}>
                <MapView
                    initialRegion={this.state.initialEnvelope}
                    style={styles.flex}
                    showsUserLocation
                    showsMyLocationButton={false}
                    showsPointsOfInterest={false}
                    showsCompass={false}
                    rotateEnabled={false}
                    toolbarEnabled={false}
                    pitchEnabled={false}
                    ref={(r) => this.mapRef = r}
                    onRegionChangeComplete={(region) => this.redrawMarkers(region)}
                    onRegionChange={(region) => this.onRegionChange(region)}
                    onPress={() => Platform.OS != 'ios' && this.clearActiveMarker()}
                >
                    {markerElements}
                </MapView>
                {Platform.OS === 'ios' && (
                    <View style={{
                        position: 'absolute', top: 0, left: 0,
                        width, height: 20, backgroundColor: 'rgba(249, 245, 237, 1)'
                    }}
                    />
                )}
                {activeMarker && (
                    <ScrollView
                        ref={(ref) => this.activeMarkerScrollViewRef = ref}
                        style={[
                            {borderColor: themes[theme].darkerDividerColor},
                            getContainerColor(theme),
                            {position: 'absolute', left: 0, bottom: 0, width, borderTopWidth: 2},
                            {height: (height - ((Platform.Version >= 21 || Platform.OS === 'ios') ? 80 : 55)) / 2.5}
                        ]}
                    >
                        <MapPopup marker={activeMarker}/>
                    </ScrollView>
                )}
                {filteringView && (
                    <View
                        style={[
                            theme == 'dark' ? styles.searchBarContainerDark : styles.searchBarContainerLight, {
                                flex: 1,
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                paddingTop: isStatusBarTranslucent() ? 85 : 60,
                                width,
                                height
                            }
                        ]}
                    >
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
                                {I18n.t('FILTER_BY_CATEGORY').toUpperCase() }
                            </Text>
                        </View>
                        <View
                            style={[
                                styles.searchBarContainer,
                                {backgroundColor: theme == 'dark' ? styles.menuBackgroundColor : styles.dividerColor}
                            ]}
                        >
                            <Button
                                color="green"
                                icon="md-close"
                                text={I18n.t('CLEAR_FILTERS').toUpperCase()}
                                onPress={this.clearFilters.bind(this)}
                                buttonStyle={{height: 44, marginRight: 2}}
                                iconStyle={Platform.OS === 'ios' ? {top: 2} : {}}
                            />
                            <Button
                                color="green"
                                icon="md-funnel"
                                text={I18n.t('FILTER_SERVICES').toUpperCase()}
                                onPress={this.filterByTypes.bind(this)}
                                buttonStyle={{height: 44, marginLeft: 2}}
                            />
                        </View>
                        <ListView
                            dataSource={this.state.serviceTypeDataSource}
                            renderRow={(type) => this.renderServiceTypeRow(type)}
                            keyboardShouldPersistTaps
                            keyboardDismissMode="on-drag"
                            direction={this.props.direction}
                            style={{flex: 1}}
                        />
                    </View>
                )}
                <View
                    style={[
                        styles.row, {
                            position: 'absolute',
                            top: isStatusBarTranslucent() ? 25 : 0,
                            left: 0,
                            height: 60,
                            paddingHorizontal: 5,
                            width
                        }
                    ]}
                >
                    <SearchBar
                        theme={theme}
                        floating={!filteringView}
                        initialSearchText={this.props.searchCriteria}
                        searchFunction={(text) => this.filterByText(text)}
                        buttonOnPressAction={() => this.searchFilterButtonAction()}
                        drawerButton
                    />
                </View>
                {(markers.length == MAX_SERVICES && !filteringView) && (
                    <View
                        style={[
                            getElevation(),
                            getRowOrdering(direction), {
                                backgroundColor: theme == 'dark' ? themes.dark.toolbarColor : themes.light.backgroundColor,
                                position: 'absolute',
                                top: 46,
                                left: 0,
                                width: width - 10,
                                marginHorizontal: 5,
                                padding: 10,
                                borderRadius: 2
                            }]}
                    >
                        <View style={{
                            width: 36,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        >
                            <Icon
                                style={{
                                    color: theme == 'dark' ? themes.dark.lighterDividerColor : themes.light.darkerDividerColor,
                                    fontSize: 24
                                }}
                                name="md-warning"
                            />
                        </View>
                        <Text style={[
                            styles.flex,
                            {color: theme == 'dark' ? themes.dark.lighterDividerColor : themes.light.darkerDividerColor},
                            getFontFamily(language),
                            {textAlign: 'center'}
                        ]}
                        >
                            {I18n.t('TOO_MANY_RESULTS') }
                        </Text>
                    </View>
                )}
                {offline && (
                    <View
                        style={[
                            getElevation(),
                            getRowOrdering(direction), {
                                backgroundColor: theme == 'dark' ? themes.dark.toolbarColor : themes.light.backgroundColor,
                                position: 'absolute',
                                top: isStatusBarTranslucent() ? 85 : 60,
                                left: 0,
                                width: width - 10,
                                marginHorizontal: 5,
                                padding: 10,
                                borderRadius: 2
                            }]}
                    >
                        <View style={{
                            width: 36,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        >
                            <Icon
                                style={{
                                    color: theme == 'dark' ? themes.dark.lighterDividerColor : themes.light.darkerDividerColor,
                                    fontSize: 32
                                }}
                                name="md-warning"
                            />
                        </View>
                        <View style={styles.container}>
                            <Text style={[
                                styles.flex,
                                {color: theme == 'dark' ? themes.dark.lighterDividerColor : themes.light.darkerDividerColor},
                                getFontFamily(language),
                                {textAlign: 'center'}
                            ]}
                            >
                                {I18n.t('OFFLINE_MODE') }
                            </Text>
                            <View style={styles.flex}>
                                <Button
                                    color="green"
                                    text={I18n.t('TRY_TO_REFRESH').toUpperCase()}
                                    onPress={this.onRefresh.bind(this)}
                                    buttonStyle={{
                                        width: 200,
                                        height: 35,
                                        marginTop: 5,
                                        marginBottom: 5,
                                        alignSelf: 'center'
                                    }}
                                />
                            </View>
                        </View>
                    </View>
                )}
                {loading &&
                <LoadingOverlay
                    theme={theme}
                    height={height}
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
        language: state.language,
        theme: state.theme,
        direction: state.direction
    };
};

export default connect(mapStateToProps)(ServiceMap);

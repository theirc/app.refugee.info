import React, {Component, PropTypes} from 'react';
import {
    View,
    ListView,
    Dimensions,
    Platform,
    ScrollView,
    StyleSheet
} from 'react-native';
import MapView from 'react-native-maps';
import styles, {
    themes,
    getElevation,
    isStatusBarTranslucent
} from '../styles';
import I18n from '../constants/Messages';
import {connect} from 'react-redux';
import {
    MapPopup,
    SearchBar,
    LoadingOverlay,
    Icon,
    DirectionalText,
    ServiceCategoryListView,
    OfflineView
} from '../components';
import {Services} from '../data';
import {MAPBOX_TOKEN} from '../constants';
import {checkPlayServices} from '../utils/GooglePlayServices';

let Mapbox;
if (Platform.OS === 'android') {
    Mapbox = require('react-native-mapbox-gl');
    Mapbox.setAccessToken(MAPBOX_TOKEN);
}

const {width, height} = Dimensions.get('window');

const RADIUS_MULTIPLIER = 1.2;
const MAX_SERVICES = 50;
const R = 6371e3; // earth R in metres


class ServiceMap extends Component {

    static propTypes = {
        region: PropTypes.object,
        searchCriteria: PropTypes.string,
        serviceTypes: PropTypes.array
    };

    constructor(props) {
        super(props);
        this.state = {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1.id !== row2.id
            }),
            annotations: [],
            markers: [],
            filteringView: false,
            searchCriteria: '',
            initialEnvelope: null,
            loading: false,
            offline: false,
            refreshing: false,
            activeMarker: null,
            naiveAvailable: false
        };
        this.filterByTypes = this.filterByTypes.bind(this);
        this.clearFilters = this.clearFilters.bind(this);
        this.onRefresh = this.onRefresh.bind(this);
    }

    componentDidMount() {
        checkPlayServices().then((available) => {
            let nativeAvailable = (Platform.OS === 'ios' || available);
            this.setState({nativeAvailable});
            const {region, searchCriteria, serviceTypes} = this.props;
            let currentEnvelope = this.getInitialRegion(region);
            this.setState({
                initialEnvelope: currentEnvelope,
                searchCriteria,
                serviceTypes,
                regionArea: currentEnvelope
            }, () => {
                this.fetchData(currentEnvelope).then(() => {
                    this.redrawMarkers(currentEnvelope);
                });
            });
        });
    }

    getInitialRegion(region) {
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
        const {region} = this.props;
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
            serviceTypes.forEach((type) => {
                type.onPress = this.toggleServiceType.bind(this, type);
            });
        } else {
            serviceTypes = await serviceData.listServiceTypes();
            serviceTypes.forEach((type) => {
                type.active = false;
                type.onPress = this.toggleServiceType.bind(this, type);
            });
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

    filterByText(event) {
        const {regionArea} = this.state;
        this.setState({
            activeMarker: null
        });
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
        let {nativeAvailable} = this.state;
        if (nativeAvailable) {
            return this.redrawNativeMarkers(region);
        } else {
            return this.redrawMapboxMarkers(region);
        }
    }

    redrawNativeMarkers(region) {
        let {markers, activeMarker} = this.state;

        let clusterRadius = region.longitudeDelta * R / 180 / 4;

        // sort markers by neighbourCount count

        for (let i = 0; i < markers.length; i += 1) {
            let counter = 0;
            markers[i].neighbours = [];
            markers[i].hidden = false;
            for (let j = 0; j < markers.length; j += 1) {
                if ((this.getDistanceBetweenMarkers(markers[i], markers[j]) < clusterRadius) && (i != j)) {
                    counter += 1;
                    markers[i].neighbours.push(markers[j]);
                }
            }
            markers[i].neighbourCount = counter;
        }
        markers.sort((a, b) => b.neighbourCount - a.neighbourCount);

        // do clustering

        markers.forEach((marker) => {
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
                        borderColor: themes.light.backgroundColor,
                        borderRadius: 10,
                        borderWidth: 1
                    }}
                >
                    {(marker.neighbourCount) ?
                        <DirectionalText
                            style={{
                                fontSize: 20,
                                color: themes.dark.textColor,
                                textAlign: 'center'
                            }}
                        >
                            {marker.neighbourCount + 1}
                        </DirectionalText> : marker.serviceType && (
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

    redrawMapboxMarkers(region) {
        let {markers} = this.state;
        let clusterRadius = region.longitudeDelta * R / 180 / 4;
        // sort markers by neighbourCount count
        for (let i = 0; i < markers.length; i += 1) {
            let counter = 0;
            markers[i].neighbours = [];
            markers[i].hidden = false;
            for (let j = 0; j < markers.length; j += 1) {
                if ((this.getDistanceBetweenMarkers(markers[i], markers[j]) < clusterRadius) && (i != j)) {
                    counter += 1;
                    markers[i].neighbours.push(markers[j]);
                }
            }
            markers[i].neighbourCount = counter;
        }
        markers.sort((a, b) => b.neighbourCount - a.neighbourCount);
        // do clustering
        markers.forEach((marker) => {
            if (!marker.hidden) {
                marker.neighbours.forEach((neighbour) => {
                    markers[markers.indexOf(neighbour)].hidden = true;
                });
            }
        });
        let annotations = markers.map((marker, i) => (!marker.hidden &&
            {
                coordinates: [
                    marker.latitude,
                    marker.longitude
                ],
                type: 'point',
                id: `marker_${marker.service.id}`,
                markerIndex: i
            }
        )).filter((x) => x);
        this.setState({annotations});
    }

    renderMapView(nativeAvailable) {
        let {initialEnvelope, markerElements, markers} = this.state;
        if (!initialEnvelope) {
            return <View />;
        }
        if (nativeAvailable) {
            return (
                <MapView
                    initialRegion={this.state.initialEnvelope}
                    onPress={() => Platform.OS != 'ios' && this.clearActiveMarker()}
                    onRegionChange={(region) => this.onRegionChange(region)}
                    onRegionChangeComplete={(region) => this.redrawMarkers(region)}
                    pitchEnabled={false}
                    rotateEnabled={false}
                    showsCompass={false}
                    showsMyLocationButton={false}
                    showsPointsOfInterest={false}
                    showsUserLocation
                    style={styles.flex}
                    toolbarEnabled={false}
                >
                    {markerElements}
                </MapView>);
        } else {
            let latitudeMultiplier = initialEnvelope.latitude > 0 ? 1 : -1;
            let longitudeMultiplier = initialEnvelope.longitude > 0 ? 1 : -1;
            let latSW = initialEnvelope.latitude - (initialEnvelope.latitudeDelta * latitudeMultiplier);// - latSW == 0;
            let longSW = initialEnvelope.longitude - (initialEnvelope.longitudeDelta * longitudeMultiplier);
            let latNE = initialEnvelope.latitude + (initialEnvelope.latitudeDelta * latitudeMultiplier);
            let longNE = initialEnvelope.longitude + (initialEnvelope.longitudeDelta * longitudeMultiplier);
            return (
                <Mapbox.MapView
                    annotations={this.state.annotations}
                    initialCenterCoordinate={this.state.initialEnvelope}
                    initialZoomLevel={4}
                    onFinishLoadingMap={() => {
                        this._mapBoxLoaded = true;
                        this._mapBox.setVisibleCoordinateBounds(latSW, longSW, latNE, longNE);
                    }}
                    onOpenAnnotation={(m) => {
                        let markerIndex = this.state.annotations.find((a) => a.id == m.id).markerIndex;
                        let marker = markers[markerIndex];
                        this.onMarkerPress(marker);
                    }}
                    onRegionDidChange={(change) => {
                        if (!this._mapBoxLoaded) {
                            return;
                        }
                        this._mapBox.getBounds(bounds => {
                            let latitudeDelta = Math.abs(change.latitude - bounds[0]);
                            let longitudeDelta = Math.abs(change.longitude - bounds[1]);
                            let envelope = {
                                latitude: change.latitude,
                                longitude: change.longitude,
                                latitudeDelta,
                                longitudeDelta
                            };
                            this.onRegionChange(envelope);
                            this.redrawMarkers(envelope);
                        });
                    }}
                    ref={map => {
                        this._mapBox = map;
                    }}
                    rotateEnabled={false}
                    scrollEnabled
                    showsUserLocation
                    style={styles.flex}
                    zoomEnabled
                />
            );
        }
    }

    renderFilteringView() {
        const {filteringView, serviceTypeDataSource} = this.state;
        if (!filteringView) {
            return null;
        }
        return (
            <View style={[styles.searchBarContainerLight, componentStyles.filteringViewContainer]}>
                <View style={[styles.viewHeaderContainer, componentStyles.filteringViewHeader]}>
                    <DirectionalText style={[styles.viewHeaderText, styles.viewHeaderTextLight]}>
                        {I18n.t('FILTER_BY_CATEGORY').toUpperCase() }
                    </DirectionalText>
                </View>
                <ServiceCategoryListView
                    dataSource={serviceTypeDataSource}
                    onClear={this.clearFilters}
                    onFilter={this.filterByTypes}
                />
            </View>
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
                    offline={offline}
                    onRefresh={this.onRefresh}
                />
            </View>
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

    renderMaxServicesView() {
        const {markers, filteringView} = this.state;
        if (markers.length < MAX_SERVICES || filteringView) {
            return null;
        }
        return (
            <View style={[getElevation(), styles.row, componentStyles.maxServicesContainer]}>
                <View style={componentStyles.maxServicesIconContainer}>
                    <Icon
                        name="md-warning"
                        style={componentStyles.maxServicesIcon}
                    />
                </View>
                <DirectionalText style={[styles.flex, componentStyles.maxServicesText]}>
                    {I18n.t('TOO_MANY_RESULTS') }
                </DirectionalText>
            </View>
        );
    }

    renderActiveMarkerView() {
        const {activeMarker} = this.state;
        if (!activeMarker) {
            return null;
        }
        return (
            <ScrollView
                ref={(ref) => this.activeMarkerScrollViewRef = ref}
                style={[
                    {borderColor: themes.light.darkerDividerColor},
                    styles.containerLight,
                    {position: 'absolute', left: 0, bottom: 0, width, borderTopWidth: 2},
                    {height: (height - ((Platform.Version >= 21 || Platform.OS === 'ios') ? 80 : 55)) / 2.5}
                ]}
            >
                <MapPopup marker={activeMarker}/>
            </ScrollView>
        );
    }

    render() {
        const {nativeAvailable, loading} = this.state,
            mapView = this.renderMapView(nativeAvailable),
            filteringView = this.renderFilteringView(),
            loadingView = this.renderLoadingView(),
            offlineView = this.renderOfflineView(),
            maxServicesView = this.renderMaxServicesView(),
            activeMarkerView = this.renderActiveMarkerView();
        if (loading) {
            return (
                <View>
                    <View style={[styles.row, componentStyles.searchBarContainer]}>
                        <SearchBar
                            buttonOnPressAction={() => this.searchFilterButtonAction()}
                            drawerButton
                            floating={!filteringView}
                            initialSearchText={this.props.searchCriteria}
                            searchFunction={(text) => this.filterByText(text)}
                        />
                    </View>
                    {loadingView}
                    </View>
            );
        }
        return (
            <View style={{flex: 1}}>
                {mapView}
                {activeMarkerView}
                {filteringView}
                <View style={[styles.row, componentStyles.searchBarContainer]}>
                    <SearchBar
                        buttonOnPressAction={() => this.searchFilterButtonAction()}
                        drawerButton
                        floating={!filteringView}
                        initialSearchText={this.props.searchCriteria}
                        searchFunction={(text) => this.filterByText(text)}
                    />
                </View>
                {maxServicesView}
                {offlineView}
                {loadingView}
            </View>
        );

    }
}

const componentStyles = StyleSheet.create({
    filteringViewContainer: {
        flex: 1,
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: themes.light.lighterDividerColor,
        paddingTop: isStatusBarTranslucent() ? 85 : 60,
        width,
        height
    },
    filteringViewHeader: {
        backgroundColor: themes.light.lighterDividerColor,
        paddingTop: 10
    },
    searchBarContainer: {
        position: 'absolute',
        top: isStatusBarTranslucent() ? 25 : 0,
        left: 0,
        height: 60,
        paddingHorizontal: 5,
        width
    },
    offlineViewContainer: {
        backgroundColor: themes.light.backgroundColor,
        position: 'absolute',
        top: isStatusBarTranslucent() ? 85 : 60,
        left: 0,
        width: width - 10,
        marginHorizontal: 5,
        borderRadius: 2
    },
    maxServicesContainer: {
        backgroundColor: themes.light.backgroundColor,
        position: 'absolute',
        top: isStatusBarTranslucent() ? 85 : 60,
        left: 0,
        width: width - 10,
        marginHorizontal: 5,
        padding: 10,
        borderRadius: 2
    },
    maxServicesIconContainer: {
        width: 36,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    maxServicesIcon: {
        color: themes.light.darkerDividerColor,
        fontSize: 24
    },
    maxServicesText: {
        color: themes.light.darkerDividerColor,
        textAlign: 'center'
    }
});

const mapStateToProps = (state) => {
    return {
        country: state.country,
        region: state.region,
        language: state.language
    };
};

export default connect(mapStateToProps)(ServiceMap);

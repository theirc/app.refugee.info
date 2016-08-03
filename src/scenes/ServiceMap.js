import React, {Component, PropTypes} from 'react';
import {
    View,
    ListView,
    StyleSheet,
    AsyncStorage,
    Image,
    Text,
    Dimensions,
    Platform,
    LayoutAnimation
} from 'react-native';
import MapView from 'react-native-maps';
import styles, {
    themes,
    getTextAlign,
    getFontFamily,
    getRowOrdering,
    getElevation,
    getContainerColor
} from '../styles';
import I18n from '../constants/Messages';
import ServiceCommons from '../utils/ServiceCommons';
import {connect} from 'react-redux';
import {
    MapPopup,
    Button,
    SearchBar,
    SearchFilterButton,
    SelectableListItem,
    LoadingOverlay,
    Icon,
    OfflineView
} from '../components';
import {Regions, Services} from '../data';

var _ = require('underscore');
var {width, height} = Dimensions.get('window');

const RADIUS_MULTIPLIER = 1.2;
const MAX_SERVICES = 50;
const R = 6371e3; // earth R in metres

class ServiceMap extends Component {
    static smallHeader = true;

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
        if (props.hasOwnProperty('savedState') && props.savedState) {
            this.state = props.savedState;
        } else {
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
        }
        this.serviceCommons = new ServiceCommons();
    }

    componentWillUpdate() {
        // animations on Android causes markers to stop rendering
        Platform.OS === 'ios' && LayoutAnimation.easeInEaseOut();
    }

    componentDidMount() {
        const {region, searchCriteria, serviceTypes} = this.props;
        let currentEnvelope = ServiceMap.getInitialRegion(region);
        this.setState({
            initialEnvelope: currentEnvelope,
            searchCriteria: searchCriteria,
            serviceTypes: serviceTypes,
            regionArea: currentEnvelope
        }, () => {
            this.fetchData(currentEnvelope).then(() => {
                this.redrawMarkers(currentEnvelope);
                this._fitMap()
            })
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
            (Platform.OS === 'ios') ? this.redrawMarkers(this.state.regionArea) : null
        })
    }

    clearActiveMarker() {
        this.setState({
            activeMarker: null
        })
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
            serviceTypes = this.state.serviceTypes
        } else {
            serviceTypes = await serviceData.listServiceTypes();
            for (let i = 0; i < serviceTypes.length; i++) {
                serviceTypes[i].active = false
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
                image={type.icon_url ? {uri: type.icon_url} : null}
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
                markers: [],
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
        })
    }

    clearFilters() {
        this.setState({markers: []});
        const {serviceTypes, regionArea} = this.state;
        for (let i = 0; i < serviceTypes.length; i++) {
            serviceTypes[i].active = false;
        }
        this.setState({
            serviceTypes: serviceTypes,
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
                types.push(serviceTypes[i].number)
            }
        }
        return types.join()
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
        /*
         setTimeout(() => {
         if (this.mapRef && this.state.markers.length > 0) {
         this.mapRef.fitToElements(true);
         }
         }, 200);
         */
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

        let clusterRadius = region.longitudeDelta * R / 180 / 5;

        // sort markers by neighbourCount count

        for (i = 0; i < markers.length; i += 1) {
            let counter = 0;
            markers[i].neighbours = [];
            markers[i].hidden = false;
            for (j = 0; j < markers.length; j += 1) {
                if ((this.getDistanceBetweenMarkers(markers[i], markers[j]) < clusterRadius) && (i != j)) {
                    counter += 1;
                    markers[i].neighbours.push(markers[j])
                }
            }
            markers[i].neighbourCount = counter;
        }
        markers.sort((a, b) => b.neighbourCount - a.neighbourCount);

        // do clustering

        markers.forEach((marker, i) => {
            if (!marker.hidden) {
                marker.neighbours.forEach((neighbour) => {
                    markers[markers.indexOf(neighbour)].hidden = true
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
                calloutOffset={{x: 0, y: 10}}
                onPress={() => this.onMarkerPress(marker)}
            >
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: 36,
                        height: 36,
                        backgroundColor: (marker == activeMarker) ? '#009440' : themes.light.greenAccentColor,
                        borderColor: themes[theme].backgroundColor,
                        borderRadius: 10,
                        borderWidth: 1
                    }}
                >
                    {(marker.neighbourCount) ?
                        <Text
                            style={{
                                fontSize: 18,
                                color: themes.dark.textColor,
                                textAlign: 'center',
                            }}
                        >
                            {marker.neighbourCount + 1}
                        </Text> : marker.serviceType && (
                        <Icon
                            name={(marker.serviceType.vector_icon || '').trim()}
                            style={{
                                fontSize: 22,
                                width: 24,
                                height: 24,
                                color: themes.dark.textColor,
                                textAlign: 'center',
                            }}
                        />
                    )}
                </View>
            </MapView.Marker>
        ));
        this.setState({markerElements})
    }

    render() {
        const {theme, language, direction} = this.props;
        let {filteringView, loading, markers, markerElements, offline, activeMarker} = this.state;
        return (
            <View style={styles.container}>
                <MapView
                    initialRegion={this.state.initialEnvelope}
                    style={styles.flex}
                    showsUserLocation={true}
                    showsMyLocationButton={false}
                    showsPointsOfInterest={false}
                    showsCompass={false}
                    ref={(r) => this.mapRef = r}
                    onRegionChangeComplete={(region) => this.redrawMarkers(region)}
                    onRegionChange={(region) => this.onRegionChange(region)}
                    onPress={() => Platform.OS != 'ios' && this.clearActiveMarker()}
                >
                    {markerElements}
                </MapView>
                {activeMarker && (
                    <View
                        style={[
                            {borderColor: themes[theme].darkerDividerColor},
                            getContainerColor(theme),
                            {position: 'absolute', left: 0, bottom: 0, width: width, borderTopWidth: 2},
                            {height: (height - ((Platform.Version >= 21 || Platform.OS === 'ios') ? 80 : 55)) / 2.5}
                        ]}
                    >
                        <MapPopup marker={activeMarker}/>
                    </View>
                )}
                <View
                    style={[
                        styles.row, {
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            height: 46,
                            width: width
                        }
                    ]}
                >
                    <SearchBar
                        theme={theme}
                        floating={!filteringView}
                        initialSearchText={this.props.searchCriteria}
                        searchFunction={(text) => this.filterByText(text) }
                    />
                    <SearchFilterButton
                        theme={theme}
                        floating={!filteringView}
                        onPressAction={() => this.searchFilterButtonAction() }
                        active={filteringView}
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
                            }]}>
                        <View style={{
                            width: 36,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
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
                        ]}>
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
                                top: 46,
                                left: 0,
                                width: width - 10,
                                marginHorizontal: 5,
                                padding: 10,
                                borderRadius: 2
                            }]}>
                        <View style={{
                            width: 36,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
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
                            ]}>
                                {I18n.t('OFFLINE_MODE') }
                            </Text>
                            <View style={styles.flex}>
                                <Button
                                    color="green"
                                    text={I18n.t('TRY_TO_REFRESH').toUpperCase() }
                                    onPress={this.onRefresh.bind(this) }
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
                {filteringView && (
                    <View
                        style={[
                            theme == 'dark' ? styles.searchBarContainerDark : styles.searchBarContainerLight, {
                                flex: 1,
                                position: 'absolute',
                                top: 46,
                                left: 0,
                                width: width,
                                height: height - 46 - 80
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
                                {backgroundColor: theme == 'dark' ? styles.menuBackgroundColor : styles.dividerColor},
                            ]}
                        >
                            <Button
                                color="green"
                                icon="md-close"
                                text={I18n.t('CLEAR_FILTERS').toUpperCase() }
                                onPress={this.clearFilters.bind(this) }
                                buttonStyle={{height: 33, marginRight: 2}}
                                iconStyle={Platform.OS === 'ios' ? {top: 2} : {}}
                            />
                            <Button
                                color="green"
                                icon="md-funnel"
                                text={I18n.t('FILTER_SERVICES').toUpperCase() }
                                onPress={this.filterByTypes.bind(this) }
                                buttonStyle={{height: 33, marginLeft: 2}}
                            />
                        </View>
                        <ListView
                            dataSource={this.state.serviceTypeDataSource}
                            renderRow={(type) => this.renderServiceTypeRow(type) }
                            keyboardShouldPersistTaps={true}
                            keyboardDismissMode="on-drag"
                            direction={this.props.direction}
                            style={{flex: 1}}
                        />
                    </View>
                )}
                {loading &&
                <LoadingOverlay
                    theme={theme}
                    height={height - ((Platform.Version >= 21 || Platform.OS === 'ios') ? 80 : 55) }
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

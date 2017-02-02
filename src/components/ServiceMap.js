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
    themes
} from '../styles';
import {
    MapPopup,
    Icon,
    DirectionalText
} from '../components';
import {MAPBOX_TOKEN} from '../constants';
import {checkPlayServices} from '../utils/GooglePlayServices';

let Mapbox;
if (Platform.OS === 'android') {
    Mapbox = require('react-native-mapbox-gl');
    Mapbox.setAccessToken(MAPBOX_TOKEN);
}

const {width, height} = Dimensions.get('window');

const RADIUS_MULTIPLIER = 1.2;
const R = 6371e3; // earth R in metres


class ServiceMap extends Component {

    static propTypes = {
        region: PropTypes.object,
        services: PropTypes.array
    };

    constructor(props) {
        super(props);
        this.state = {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1.id !== row2.id
            }),
            annotations: [],
            markers: [],
            initialEnvelope: null,
            activeMarker: null,
            nativeAvailable: false,
            region: props.region,
            services: props.services
        };
    }

    componentDidMount() {
        checkPlayServices().then((available) => {
            let nativeAvailable = (Platform.OS === 'ios' || available);
            this.setState({nativeAvailable});

            const {region, services} = this.props;
            let currentEnvelope = this.getInitialRegion(region);

            let markers = services.map(service => {
                return {
                    latitude: service.location.coordinates[1],
                    longitude: service.location.coordinates[0],
                    description: service.description,
                    title: service.name,
                    service
                };
            });
            this.setState({
                initialEnvelope: currentEnvelope,
                regionArea: currentEnvelope,
                markers,
                region,
                services
            });
            this.redrawMarkers(currentEnvelope);
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.services != this.props.services) {
            let markers = nextProps.services.map(service => {
                return {
                    latitude: service.location.coordinates[1],
                    longitude: service.location.coordinates[0],
                    description: service.description,
                    title: service.name,
                    service
                };
            });
            this.setState({markers});
            this.redrawMarkers(this.state.regionArea);
        }
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
                        </DirectionalText> : marker.service.type && (
                            <Icon
                                name={(marker.service.type.vector_icon || '').trim()}
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
            const latitudeMultiplier = initialEnvelope.latitude > 0 ? 1 : -1,
                longitudeMultiplier = initialEnvelope.longitude > 0 ? 1 : -1,
                latSW = initialEnvelope.latitude - (initialEnvelope.latitudeDelta * latitudeMultiplier),
                longSW = initialEnvelope.longitude - (initialEnvelope.longitudeDelta * longitudeMultiplier),
                latNE = initialEnvelope.latitude + (initialEnvelope.latitudeDelta * latitudeMultiplier),
                longNE = initialEnvelope.longitude + (initialEnvelope.longitudeDelta * longitudeMultiplier);
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

    renderActiveMarkerView() {
        const {activeMarker} = this.state;
        if (!activeMarker) {
            return null;
        }
        return (
            <ScrollView
                ref={(ref) => this.activeMarkerScrollViewRef = ref}
                style={[componentStyles.activeMarkerContainer, styles.containerLight]}
            >
                <MapPopup marker={activeMarker}/>
            </ScrollView>
        );
    }

    render() {
        const {nativeAvailable} = this.state;
        const mapView = this.renderMapView(nativeAvailable),
            activeMarkerView = this.renderActiveMarkerView();

        return (
            <View style={styles.flex}>
                {mapView}
                {activeMarkerView}
            </View>
        );

    }
}

const componentStyles = StyleSheet.create({
    activeMarkerContainer: {
        borderColor: themes.light.darkerDividerColor,
        position: 'absolute',
        left: 0,
        bottom: 0,
        width,
        borderTopWidth: 2,
        height: (height - ((Platform.Version >= 21 || Platform.OS === 'ios') ? 80 : 55)) / 2.5
    }
});


export default ServiceMap;

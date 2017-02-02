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
import styles, {themes} from '../styles';
import {MapPopup, Icon} from '../components';
import {MAPBOX_TOKEN} from '../constants';
import {checkPlayServices} from '../utils/GooglePlayServices';

let Mapbox;
if (Platform.OS === 'android') {
    Mapbox = require('react-native-mapbox-gl');
    Mapbox.setAccessToken(MAPBOX_TOKEN);
}

const {width, height} = Dimensions.get('window');

const RADIUS_MULTIPLIER = 1.2;


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

            this.setState({
                initialEnvelope: currentEnvelope,
                regionArea: currentEnvelope,
                region,
                services
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

    renderMapView(nativeAvailable) {
        let {initialEnvelope, activeMarker} = this.state;
        const {services} = this.props;
        if (!initialEnvelope) {
            return <View />;
        }
        if (nativeAvailable) {
            return (
                <MapView
                    initialRegion={this.state.initialEnvelope}
                    onPress={() => Platform.OS != 'ios' && this.clearActiveMarker()}
                    onRegionChange={(region) => this.onRegionChange(region)}
                    pitchEnabled={false}
                    rotateEnabled={false}
                    showsCompass={false}
                    showsMyLocationButton={false}
                    showsPointsOfInterest={false}
                    showsUserLocation
                    style={styles.flex}
                    toolbarEnabled={false}
                >
                    {services.map((service, i) => !service.hidden &&
                        <MapView.Marker
                            coordinate={{
                                latitude: service.location.coordinates[1],
                                longitude: service.location.coordinates[0]
                            }}
                            key={i}
                            onPress={() => this.onMarkerPress(service)}
                        >
                            <View
                                style={[
                                    componentStyles.marker,
                                    service == activeMarker && Platform.OS === 'ios' && {backgroundColor: '#009440'}
                                ]}
                            >
                                {service.type && (
                                    <Icon
                                        name={(service.type.vector_icon || '').trim()}
                                        style={componentStyles.markerIcon}
                                    />
                                )}
                            </View>
                        </MapView.Marker>
                    )}
                </MapView>);
        } else {
            const latitudeMultiplier = initialEnvelope.latitude > 0 ? 1 : -1,
                longitudeMultiplier = initialEnvelope.longitude > 0 ? 1 : -1,
                latSW = initialEnvelope.latitude - (initialEnvelope.latitudeDelta * latitudeMultiplier),
                longSW = initialEnvelope.longitude - (initialEnvelope.longitudeDelta * longitudeMultiplier),
                latNE = initialEnvelope.latitude + (initialEnvelope.latitudeDelta * latitudeMultiplier),
                longNE = initialEnvelope.longitude + (initialEnvelope.longitudeDelta * longitudeMultiplier),
                annotations = services.map((service, i) => (!service.hidden && {
                    coordinates: [
                        service.location.coordinates[1],
                        service.location.coordinates[0]
                    ],
                    type: 'point',
                    id: `marker_${service.id}`,
                    markerIndex: i
                })).filter((x) => x);
            return (
                <Mapbox.MapView
                    annotations={annotations}
                    initialCenterCoordinate={this.state.initialEnvelope}
                    initialZoomLevel={4}
                    onFinishLoadingMap={() => {
                        this._mapBoxLoaded = true;
                        this._mapBox.setVisibleCoordinateBounds(latSW, longSW, latNE, longNE);
                    }}
                    onOpenAnnotation={(m) => {
                        let markerIndex = annotations.find((a) => a.id == m.id).markerIndex;
                        let marker = services[markerIndex];
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
    marker: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: 48,
        height: 48,
        backgroundColor: themes.light.greenAccentColor,
        borderColor: themes.light.backgroundColor,
        borderRadius: 10,
        borderWidth: 1
    },
    markerIcon: {
        fontSize: 24,
        color: themes.dark.textColor,
        textAlign: 'center'
    },
    activeMarkerContainer: {
        borderColor: themes.light.darkerDividerColor,
        position: 'absolute',
        left: 0,
        bottom: 0,
        width,
        borderTopWidth: 2,
        height: (height - ((Platform.Version >= 21 || Platform.OS === 'ios') ? 80 : 55)) / 3
    }
});


export default ServiceMap;

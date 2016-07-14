import React, {Component, PropTypes} from 'react';
import {
    View,
    ListView,
    StyleSheet,
    AsyncStorage,
    Image,
    Text,
    Dimensions
} from 'react-native';
import MapView from 'react-native-maps';
import styles, {themes} from '../styles';
import I18n from '../constants/Messages';
import ServiceCommons from '../utils/ServiceCommons';
import {connect} from 'react-redux';
import {MapPopup, Button} from '../components';
import {Regions, Services} from '../data';

var _ = require('underscore');
var {width, height} = Dimensions.get('window');

const RADIUS_MULTIPLIER = 1.2;
const RADIUS = 0.01;

class ServiceMap extends Component {

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

    timeout = null;
    markers = [];

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
                iconsLoaded: false,
                markers: [],
                offline: false,
                refreshing: false,
                mapMoved: false,
                lastSync: null
            };
        }
        this.icons = {};
        this.serviceCommons = new ServiceCommons();
    }

    componentDidMount() {
        const {region, searchCriteria} = this.props;
        let currentEnvelope = ServiceMap.getInitialRegion(region);
        this.setState({ intialEnvelope: currentEnvelope });
        if (!this.state.loaded) {
            this.fetchData(currentEnvelope, searchCriteria).done();
        }
    }

    onCalloutPress(marker) {
        let service = marker.service;
        let location = this.state.locations.find(function (loc) {
            return loc.id == service.region;
        });
        let serviceType = this.state.serviceTypes.find(function (type) {
            return type.url == service.type;
        });
        const {navigator} = this.context;
        navigator.forward(null, null, { service, location, serviceType }, this.state);
    }

    onRegionChange(region) {
        if (this.state.loaded) {
        
        this.setState({
            envelope: region,
            mapMoved: true,
        });
        }
        if (this.timeout) {
            // clearTimeout(this.timeout);
        }
        setTimeout(() => {
            // this.timeout = this.fetchData(region).done();
        }, 200);
    }

    onLoadEnd(iconUrl) {
        //TODO Find better way to make sure that images are rendered in marker.
        this.icons[iconUrl] = true;
        if (Object.values(this.icons).filter((x) => !x).length === 0 && !this.state.iconsLoaded) {
            this.setState({
                iconsLoaded: true
            });
        }
    }


    async fetchData(envelope = {}, criteria = "") {
        // the region comes from the state now
        const {region} = this.props;
        const regionData = new Regions(this.props);
        const serviceData = new Services(this.props);


        let currentEnvelope = envelope;
        if (!region) {
            this.setState({
                loaded: true
            });
            return;
        }

        try {
            let serviceTypes = await serviceData.listServiceTypes();
            let serviceResult = await serviceData.pageServices(
                region.slug,
                currentEnvelope,
                criteria,
                1,
                50
            );
            let newServices = serviceResult.results;
            let services = (this.state.services || []).concat(newServices);

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
                    icon_url: serviceType.icon_base64,
                    service
                };
            });
            this.setState({
                loaded: true,
                mapMoved: false,
                serviceTypes,
                locations: [region],
                searchCriteria: criteria,
                markers,
                region,
                services
            });
        } catch (e) {
            console.log(e);

            this.setState({
                offline: true
            });
        }
    }

    render() {
        const {theme} = this.props;
        this.markers = this.state.markers.map(() => null);
        return (
            <View style={styles.container}>
                <MapView
                    initialRegion={this.state.intialEnvelope}
                    style={styles.flex}
                    onRegionChange={(e) => this.onRegionChange(e) }
                    showsUserLocation={true}
                    >
                    {this.state.markers.map((marker, i) => (
                        <MapView.Marker
                            coordinate={{
                                latitude: marker.latitude,
                                longitude: marker.longitude
                            }}
                            description={marker.description}
                            key={i}
                            ref={(r) => this.markers[i] = r}
                            onCalloutPress={() => this.onCalloutPress(marker) }
                            title={marker.title}
                            >
                            <View>
                                <Image
                                    source={{ uri: marker.icon_url }}
                                    style={styles.mapIcon}
                                    />
                            </View>
                            <MapView.Callout tooltip={true} style={[{ width: width - 50 }]}>
                                <MapPopup marker={marker} />
                            </MapView.Callout>
                        </MapView.Marker>
                    )) }
                </MapView>
                {this.state.mapMoved &&
                    <View style={[localStyles.refreshButton, { backgroundColor: themes[theme].backgroundColor}]}>
                        <Button
                            color="green"
                            icon="md-refresh"
                            text={I18n.t('RELOAD_MAP') }
                            onPress={() => this.fetchData(this.state.currentEnvelope) }
                            style={{ flex: 1, margin: 0 }}
                            buttonStyle={{ height: 40, flex: 1 }}
                            />
                    </View>
                }
            </View>
        )
    }

}

const localStyles = StyleSheet.create({
    refreshButton: {
        position: 'absolute',
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5,
        bottom: 10,
        width: width - 20,
        height: 50,
        margin: 10
    }
});

const mapStateToProps = (state) => {
    return {
        country: state.country,
        region: state.region,
        theme: state.theme,
        direction: state.direction
    };
};

export default connect(mapStateToProps)(ServiceMap);

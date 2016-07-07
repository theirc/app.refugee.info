import React, {Component, PropTypes} from 'react';
import {
    View,
    ListView,
    StyleSheet,
    AsyncStorage,
    Image,
    Text,
} from 'react-native';
import MapView from 'react-native-maps';
import ApiClient from '../utils/ApiClient';
import styles from '../styles';
import I18n from '../constants/Messages';
import ServiceCommons from '../utils/ServiceCommons';
import OfflineView from '../components/OfflineView';
import {connect} from 'react-redux';
import {MapPopup} from '../components';
import {Regions, Services} from '../data';

var _ = require('underscore');

const RADIUS_MULTIPLIER = 1.2;
const RADIUS = 0.01;

class ServiceMap extends Component {

    static propTypes = {
        services: React.PropTypes.array
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

    constructor(props) {
        super(props);

        if (props.hasOwnProperty('savedState') && props.savedState) {
            this.state = props.savedState;
        } else {
            this.state = {
                dataSource: new ListView.DataSource({
                    rowHasChanged: (row1, row2) => row1.id !== row2.id
                }),
                loaded: true,
                iconsLoaded: false,
                markers: [],
                offline: false,
                refreshing: false,
                lastSync: null
            };
        }
        this.icons = {};
        this.serviceCommons = new ServiceCommons();
    }

    componentDidMount() {
        this.apiClient = new ApiClient(this.context, this.props);
        const {region} = this.props;

        let currentEnvelope = ServiceMap.getInitialRegion(region);
        this.setState({ intialEnvelope: currentEnvelope });
        
        if (!this.state.loaded) {
            if (this.timeout) {
                clearTimeout(this.timeout);
            }
            this.timeout = setTimeout(() => {
                 this.fetchData().done();
            }, 200);
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
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
        setTimeout(() => {
            this.timeout = this.fetchData(region).done();
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
        const regionData = new Regions(this.apiClient);
        const serviceData = new Services(this.apiClient);

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
                criteria
            );
            let newServices = serviceResult.results;
            let services = (this.state.services || []).concat(newServices);

            services = _.uniq(services, false, (s) => s.id);

            console.log(serviceTypes)

            let markers = services.map(service => {
                let location = service.location.match(/[\d\.]+/g);
                let serviceType = serviceTypes.find(function (type) {
                    return type.url == service.type;
                });
                return {
                    latitude: parseFloat(location[2]),
                    longitude: parseFloat(location[1]),
                    description: service.description,
                    title: service.name,
                    icon_url: serviceType.icon_base64,
                    service
                };
            });

            this.setState({
                loaded: true,
                serviceTypes,
                locations: [region],
                searchCriteria: criteria,
                markers,
                region,
                services,
            });
        } catch (e) {
            console.log(e);

            this.setState({
                offline: true
            });
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <MapView
                    onRegionChangeComplete={(region) => this.onRegionChange(region) }
                    initialRegion={this.state.intialEnvelope}
                    style={styles.flex}
                    >
                    {this.state.markers.map((marker, i) => (
                        <MapView.Marker
                            coordinate={{
                                latitude: marker.latitude,
                                longitude: marker.longitude
                            }}
                            description={marker.description}
                            key={i}
                            onCalloutPress={() => this.onCalloutPress(marker) }
                            title={marker.title}
                            >
                            <View>
                                <Image
                                    source={{ uri: marker.icon_url }}
                                    style={styles.mapIcon}
                                    />
                            </View>
                            <MapView.Callout style={styles.mapPopupContainer}>
                                <MapPopup
                                    marker={marker}
                                    direction={this.props.direction}
                                    />
                            </MapView.Callout>
                        </MapView.Marker>
                    )) }
                </MapView>
            </View>
        )
    }

}


const mapStateToProps = (state) => {
    return {
        country: state.country,
        region: state.region,
        theme: state.theme.theme,
        direction: state.direction
    };
};

export default connect(mapStateToProps)(ServiceMap);

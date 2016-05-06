import React, { Component } from 'react';
import {
    PropTypes,
    View,
    ListView,
    StyleSheet,
    AsyncStorage,
    Image
} from 'react-native';
import MapView from 'react-native-maps';
import Spinner from 'react-native-loading-spinner-overlay';

import ApiClient from '../utils/ApiClient';

const RADIUS = 10;

let styles = StyleSheet.create({
    container: {
        flex: 1
    },
    map: {
        flex: 1
    },
    icon: {
        width: 32,
        height: 32
    }
});

export default class ServiceMap extends Component {

    static contextTypes = {
        navigator: PropTypes.object.isRequired
    };

    static renderLoadingView() {
        return (
            <View style={{ flex: 1 }}>
                <Spinner
                    overlayColor="#EEE"
                    visible
                />
            </View>
        );
    }

    static getInitialRegion(markers) {
        if (markers.length == 0) {
            return null;
        }
        let lats = markers.map(marker => marker.latitude),
            longs = markers.map(marker => marker.longitude);
        let minLat = Math.min.apply(null, lats), minLong = Math.min.apply(null, longs);
        let maxLat = Math.max.apply(null, lats), maxLong = Math.max.apply(null, longs);

        return {
            latitude: (minLat + maxLat) / 2,
            longitude: (minLong + maxLong) / 2,
            latitudeDelta: maxLat - minLat + RADIUS,
            longitudeDelta: maxLong - minLong + RADIUS
        };
    }

    constructor(props) {
        super(props);

        if (props.hasOwnProperty('savedState') && props.savedState) {
            this.state = props.savedState;
        } else {
            this.state = {
                dataSource: new ListView.DataSource({
                    rowHasChanged: (row1, row2) => row1 !== row2
                }),
                loaded: false
            };
        }
        this.apiClient = new ApiClient();
    }

    componentDidMount() {
        if (!this.state.loaded) {
            this.fetchData().done();
        }
    }

    async fetchData() {
        let region = JSON.parse(await AsyncStorage.getItem('region'));
        if (!region) {
            this.setState({
                loaded: true
            });
            return;
        }
        let serviceTypes = await this.apiClient.getServiceTypes();
        let services = await this.apiClient.getServices(region.slug);
        let locations = await this.apiClient.getLocations(region.id);
        locations.push(region);
        let markers = services.map(service => {
            let location = service.location.match(/[\d\.]+/g);
            let serviceType = serviceTypes.find(function(type) {
                return type.url == service.type;
            });
            return {
                latitude: parseFloat(location[1]),
                longitude: parseFloat(location[0]),
                description: service.description,
                title: service.name,
                icon_url: serviceType.icon_url,
                service
            };
        });
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(services),
            loaded: true,
            region: ServiceMap.getInitialRegion(markers),
            markers,
            serviceTypes,
            locations,
            services
        });
    }

    onCalloutPress(marker) {
        let service = marker.service;
        let location = this.state.locations.find(function(loc) {
            return loc.id == service.region;
        });
        let serviceType = this.state.serviceTypes.find(function(type) {
            return type.url == service.type;
        });
        const { navigator } = this.context;
        navigator.forward(null, null, {service, location, serviceType}, this.state);
    }

    onRegionChange(region) {
        this.setState({ region });
    }

    render() {
        if (!this.state.loaded) {
            return ServiceMap.renderLoadingView();
        }
        return (
            <View style={styles.container}>
                <MapView
                    onRegionChangeComplete={(region) => this.onRegionChange(region)}
                    region={this.state.region}
                    style={styles.map}
                >
                    {this.state.markers && this.state.markers.map((marker, i) => (
                        <MapView.Marker
                            coordinate={{
                                latitude: marker.latitude,
                                longitude: marker.longitude
                            }}
                            description={marker.description}
                            key={i}
                            onCalloutPress={() => this.onCalloutPress(marker)}
                            title={marker.title}
                        >
                            {!!marker.icon_url &&
                                <View>
                                    <Image
                                        source={{uri: marker.icon_url}}
                                        style={styles.icon}
                                    />
                                </View>
                            }
                        </MapView.Marker>
                    ))}
                </MapView>
            </View>
        );
    }

}

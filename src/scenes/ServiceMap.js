import React, {
    Component,
    PropTypes,
    View,
    ListView,
    StyleSheet,
    AsyncStorage
} from 'react-native';
import MapView from 'react-native-maps';

import ApiClient from '../utils/ApiClient';

const RADIUS = 10;

let styles = StyleSheet.create({
    container: {
        flex: 1
    },
    map: {
        flex: 1
    }
});

export default class ServiceMap extends Component {

    static contextTypes = {
        navigator: PropTypes.object.isRequired
    };

    static getInitialRegion(markers) {
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

        this.state = {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2
            }),
            loaded: false
        };
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
            this.setState({loaded: true});
            return;
        }
        let serviceTypes = await this.apiClient.getServiceTypes();
        let services = await this.apiClient.getServices(region.slug);
        let markers = services.map(service => {
            let latlng = service.location.match(/[\d\.]+/g);
            return {
                latitude: parseFloat(latlng[0]),
                longitude: parseFloat(latlng[1]),
                description: service.description,
                title: service.name
            }
        });
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(services),
            loaded: true,
            serviceTypes,
            region,
            markers
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <MapView
                    initialRegion={this.state.markers && ServiceMap.getInitialRegion(this.state.markers)}
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
                            title={marker.title}
                        />
                    ))}
                </MapView>
            </View>
        );
    }

}

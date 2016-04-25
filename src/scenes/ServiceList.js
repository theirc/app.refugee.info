import React, {
    Component,
    PropTypes,
    View,
    Text,
    ListView,
    StyleSheet,
    TouchableHighlight,
    AsyncStorage,
    Image
} from 'react-native';

import Messages from '../constants/Messages';

import { default as Icon } from 'react-native-vector-icons/FontAwesome';

import { default as _ } from 'lodash';

import ApiClient from '../utils/ApiClient';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column'
    },
    listViewContainer: {
        flex: 1,
        flexDirection: 'column'
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'column',
        padding: 15,
        backgroundColor: '#EEE'
    },
    header: {
        flex: 0,
        flexDirection: 'column',
        textAlign: 'center',
        textAlignVertical: 'center',
        padding: 10,
        backgroundColor: '#387ef5'
    }
});

export default class ServiceList extends Component {

    static contextTypes = {
        navigator: PropTypes.object.isRequired
    };

    static renderLoadingView() {
        return (
            <View>
                <Text>{Messages.LOADING_SERVICES}</Text>
            </View>
        );
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
        let serviceTypes = await this.apiClient.getServiceTypes();
        let services = await this.apiClient.getServices(region.slug);
        let locations = await this.apiClient.getLocations(region.id);
        locations.push(region);
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(services),
            loaded: true,
            serviceTypes,
            locations,
            region
        });
    }

    onClick(params) {
        const { navigator } = this.context;
        navigator.forward(null, null, params, this.state);
    }

    renderRow(row) {
        let location = _.find(this.state.locations, function(loc) {
            return loc.id == row.region;
        });
        let serviceType = _.find(this.state.serviceTypes, function(type) {
            return type.url == row.type;
        });
        let locationName = (location) ? location.name : '';
        let stars = [...Array(5)].map((x, i) => (
            <Icon
                color={(row.rating >= i + 1) ? "black" : "white"}
                key={i}
                name="star"
                size={12}
            />
          ));
        let rowContent = (
            <View>
                 <Image
                     source={{uri: serviceType.icon_url}}
                     style={styles.icon}
                 />
                <Text>{row.name}</Text>
                <Text>Rating: {stars}</Text>
                <Text>{locationName}</Text>
            </View>
        );
        return (
            <TouchableHighlight
                onPress={this.onClick.bind(this, {row, location, serviceType, rowContent})}
                style={styles.buttonContainer}
                underlayColor="white"
            >
                {rowContent}
            </TouchableHighlight>
        );
    }

    renderHeader() {
        return (<Text style={styles.header}>Latest services in {this.state.region.name}</Text>);
    }

    render() {
        if (!this.state.loaded) {
            return ServiceList.renderLoadingView();
        } else {
            return (
              <View style={styles.container}>
                  <ListView
                      dataSource={this.state.dataSource}
                      enableEmptySections
                      renderHeader={this.renderHeader.bind(this)}
                      renderRow={this.renderRow.bind(this)}
                      style={styles.listViewContainer}
                  />
              </View>
            )
        }
    }
}

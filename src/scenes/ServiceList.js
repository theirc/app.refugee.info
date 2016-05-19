import React, { Component } from 'react';
import {
    PropTypes,
    View,
    Text,
    ListView,
    StyleSheet,
    TouchableHighlight,
    AsyncStorage,
    TextInput
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { Subheader, Divider } from 'react-native-material-design';

import I18n from '../constants/Messages';
import ApiClient from '../utils/ApiClient';
import ServiceCommons from '../utils/ServiceCommons';
import MapButton from '../components/MapButton';
import AppStore from '../stores/AppStore';


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
        padding: 15
    },
    header: {
        flex: 0,
        flexDirection: 'column',
        textAlign: 'center',
        textAlignVertical: 'center',
        padding: 10
    }
});

export default class ServiceList extends Component {

    static contextTypes = {
        navigator: PropTypes.object.isRequired
    };

    static propTypes = {
        savedState: React.PropTypes.object //eslint-disable-line react/forbid-prop-types
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
        this.serviceCommons = new ServiceCommons();

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
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(services),
            loaded: true,
            serviceTypes,
            locations,
            region,
            services
        });
    }

    onClick(params) {
        const { navigator } = this.context;
        navigator.forward(null, null, params, this.state);
    }

    renderRow(service) {
        let location = this.state.locations.find(function(loc) {
            return loc.id == service.region;
        });
        let serviceType = this.state.serviceTypes.find(function(type) {
            return type.url == service.type;
        });
        let rowContent = this.serviceCommons.renderRowContent(service, serviceType, location);
        var theme = AppStore.getState().theme;
        return (
            <View>
                <TouchableHighlight
                    onPress={() => this.onClick({service, serviceType, location})}
                    style={styles.buttonContainer}
                    underlayColor= {theme == 'light' ? 'rgba(72, 133, 237, 0.2)' : 'rgba(0, 0, 0, 0.1)'}
                >
                    {rowContent}
                </TouchableHighlight>
                <Divider />
            </View>
        );
    }

    _onChangeText(text) {
        const services = this.state.services;
        const filteredServices = services.filter((x) => x.name.toLowerCase().indexOf(text.toLowerCase()) !== -1);
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(filteredServices)
        });
    }

    renderHeader() {
        return (
            <View>
                <Text style={styles.header}>{I18n.t('LATEST_SERVICES')} {this.state.region.name}</Text>
                <Divider/>
                <TextInput
                    onChangeText={(text) => this._onChangeText(text)}
                    placeholder={I18n.t('SEARCH')}
                />
                <Divider/>
            </View>
        );
    }

    render() {
        if (!this.state.loaded) {
            return ServiceList.renderLoadingView();
        }
        else if (!this.state.region) {
            return <Text>{I18n.t('CHOOSE_REGION')}</Text>
        }
        return (
            <View style={styles.container}>
                <ListView
                    dataSource={this.state.dataSource}
                    enableEmptySections
                    renderHeader={() => this.renderHeader()}
                    renderRow={(service) => this.renderRow(service)}
                    style={styles.listViewContainer}
                />
                <MapButton />
            </View>
        );
    }
}

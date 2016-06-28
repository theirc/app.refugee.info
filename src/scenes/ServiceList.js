import React, { Component, PropTypes } from 'react';
import {
    View,
    Text,
    ListView,
    RefreshControl,
    StyleSheet,
    TouchableHighlight,
    AsyncStorage,
    TextInput
} from 'react-native';
import { Divider } from 'react-native-material-design';
import I18n from '../constants/Messages';
import ApiClient from '../utils/ApiClient';
import ServiceCommons from '../utils/ServiceCommons';
import MapButton from '../components/MapButton';
import OfflineView from '../components/OfflineView';
import { connect } from 'react-redux';

import styles from '../styles';

export default class ServiceList extends Component {

    static contextTypes = {
        navigator: PropTypes.object.isRequired
    };

    static propTypes = {
        savedState: React.PropTypes.object
    };

    constructor(props) {
        super(props);

        if (props.hasOwnProperty('savedState') && props.savedState) {
            this.state = props.savedState;
        } else {
            this.state = {
                dataSource: new ListView.DataSource({
                    rowHasChanged: (row1, row2) => row1 !== row2
                }),
                loaded: false,
                refreshing: false,
                offline: false,
                lastSync: null
            };
        }
        this.serviceCommons = new ServiceCommons();
    }


    componentWillMount() {
        this.apiClient = new ApiClient(this.context, this.props);
        if (!this.state.loaded) {
            this.fetchData().done();
        }
    }

    async fetchData() {
        // the region comes from the state now
        const { region } = this.props;
        if (!region) {
            this.setState({
                loaded: true
            });
            return;
        }
        let serviceTypes, services, locations;
        try {
            serviceTypes = await this.apiClient.getServiceTypes(true);
            services = await this.apiClient.getServices(region.slug, true);
            locations = await this.apiClient.getLocations(region.id, true);
            await AsyncStorage.setItem('serviceTypesCache', JSON.stringify(serviceTypes));
            await AsyncStorage.setItem('servicesCache', JSON.stringify(services));
            await AsyncStorage.setItem('locationsCache', JSON.stringify(locations));
            await AsyncStorage.setItem('lastServicesSync', new Date().toISOString());
            this.setState({
                offline: false
            });
        }
        catch (e){
            this.setState({
                offline: true
            });
            serviceTypes = JSON.parse(await AsyncStorage.getItem('serviceTypesCache'));
            services = JSON.parse(await AsyncStorage.getItem('servicesCache'));
            locations = JSON.parse(await AsyncStorage.getItem('locationsCache'));
        }
        if (!services || !locations) {
            return;
        }
        locations.push(region);
        let lastSync = await AsyncStorage.getItem('lastServicesSync');
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(services),
            loaded: true,
            serviceTypes,
            locations,
            region,
            services,
            lastSync: Math.ceil(Math.abs(new Date() - new Date(lastSync)) / 60000)
        });
    }

    onRefresh(){
        this.setState({refreshing: true});
        this.fetchData().then(() => { this.setState({refreshing: false}); });
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
        let rowContent = this.serviceCommons.renderRowContent(service, serviceType, location, this.props.direction);
        const theme = this.props.theme;
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
            dataSource: this.state.dataSource.cloneWithRows(filteredServices),
            filteredServices: filteredServices
        });
    }

    renderHeader() {
        return (
            <View style={styles.stickyInputContainer}>
                <TextInput
                    onChangeText={(text) => this._onChangeText(text)}
                    placeholder={I18n.t('SEARCH')}
                    style={[styles.stickyInput, this.props.direction=='rtl' ? styles.alignRight : null]}
                    returnKeyType={'search'}
                    autoCapitalize="none"
                    autoCorrect={false}
                    clearButtonMode="always"
                />
            </View>
        );
    }

    render() {
        if (!this.state.region) {
            return (
                <View style={styles.stickyInputContainer}>
                    <TextInput
                        onChangeText={(text) => this._onChangeText(text)}
                        placeholder={I18n.t('SEARCH')}
                        style={[styles.stickyInput, this.props.direction=='rtl' ? styles.alignRight : null]}
                        returnKeyType={'search'}
                        autoCapitalize="none"
                        autoCorrect={false}
                        clearButtonMode="always"
                    />
                    <View style={styles.header}>
                        <Text style={styles.headerText}>{I18n.t('LOADING_SERVICES')}</Text>
                    </View>
                </View>
            )
        }
        return (
            <View style={styles.container}>
                <OfflineView
                    offline={this.state.offline}
                    onRefresh={this.onRefresh.bind(this)}
                    lastSync={this.state.lastSync}
                />
                <ListView
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this.onRefresh.bind(this)}
                        />
                    }
                    dataSource={this.state.dataSource}
                    enableEmptySections
                    renderSectionHeader={() => this.renderHeader()}
                    renderRow={(service) => this.renderRow(service)}
                    style={styles.listViewContainer}
                    keyboardShouldPersistTaps={true}
                    keyboardDismissMode="on-drag"
                    direction={this.props.direction}
                />
                <MapButton
                    direction={this.props.direction}
                    services={this.state.filteredServices}
                />
            </View>
        );
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

export default connect(mapStateToProps)(ServiceList);

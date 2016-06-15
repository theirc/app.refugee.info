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
import { connect } from 'react-redux';
import LoadingView from '../components/LoadingView';
import styles from '../styles';

export default class ServiceList extends Component {

    static contextTypes = {
        navigator: PropTypes.object.isRequired
    };

    static propTypes = {
        savedState: React.PropTypes.object //eslint-disable-line react/forbid-prop-types
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
                refreshing: false
            };
        }
        this.serviceCommons = new ServiceCommons();
    }


    componentDidMount() {
        this.apiClient = new ApiClient(this.context);
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
        if (!services || !locations) {
            return;
        }
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
        let rowContent = this.serviceCommons.renderRowContent(service, serviceType, location);
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
            dataSource: this.state.dataSource.cloneWithRows(filteredServices)
        });
    }

    renderHeader() {
        return (
            <View style={styles.stickyInputContainer}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>{I18n.t('LATEST_SERVICES')} {this.state.region.name}</Text>
                </View>
                <TextInput
                    onChangeText={(text) => this._onChangeText(text)}
                    placeholder={I18n.t('SEARCH')}
                    style={styles.stickyInput}
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
                    <View style={styles.header}>
                        <Text style={styles.headerText}>{I18n.t('LOADING_SERVICES')}</Text>
                    </View>
                    <TextInput
                        onChangeText={(text) => this._onChangeText(text)}
                        placeholder={I18n.t('SEARCH')}
                        style={styles.stickyInput}
                        returnKeyType={'search'}
                        autoCapitalize="none"
                        autoCorrect={false}
                        clearButtonMode="always"
                    />
                </View>
            )
        }
        return (
            <View style={styles.container}>
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
                />
                <MapButton />
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        theme: state.theme.theme
    };
};

export default connect(mapStateToProps)(ServiceList);

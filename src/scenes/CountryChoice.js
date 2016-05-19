import React, { Component, PropTypes } from 'react';
import { AsyncStorage, View, StyleSheet, Image  } from 'react-native';
import { connect } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';

import LocationListView from '../components/LocationListView';
import ApiClient from '../utils/ApiClient';
import I18n from '../constants/Messages';
import {getCountryFlag} from '../utils/helpers';

export default class CountryChoice extends Component {

    static contextTypes = {
        navigator: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            locations: []
        };
        this.apiClient = new ApiClient();
    }

    componentDidMount() {
        this.detectLocation();
    }

    async _getLocation(position, level) {
        const location = await this.apiClient.getLocationByPosition(position.coords.longitude, position.coords.latitude, level);
        if (location.length > 0) {
            const detectedLocation = location[0];
            detectedLocation.detected = true;
            detectedLocation.coords = position.coords;
            return detectedLocation;
        }
    }
    
    async _getCountryId(location) {
        const parent = await this.apiClient.getLocation(location.parent);
        if (parent.parent) {
            return await this.apiClient.getLocation(parent.parent);
        } else {
            return parent;
        }
        
    }

    async detectLocation() {
        const location = await AsyncStorage.getItem('region');
        if (location) {
            this.context.navigator.to('info');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async(position) => {
                const { dispatch } = this.props;
                let location = await this._getLocation(position, 3);
                if (location) {
                    location.country = await this._getCountryId(location);
                    dispatch({type: 'REGION_CHANGED', payload: location});
                    await AsyncStorage.setItem('region', JSON.stringify(location));
                    this.context.navigator.to('info');
                } else {
                    location = await this._getLocation(position, 1);
                    if (location) {
                        this.context.navigator.forward(null, '', {countryId: location.id}, this.state);
                    } else {
                        this._loadInitialState();
                    }
                }
            },
            (error) => {
                this._loadInitialState();
            }, {enableHighAccuracy: false, timeout: 4000, maximumAge: 1000}
        );
    }

    async _loadInitialState() {
        const locations = await this.apiClient.getRootLocations();
        this.setState({
            locations,
            loaded: true
        });
    }

    onPress(rowData) {
        const { navigator } = this.context;
        navigator.forward(null, '', {countryId: rowData.id}, this.state);
    }

    renderLoadingView() {
        return (
            <View style={styles.container}>
                <Spinner
                    overlayColor="#EEE"
                    visible
                />
            </View>
        );
    }

    render() {
        if (this.state.loaded) {
            return (
                <View style={styles.container}>
                    <Image
                        resizeMode={Image.resizeMode.stretch}
                        source={require('../assets/earthsmall.png')}
                        style={styles.icon}
                    />
                    <LocationListView
                        header={I18n.t('SELECT_COUNTRY')}
                        image={(countryName) => getCountryFlag(countryName)}
                        onPress={(rowData) => this.onPress(rowData)}
                        rows={this.state.locations}
                    />
                </View>
            );
        } else {
            return this.renderLoadingView();
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column'
    },
    icon: {
        flex: 0.33,
        height: null,
        width: null
    }
});

export default connect()(CountryChoice);

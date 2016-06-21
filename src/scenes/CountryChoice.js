import React, { Component, PropTypes } from 'react';
import { AsyncStorage, View, StyleSheet, Image } from 'react-native';
import { Button } from 'react-native-material-design';
import { connect } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';
import LocationListView from '../components/LocationListView';
import ApiClient from '../utils/ApiClient';
import I18n from '../constants/Messages';
import {getCountryFlag} from '../utils/helpers';
import styles from '../styles';

export default class CountryChoice extends Component {

    static contextTypes = {
        navigator: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            locations: []
        };
    }

    componentDidMount() {
        this.apiClient = new ApiClient(this.context);
        this._loadInitialState();
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
        navigator.geolocation.getCurrentPosition(
            async(position) => {
                const { dispatch } = this.props;
                let location = await this._getLocation(position, 3);
                if (location) {
                    location.country = await this._getCountryId(location);
                    dispatch({type: 'REGION_CHANGED', payload: location});
                    await AsyncStorage.setItem('region', JSON.stringify(location));

                    if(location.content && location.content.length == 1) {
                      this.context.navigator.to('infoDetails', location.content[0].title, {section: location.content[0].section})
                    } else {
                      this.context.navigator.to('info');
                    }
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
            }, {enableHighAccuracy: false, timeout: 5000, maximumAge: 1000}
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

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.containerBelowLogo}>
                    <LocationListView
                        header={I18n.t('SELECT_COUNTRY')}
                        image={(countryISO) => getCountryFlag(countryISO)}
                        onPress={(rowData) => this.onPress(rowData)}
                        rows={this.state.locations}
                    />
                    <Button
                        onPress={() => this.detectLocation()}
                        raised
                        text={I18n.t('DETECT_LOCATION')}
                    />
                </View>
            </View>
        );
    }
}

export default connect()(CountryChoice);

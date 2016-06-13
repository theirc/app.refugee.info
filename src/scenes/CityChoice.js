import React, { Component, PropTypes } from 'react';

import { AsyncStorage, View, StyleSheet, Image } from 'react-native';
import { connect } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';

import LocationListView from '../components/LocationListView';
import ApiClient from '../utils/ApiClient';
import I18n from '../constants/Messages';

const styles = require('../styles');

class CityChoice extends Component {

    static propTypes = {
        countryId: React.PropTypes.number.isRequired
    };

    static contextTypes = {
        navigator: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            cities: [],
            loaded: false
        };
    }

    componentDidMount() {
        this.apiClient = new ApiClient(this.context);
        this._loadInitialState();
    }

    async _loadInitialState() {
        let cities = [];

        const regions = await this.apiClient.getRegions(this.props.countryId);
        const children = await this.apiClient.getCities(this.props.countryId);
        cities = cities.concat(children);
        const promises = [];
        for (let region of regions) {
            promises.push(this.apiClient.getCities(region.id));
        }
        Promise.all(promises).then((citiesList) => {
            for (let _cities of citiesList) {
                cities = cities.concat(_cities);
            }
            this.setState({
                cities,
                loaded: true
            });
        });
    }

    async _onPress(city) {
        const { dispatch } = this.props;

        city.detected = false;
        city.coords = {};
        city.country = await this.apiClient.getLocation(this.props.countryId);
        dispatch({type: 'REGION_CHANGED', payload: city});
        await AsyncStorage.setItem('region', JSON.stringify(city));
        this.context.navigator.to('info');
    }

    render() {
        return (
            <View style={styles.container}>
                <Image
                    resizeMode={Image.resizeMode.cover}
                    source={require('../assets/earthsmall.png')}
                    style={styles.logo}
                />
                <View style={styles.containerBelowLogo}>
                    <LocationListView
                        loaded={this.state.loaded}
                        header={I18n.t('SELECT_LOCATION')}
                        onPress={(rowData) => this._onPress(rowData)}
                        rows={this.state.cities}
                    />
                </View>
            </View>
        );
    }
}

export default connect()(CityChoice);

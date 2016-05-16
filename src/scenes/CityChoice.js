import React, { Component, PropTypes } from 'react';

import { AsyncStorage, View, StyleSheet, Image } from 'react-native';
import { connect } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';

import LocationListView from '../components/LocationListView';
import ApiClient from '../utils/ApiClient';
import I18n from '../constants/Messages';


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
        this.apiClient = new ApiClient();
    }

    componentDidMount() {
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
        if (this.state.loaded) {
            return (
                <View style={styles.container}>
                    <Image
                        resizeMode={Image.resizeMode.stretch}
                        source={require('../graphics/earthsmall.png')}
                        style={styles.icon}
                    />
                    <LocationListView
                        header={I18n.t('SELECT_LOCATION')}
                        onPress={(rowData) => this._onPress(rowData)}
                        rows={this.state.cities}
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

export default connect()(CityChoice);

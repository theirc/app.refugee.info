import React, { Component } from 'react';
import {
    AsyncStorage,
    StyleSheet,
    PropTypes,
    View,
    TouchableHighlight,
    Text,
    Alert
} from 'react-native';

import RegionDrillDown from '../components/RegionDrillDown';

import ApiClient from '../utils/ApiClient';
import Messages from '../constants/Messages';

export default class Welcome extends Component {

    static contextTypes = {
        navigator: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            position: {},
            detecting: false,
            location: null,
            selectedCountry: null,
            selectedCity: null,
            countries: [],
            cities: [],
            loading: true
        };
        this.apiClient = new ApiClient();
    }

    async componentDidMount() {
        this.initialState();
    }

    async initialState() {
        let countries = await this.apiClient.getRootLocations();

        this.formatLocations(countries);
        let region = JSON.parse(await AsyncStorage.getItem('region'));
        const changes = {loading: false, countries};
        if (region) {
            changes['selectedCountry'] = region.countryId;
            await this._onCountryChange(region.countryId);
            if (region.countryId != region.id) {
                changes['selectedCity'] = region.id;
            }
        }
        this.setState(changes);
    }

    formatLocations(locations) {
        for (let location of locations) {
            location.name = location.name[0].toLocaleUpperCase() + location.name.slice(1);
        }

        locations.sort((x, y) => x.name.localeCompare(y.name));
    }

    async _onPress(region) {
        region.detected = false;
        region.coords = {};
        await AsyncStorage.setItem('region', JSON.stringify(region));
        this.context.navigator.to('info');
    }

    _onDetectLocationPress() {
        this.setState({detecting: true});
        navigator.geolocation.getCurrentPosition(
            async(position) => {
                const location = await this.apiClient.getLocationByPosition(position.coords.longitude, position.coords.latitude, 3);

                if (location.length > 0) {
                    const detectedLocation = location[0];
                    detectedLocation.detected = true;
                    detectedLocation.coords = position.coords;
                    await AsyncStorage.setItem('region', JSON.stringify(location[0]));
                    this.context.navigator.to('info');
                } else {
                    Alert.alert(Messages.CANT_FIND_LOCATION);
                    this.setState({detecting: false});
                }
            },
            (error) => {
                if (error === 'No available location provider.') {
                    Alert.alert(Messages.GPS_DISABLED);
                }
                this.setState({detecting: false});
            }, {enableHighAccuracy: false, timeout: 20000, maximumAge: 1000}
        );
    }

    _detectButton() {
        if (this.state.detecting) {
            return <Text>{Messages.DETECTING_LOCATION}</Text>;
        }
        return (
            <TouchableHighlight
                onPress={() => this._onDetectLocationPress()}
                style={styles.button}
                underlayColor="#EEE"
            >
                <Text style={styles.buttonText}>{Messages.DETECT_LOCATION}</Text>
            </TouchableHighlight>
        );
    }

    async _onCountryChange(countryId) {
        if (!countryId) {
            this.setState({
                selectedCountry: countryId,
                cities: []
            });
            return;
        }
        this.setState({
            selectedCountry: countryId,
            cities: [],
            loading: true
        });
        let cities = [];

        const regions = await this.apiClient.getRegions(countryId);
        const children = await this.apiClient.getCities(countryId);
        cities = cities.concat(children);
        const promises = [];
        for (let region of regions) {
            promises.push(this.apiClient.getCities(region.id));
        }
        Promise.all(promises).then((citiesList) => {
            for (let _cities of citiesList) {
                cities = cities.concat(_cities);
            }
            this.formatLocations(cities);
            this.setState({
                cities,
                loading: false
            });
        });
    }

    _onCityChange(cityId) {
        this.setState({
            selectedCity: cityId
        });
    }

    render() {
        return (
            <View testID="test-id-location-view" >
                {this._detectButton()}
                <Text>{this.state.location}</Text>
                <RegionDrillDown
                    cities={this.state.cities}
                    countries={this.state.countries}
                    loading={this.state.loading}
                    onCityChange={(cityId) => this._onCityChange(cityId)}
                    onCountryChange={(countryId) => this._onCountryChange(countryId)}
                    onPress={(region) => this._onPress(region)}
                    selectedCity={this.state.selectedCity}
                    selectedCountry={this.state.selectedCountry}
                />
            </View>
        );
    }

}

const styles = StyleSheet.create({
    button: {
        borderRadius: 5,
        borderColor: 'black',
        borderWidth: 2,
        margin: 5,
        marginBottom: 0
    },
    buttonText: {
        alignSelf: 'center',
        fontSize: 15,
        color: 'black'
    }
});

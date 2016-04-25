import React, { AsyncStorage, Component, StyleSheet, View, Picker, Text, TouchableHighlight } from 'react-native';
import ApiClient from '../utils/ApiClient';
import Messages from '../constants/Messages'

export default class RegionDrillDown extends Component {

    constructor() {
        super();
        this.state = {
            countries: [],
            cities: [],
            countryId: null,
            cityId: null,
            loading: true
        };
        this.apiClient = new ApiClient();
    }

    componentDidMount() {
        this._loadInitialState();
    }

    async _loadInitialState() {
        let countries;
        try {
            countries = await this.apiClient.getRootLocations();
        } catch(e) {
            alert(Messages.NETWORK_PROBLEM);
            this.setState({loading: false});
            return;
        }


        this._setCountries(countries);
        let region = JSON.parse(await AsyncStorage.getItem('region'));
        const changes = {loading: false};
        if (region) {
            changes['countryId'] = region.countryId;
            await this._onCountryChange(region.countryId).done();
            if (region.countryId != region.id) {
                changes['cityId'] = region.id;
            }
        }
        this.setState(changes);

    }

    _setCountries(countries) {
        let defaultOption = [
            {id: '', name: Messages.SELECT_COUNTRY}
        ];

        this.setState({
            countries: defaultOption.concat(countries)
        });
    }

    getCountries() {
        return this.state.countries.map(
            (country, idx) => <Picker.Item key={idx} label={country.name} value={country.id}/>
        )
    }

    getCities() {
        return this.state.cities.map(
            (city, idx) => <Picker.Item key={idx} label={city.name} value={city.id}/>
        )
    }

    countryPicker() {
        return (
            <Picker onValueChange={this._onCountryChange.bind(this)}
                selectedValue={this.state.countryId}
            >
                {this.getCountries()}
            </Picker>
        );
    }

    cityPicker() {
        if (!this.state.countryId) {
            return;
        }
        return (
            <Picker selectedValue={this.state.cityId} onValueChange={(value) => this.setState({cityId: value})}>
                {this.getCities()}
            </Picker>
        );
    }

    async _onCountryChange(value) {
        try {
            this.setState({countryId: value, cities: [], cityId: null, loading: true});
            let regions = await this.apiClient.getRegions(value);

            let cities = [];
            const children = await this.apiClient.getCities(value);
            cities = cities.concat(children);
            for (let region of regions) {
                cities = cities.concat(await this.apiClient.getCities(region.id));
            }

            const defaultOption = [
                {id: '', name: '-----'}
            ];

            this.setState({cities: defaultOption.concat(cities), loading: false});
        } catch (e) {
            this.setState({loading: false});
        }

    }

    loading() {
        if (this.state.loading) {
            return (<Text style={styles.loading}>{Messages.LOADING}</Text>);
        }
    }

    _getRegionById(regionId) {
        const allRegions = this.state.cities.concat(this.state.countries);
        return allRegions.find((x) => x.id === regionId);
    }

    _selectedId() {
        let selectedId = this.state.countryId;
        if (this.state.cityId) {
            selectedId = this.state.cityId;
        } else if (this.state.regionId) {
            selectedId = this.state.regionId;
        }
        return selectedId;
    }

    onPress() {
        const region = this._getRegionById(this._selectedId());
        region.countryId = this.state.countryId;
        this.props.onPress(region);
    }

    selectButton() {
        const region = this._getRegionById(this._selectedId());

        if (!region || this.state.loading) {
            return;
        }

        return (
            <TouchableHighlight
                onPress={this.onPress.bind(this)}
                style={styles.button}
                underlayColor="white"
            >
                    <Text style={styles.buttonText}>{Messages.SELECT} {region.name}</Text>
            </TouchableHighlight>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                {this.countryPicker()}
                {this.cityPicker()}
                {this.loading()}
                {this.selectButton()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 5,
        flex: 1
    },
    loading: {
        justifyContent: 'center',
        alignSelf: 'center'
    },
    button: {
        backgroundColor: '#EEE'
    },
    buttonText: {
        alignSelf: 'center',
        fontSize: 15,
        color: 'black'
    }
});

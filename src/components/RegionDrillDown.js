import React, { Component } from 'react';
import { StyleSheet, View, Picker, Text, TouchableHighlight } from 'react-native';
import Messages from '../constants/Messages'

export default class RegionDrillDown extends Component {
    constructor(props) {
        super(props);
    }

    getCountries() {
        const defaultElement = [{
            name: 'Select country',
            id: ''
        }];

        return defaultElement.concat(this.props.countries).map(
            (country, idx) => <Picker.Item key={idx} label={country.name} value={country.id}/>
        );
    }

    countryPicker() {
        return (
            <Picker selectedValue={this.props.selectedCountry} onValueChange={this.props.onCountryChange}>
                {this.getCountries()}
            </Picker>
        );
    }

    getCities() {
        return this.props.cities.map(
            (city, idx) => <Picker.Item key={idx} label={city.name} value={city.id}/>
        )
    }

    cityPicker() {
        if (!this.props.selectedCountry) {
            return;
        }
        return (
            <Picker selectedValue={this.props.selectedCity} onValueChange={this.props.onCityChange}>
                {this.getCities()}
            </Picker>
        );
    }

    _getRegionById(regionId) {
        const allRegions = this.props.cities.concat(this.props.countries);
        return allRegions.find((x) => x.id === regionId);
    }

    _selectedId() {
        return this.props.selectedCity;
    }

    _selectedLocation() {
        const selectedId = this._selectedId();
        if (!selectedId) {
            return;
        }
        return this._getRegionById(this._selectedId());
    }

    onPress() {
        const region = this._selectedLocation();
        region.countryId = this.props.selectedCountry;
        this.props.onPress(region);
    }

    selectButton() {
        const selectedLocation = this._selectedLocation();
        if (!selectedLocation) {
            return;
        }
        return (
            <TouchableHighlight
                onPress={this.onPress.bind(this)}
                style={styles.button}
                underlayColor="#EEE"
            >
                    <Text style={styles.buttonText}>{Messages.SELECT} {selectedLocation.name}</Text>
            </TouchableHighlight>
        )
    }

    loading() {
        if (this.props.loading) {
            return (<Text style={styles.loading}>{Messages.LOADING}</Text>);
        }
    }

    render() {
        return (
            <View>
                {this.countryPicker()}
                {this.cityPicker()}
                {this.loading()}
                {this.selectButton()}
            </View>
        )
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

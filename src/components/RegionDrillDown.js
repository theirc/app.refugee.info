import React, { Component } from 'react';
import { StyleSheet, View, Picker, Text, TouchableHighlight } from 'react-native';
import Messages from '../constants/Messages'

const LocationPicker = ({selectedLocation, onLocationChange, locations}) => {
    return (
        <Picker onValueChange={onLocationChange}
            selectedValue={selectedLocation}
        >
            {locations.map(
                (country, idx) => (
                    <Picker.Item
                        key={idx}
                        label={country.name}
                        value={country.id}
                    />
                )
            )}
        </Picker>
    );
};

LocationPicker.propTypes = {
    locations: React.PropTypes.arrayOf(React.PropTypes.shape({
        id: React.PropTypes.number,
        name: React.PropTypes.string.isRequired
    })),
    onLocationChange: React.PropTypes.func.isRequired,
    selectedLocation: React.PropTypes.number
};

export default class RegionDrillDown extends Component {

    static propTypes = {
        cities: React.PropTypes.arrayOf(React.PropTypes.shape({
            id: React.PropTypes.number.isRequired,
            name: React.PropTypes.string.isRequired
        })),
        countries: React.PropTypes.arrayOf(React.PropTypes.shape({
            id: React.PropTypes.number,
            name: React.PropTypes.string.isRequired
        })),
        loading: React.PropTypes.bool.isRequired,
        onCityChange: React.PropTypes.func.isRequired,
        onCountryChange: React.PropTypes.func.isRequired,
        onPress: React.PropTypes.func.isRequired,
        selectedCity: React.PropTypes.number,
        selectedCountry: React.PropTypes.number
    };


    getCountries() {
        return [{name: 'Select country', id: null}, ...this.props.countries];
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
                onPress={() => this.onPress()}
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
                <LocationPicker
                    locations={this.getCountries()}
                    onLocationChange={this.props.onCountryChange}
                    selectedLocation={this.props.selectedCountry}
                />
                <LocationPicker
                    locations={this.props.cities}
                    onLocationChange={this.props.onCityChange}
                    selectedLocation={this.props.selectedCity}
                />
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

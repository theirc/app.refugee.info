import React, { AsyncStorage, StyleSheet, Component, PropTypes, View, TouchableHighlight, Text} from 'react-native';

import RegionDrillDown from '../components/RegionDrillDown';
import ApiClient from '../utils/ApiClient';

export default class Welcome extends Component {

    static contextTypes = {
        navigator: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            position: {},
            detecting: false,
            location: ''
        };
        this.apiClient = new ApiClient();
    }

    async _onPress(region) {
        await AsyncStorage.setItem('region', JSON.stringify(region));
        this.context.navigator.to('info');
    }

    _onDetectLocationPress() {
        this.setState({detecting: true});
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                let location = await this.apiClient.getLocationByPosition(position.coords.longitude, position.coords.latitude, 3);
                if (location.length === 0) {
                    location = await this.apiClient.getLocationByPosition(position.coords.longitude, position.coords.latitude, 1);
                }

                if (location.length > 0) {
                    await AsyncStorage.setItem('region', JSON.stringify(location[0]));
                    this.context.navigator.to('info');
                } else {
                    alert("Sorry, we can't find your location. Please choose location from the list");
                    this.setState({detecting: false});
                }
            },
            (error) => {
                this.setState({detecting: false});
            }, {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
        );
    }

    _detectButton() {
        if (this.state.detecting) {
            return <Text>Detecting...</Text>;
        }
        return (
            <TouchableHighlight style={styles.button} onPress={this._onDetectLocationPress.bind(this)} underlayColor="white">
                <Text style={styles.buttonText}>Detect Location</Text>
            </TouchableHighlight>
        );
    }

    render() {
        return (
            <View>
                {this._detectButton()}
                <Text>{this.state.location}</Text>
                <RegionDrillDown onPress={this._onPress.bind(this)} />
            </View>
        );
    }

}

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#EEE'
    },
    buttonText: {
        alignSelf: 'center',
        fontSize: 15,
        color: 'black'
    }
});

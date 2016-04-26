import React, { AsyncStorage, StyleSheet, Component, PropTypes, View, TouchableHighlight, Text, Alert} from 'react-native';

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
                onPress={this._onDetectLocationPress.bind(this)}
                style={styles.button}
                underlayColor="#EEE"
            >
                <Text style={styles.buttonText}>{Messages.DETECT_LOCATION}</Text>
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

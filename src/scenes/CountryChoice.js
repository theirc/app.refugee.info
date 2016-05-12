import React, { Component, PropTypes } from 'react';
import { AsyncStorage, View, StyleSheet, Image, Text,  } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import Button  from 'react-native-button';

import LocationListView from '../components/LocationListView';
import ApiClient from '../utils/ApiClient';
import I18n from '../constants/Messages';


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

    async detectLocation() {
        navigator.geolocation.getCurrentPosition(
            async(position) => {
                let location = await this._getLocation(position, 3);
                if (location) {
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
                        style={styles.icon}
                        source={require('../graphics/earthsmall.png')}
                        resizeMode={Image.resizeMode.stretch}
                    />
                    <LocationListView
                        header={I18n.t('SELECT_COUNTRY')}
                        onPress={(rowData) => this.onPress(rowData)}
                        rows={this.state.locations}
                    />
                    <View style={styles.selectBlockWrapper}>
                        <View style={styles.selectLeft}></View>
                        <View style={styles.selectWrapper}>
                            <Button
                              style={styles.select}
                              containerStyle={styles.selectContainer}
                              //onPress={this._handlePress}
                            >
                                Submit
                            </Button>
                        </View>
                        <View style={styles.selectRight}></View>
                    </View>
                </View>
            );
        } else {
            return this.renderLoadingView();
        }
    }
}

const styles = StyleSheet.create({
    container : {
      flex: 1,
      flexDirection: 'column'
    },
    icon : {
      flex: 0.33,
      height: null,
      width: null
    },
    selectBlockWrapper : {
      backgroundColor: '#F5F5F5',
      flex: 0.08,
      flexDirection: 'row'
    },
    selectWrapper : {
      flex: 0.2
    },
    selectLeft : {
      flex: 0.79,
    },
    selectRight : {
      flex: 0.01,
    },
    select : {
      flex: 0.05,
      color: 'white',
      fontSize: 14,
    },
    selectContainer : {
      padding: 7,
      overflow: 'hidden',
      borderRadius: 20,
      backgroundColor: '#606060',
      marginTop: 3
    }
});

import React, { Component, PropTypes } from 'react';
import { AsyncStorage, View, StyleSheet, Text, Image } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import Button  from 'react-native-button';

import LocationListView from '../components/LocationListView';
import ApiClient from '../utils/ApiClient';
import I18n from '../constants/Messages';


export default class CityChoice extends Component {

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
        city.detected = false;
        city.coords = {};
        await AsyncStorage.setItem('region', JSON.stringify(city));
        this.context.navigator.to('info');
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
                        header={I18n.t('SELECT_LOCATION')}
                        onPress={(rowData) => this._onPress(rowData)}
                        rows={this.state.cities}
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

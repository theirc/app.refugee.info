import React, {Component, PropTypes} from 'react';
import {
    View,
    Text,
    AsyncStorage,
    StyleSheet,
    ListView,
    TouchableHighlight,
    TextInput,
    ScrollView,
    RefreshControl
} from 'react-native';
import I18n from '../constants/Messages';
import {MapButton, OfflineView, DirectionalText, SearchBar} from '../components';
import {connect} from 'react-redux';
import ApiClient from '../utils/ApiClient';
import styles from '../styles';
import store from '../store';
import Icon from 'react-native-vector-icons/Ionicons';

export default class Regions extends Component {
    constructor(client) {
        super();

        this.client = client;
    }

    async listCountries(network = false) {
        let countries = JSON.parse(await AsyncStorage.getItem('__countries'));

        if (!countries || network) {
            countries = await this.client.getRootLocations();
            await AsyncStorage.setItem('__countries', JSON.stringify(countries));
            await Promise.all(countries.map((c) => AsyncStorage.setItem('__region-' + c.id, JSON.stringify(c))));
        }

        return countries.filter((r) => !r.hidden);
    }

    async listChildren(country, network = false) {
        let countryId = country.id;
        let children = JSON.parse(await AsyncStorage.getItem('__children-' + countryId));

        if (!children || network) {
            children = await this.client.getAllChildrenOf(countryId);
            (children || []).forEach((m) => {
                m.country = country;
                m.countryId = countryId;
            });
            await AsyncStorage.setItem('__children-' + countryId, JSON.stringify(children));
            await Promise.all(children.map((c) => AsyncStorage.setItem('__region-' + c.id, JSON.stringify(c))));
        }

        return children.filter((r) => !r.hidden);
    }

    async getLocation(id, country, network = false) {
        if (!country) {
            let location = await AsyncStorage.getItem('__region-' + id);
            if (!location || network) {
                location = await this.client.getLocation(id);
                await AsyncStorage.setItem('__region-' + location.id, JSON.stringify(location))
            }

            return location;
        }

        let locations = (await this.listChildren(country, network)).filter((l) => l.id == id);
        return locations.length && locations[0];
    }

    async getLocationByPosition(longitude, latitude, level) {
        return await this.client(longitude, latitude, level);
    }
}
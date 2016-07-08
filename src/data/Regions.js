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
            await Promise.all(countries.map((c) => {
                return Promise.all([
                    AsyncStorage.setItem('__region-' + c.id, JSON.stringify(c)),
                    AsyncStorage.setItem('__slug-' + c.full_slug, JSON.stringify(c)),
                ]);
            }));
        }

        return countries;//.filter((r) => !r.hidden);
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
            await Promise.all(children.map((c) => {
                return Promise.all([
                    AsyncStorage.setItem('__region-' + c.id, JSON.stringify(c)),
                    AsyncStorage.setItem('__slug-' + c.full_slug, JSON.stringify(c)),
                ]);
            }));
        }

        return children.filter((r) => !r.hidden);
    }

    async getLocation(id, country, network = false) {
        if (!country) {
            let location = JSON.parse(await AsyncStorage.getItem('__region-' + id));
            if (!location || network) {
                location = await this.client.getLocation(id);
                await AsyncStorage.setItem('__region-' + location.id, JSON.stringify(location))
                await AsyncStorage.setItem('__slug-' + location.full_slug, JSON.stringify(location));
            }

            return location;
        }

        let locations = (await this.listChildren(country, network)).filter((l) => l.id == id);
        return locations.length && locations[0];
    }

    async getLocationByPosition(longitude, latitude, level) {
        return await this.client(longitude, latitude, level);
    }

    static loadImportantInformation(region) {
        if (!region) {
            return true;
        }

        let importantInfo = region.important_information.map((i) => {
            return AsyncStorage.setItem('__info-' + i.full_slug, JSON.stringify(i));
        });
        return Promise.all([Promise.all(importantInfo), importantInfo]);
    }

    static searchImportantInformation(fullSlug) {
        return AsyncStorage.getAllKeys().then((k) => {
            let promises = k.map((r) => {
                if (r.indexOf(fullSlug) > -1) {
                    return AsyncStorage.getItem(r).then(i => {
                        let item = JSON.parse(i);
                        if (item && item.metadata && item.metadata.page_title) {
                            item.pageTitle = item.metadata.page_title;
                        }
                        return item;
                    });
                };
                return false;
            }).filter(r => r);
            if (promises) {
                return promises.pop();
            }
            return false;
        });
    }
}
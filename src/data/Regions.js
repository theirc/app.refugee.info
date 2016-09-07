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
import {Icon} from '../components';

var gju = require('geojson-utils');

export default class Regions extends Component {
    constructor(props, context = null) {
        super();

        this.client = new ApiClient(context, props);
    }

    async listCountries(network = false) {
        let countries = JSON.parse(await AsyncStorage.getItem('__countries'));

        if (!countries || network) {
            countries = await this.client.getRootLocations();
            await AsyncStorage.setItem('__countries', JSON.stringify(countries));
        }

        return countries;//.filter((r) => !r.hidden);
    }

    async listChildren(country, network = false, region = null, point = null) {
        let countryId = country.id;
        children = await this.client.getAllChildrenOf(countryId);
        (children || []).forEach((m) => {
            m.country = country;
            m.countryId = countryId;
        });

        if (region) {
            children = children.filter(c=> c.id != region.id);
            children = Regions.sortChildren(children, region.centroid);
        }

        if (point) {
            children = Regions.sortChildren(children, point);
        }

        children = [{country, ...country}].concat(children);

        return children.filter((r) => !r.hidden);
    }

    static sortChildren(children, region) {
        if (region) {
            children.sort((a, b) => {
                if (!a.centroid || !b.centroid) {
                    return 0;
                }
                var x = gju.pointDistance(region, a.centroid);
                var y = gju.pointDistance(region, b.centroid);

                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            });
        }

        return children;
    }

    async getLocation(id, country, network = false) {
        if (!country) {
            return await this.client.getLocation(id);
        }
        let locations = (await this.listChildren(country, network)).filter((l) => l.id == id);
        return locations.length && locations[0];
    }

    async getLocationByPosition(longitude, latitude, level) {
        return await this.client(longitude, latitude, level);
    }
    static searchImportantInformation(region, fullSlug) {
        let info = region.important_information.filter((info) => {
            return info.full_slug === fullSlug
        });
        return info[0] || null;
    }

}
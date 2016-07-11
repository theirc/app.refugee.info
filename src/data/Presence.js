import React, {Component, PropTypes} from 'react';
import {
    AsyncStorage,
} from 'react-native';
import I18n from '../constants/Messages';
import {MapButton, OfflineView, DirectionalText, SearchBar} from '../components';
import {connect} from 'react-redux';
import ApiClient from '../utils/ApiClient';
import styles from '../styles';
import store from '../store';
import Icon from 'react-native-vector-icons/Ionicons';

export default class Presence extends Component {
    constructor(props, context = null) {
        super();

        this.client = new ApiClient(context, props);
    }

    static async registerToken(token) {
        await AsyncStorage.setItem('notificationToken', token);
    }

    async registerPresence(coords, region) {
        const token = await AsyncStorage.getItem('notificationToken');
        let pointFromDeviceCoords = (c) => {
            return {
                coordinates: [
                    c.longitude, // x
                    c.latitude, // x
                ],
                type: 'Point'
            };
        }
        let payload = {
            coordinates: coords ? pointFromDeviceCoords(coords) : (region ? region.centroid : null),
            region: region ? region.id : null,
            token
        };

        await this.client.post('/v1/presence/', payload);
    }
}
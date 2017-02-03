import {Component} from 'react';
import {
    AsyncStorage,
    Platform
} from 'react-native';
import ApiClient from '../utils/ApiClient';
import store from '../store';
let DeviceInfo = require('react-native-device-info');

export default class Presence extends Component {
    static createUUID() {
        // http://www.ietf.org/rfc/rfc4122.txt
        let s = [];
        let hexDigits = '0123456789abcdef';
        for (let i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = '4';  // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = '-';

        let uuid = s.join('');
        return uuid;
    }

    static async getDeviceToken() {
        let token = await AsyncStorage.getItem('deviceToken');
        if(!token) {
            token = Presence.createUUID();
            await AsyncStorage.setItem('deviceToken', token);
        }
        return token;
    }

    static async getToken() {
        return await AsyncStorage.getItem('notificationToken');
    }

    static pointFromDeviceCoords(c) {
        return {
            coordinates: [
                c.longitude,
                c.latitude
            ],
            type: 'Point'
        };
    }

    static async registerToken(token) {
        await AsyncStorage.setItem('notificationToken', JSON.stringify(token));
    }

    static async registerLocation(deviceCoords) {
        let currentLocation = Presence.pointFromDeviceCoords(deviceCoords);
        await AsyncStorage.setItem('deviceCoordinates', JSON.stringify(currentLocation));
    }

    static async getLocation() {
        return JSON.parse(await AsyncStorage.getItem('deviceCoordinates'));
    }

    constructor(props, context = null) {
        super();

        this.client = new ApiClient(context, props);
    }

    async recordPresence(region, language) {
        let token = await Presence.getToken();
        const location = await Presence.getLocation();
        const {navigation} = store.getState();

        token = JSON.parse(token) || {};
        token.platform = {
            version: Platform.Version,
            os: Platform.OS
        };
        token.path = navigation;
        token.deviceToken = await Presence.getDeviceToken();

        try {
            let deviceId = DeviceInfo.getUniqueID();
            if (deviceId) {
                token.deviceId = deviceId;
            }
        } catch (e) {

        }
        token = JSON.stringify(token);


        let payload = {
            coordinates: location ? location : (region ? region.centroid : null),
            region: region ? region.id : null,
            language,
            token
        };

        let promise = Promise.resolve(true);
        await this.client.post('presence/', payload)
            .then(() => promise)
            .catch(() => promise);

        await promise;
    }
}
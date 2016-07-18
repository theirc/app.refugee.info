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
import Translation from '../utils/Translation';

export default class Services extends Component {
    constructor(props, context=null) {
        super();

        this.language = props.language;
        this.client = new ApiClient(context, props);
    }


    async listServiceTypes(network = false) {
        let serviceTypes = JSON.parse(await AsyncStorage.getItem('__serviceTypes'));

        if (!serviceTypes || network) {
            serviceTypes = await this.client.getServiceTypes();
            await AsyncStorage.setItem('__serviceTypes', JSON.stringify(serviceTypes));
            await Promise.all(serviceTypes.map((c) => {
                return Promise.all([
                    AsyncStorage.setItem('__serviceType-' + c.id, JSON.stringify(c)),
                ]);
            }));
        }
        serviceTypes.forEach(s=> Translation.addTranslatedProperties(s, this.language, 'name', 'comments'));

        return serviceTypes;
    }



    async pageServices(slug, coords = {}, searchCriteria="", page=1, pageSize = 10, types) {
        /*
        How do we go about storing this in the AsyncStorage?
        */
        let pagedResults = await this.client.getServicePage(slug, coords, searchCriteria, page, pageSize, types);

        pagedResults.results.forEach(s=> Translation.addTranslatedProperties(s, this.language, 'name', 'comments'));

        return pagedResults;
    }



}
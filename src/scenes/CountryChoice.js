import React, { Component, PropTypes } from 'react';
import { ListView, View } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';

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
        this._loadInitialState();
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
            <View style={{ flex: 1 }}>
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
                <LocationListView
                    header={I18n.t('SELECT_COUNTRY')}
                    onPress={(rowData) => this.onPress(rowData)}
                    rows={this.state.locations}
                />
            );
        } else {
            return this.renderLoadingView();
        }
    }
}

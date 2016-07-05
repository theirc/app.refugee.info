import React, {Component, PropTypes} from 'react';
import {AsyncStorage, View, StyleSheet, Image} from 'react-native';
import {connect} from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';
import {LocationListView} from '../components';
import ApiClient from '../utils/ApiClient';
import I18n from '../constants/Messages';
import styles from '../styles';
import store from '../store';

import {updateRegionIntoStorage} from '../actions/region';
import {updateCountryIntoStorage} from '../actions/country';

import {fetchRegionFromStorage} from '../actions/region';
import {fetchDirectionFromStorage} from '../actions/direction';
import {fetchLanguageFromStorage} from '../actions/language';
import {Regions} from '../data'

class CityChoice extends Component {

    static propTypes = {
        countryId: React.PropTypes.number.isRequired,
        country: React.PropTypes.object.isRequired
    };

    static contextTypes = {
        navigator: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = Object.assign({}, store.getState(), {
            cities: [],
            loaded: false
        });
    }

    async componentWillMount() {
        const regionData = new Regions(new ApiClient(this.context, this.props));
        const cities = await regionData.listChildren(this.props.country);

        cities.forEach((c) => {
            if (c && c.metadata) {
                const pageTitle = (c.metadata.page_title || '')
                    .replace('\u060c', ',').split(',')[0];
                c.pageTitle = pageTitle;
            }
        });

        this.setState({
            cities,
            loaded: true
        });
    }

    async _onPress(city) {
        const {dispatch} = this.props;

        city.detected = false;
        city.coords = {};

        dispatch(updateCountryIntoStorage(city.country));
        dispatch(updateRegionIntoStorage(city));

        dispatch({type: 'REGION_CHANGED', payload: city});
        dispatch({type: 'COUNTRY_CHANGED', payload: city.country});

        if (city.content && city.content.length == 1) {
            return this.context.navigator.to('infoDetails', null, {
                section: city.content[0].section,
                sectionTitle: city.content[0].title
            });
        } else {
            return this.context.navigator.to('info', null, null, store.getState());
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <LocationListView
                    loaded={this.state.loaded}
                    header={I18n.t('SELECT_LOCATION') }
                    onPress={(rowData) => { this._onPress(rowData) } }
                    rows={this.state.cities}
                />
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return {};
};

export default connect(mapStateToProps)(CityChoice);

import React, {Component} from 'react';
import {View} from 'react-native';
import {connect} from 'react-redux';
import {LocationListView, OfflineView, LoadingOverlay} from '../components';
import I18n from '../constants/Messages';
import ApiClient from '../utils/ApiClient';
import {getCountryFlag} from '../utils/helpers';
import {Actions} from 'react-native-router-flux';
import styles from '../styles';


export class CountryChoice extends Component {

    constructor(props) {
        super(props);
        this.loadInitialState = this.loadInitialState.bind(this);
        this.apiClient = new ApiClient(this.context, props);

        this.state = {
            countries: [],
            loading: true,
            offline: false
        };
    }

    async componentDidMount() {
        this.loadInitialState();
    }

    async loadInitialState() {
        let countries = [];
        try {
            countries = await this.apiClient.getCountries(true);
            countries = countries.filter(x => !x.hidden);
        } catch (e) {
            return this.setState({offline: true});
        }
        countries.forEach((country) => {
            country.onPress = () => {
                requestAnimationFrame(() => {Actions.cityChoice({country})});
            };
            country.title = country.name;
            country.image = getCountryFlag(country.code);
        });

        this.setState({
            countries,
            loading: false,
            offline: false
        });
    }

    render() {
        const {offline, loading} = this.state;
        if (offline) {
            return (
                <OfflineView
                    offline={offline}
                    onRefresh={this.loadInitialState}
                />
            );
        }
        return (
            <View style={styles.container}>
                <LocationListView
                    header={I18n.t('SELECT_COUNTRY')}
                    rows={this.state.countries}
                />
                {loading &&
                <LoadingOverlay />}
            </View>
        );
    }
}


const mapStateToProps = (state) => {
    return {
        language: state.language
    };
};

export default connect(mapStateToProps)(CountryChoice);

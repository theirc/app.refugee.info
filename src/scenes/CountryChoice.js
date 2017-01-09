import React, {Component, PropTypes} from 'react';
import {View} from 'react-native';
import {connect} from 'react-redux';
import {LocationListView, OfflineView} from '../components';
import I18n from '../constants/Messages';
import ApiClient from '../utils/ApiClient';
import {getCountryFlag} from '../utils/helpers';
import styles from '../styles';

export class CountryChoice extends Component {

    static contextTypes = {
        navigator: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.loadInitialState = this.loadInitialState.bind(this);
        this.apiClient = new ApiClient(this.context, props);

        this.state = {
            countries: [],
            loaded: false,
            offline: false
        };
    }

    async componentDidMount() {
        this.loadInitialState();
    }

    async loadInitialState() {
        const {navigator} = this.context;
        let countries = [];
        try {
            countries = await this.apiClient.getCountries(true);
            countries = countries.filter(x => !x.hidden);
        } catch (e) {
            return this.setState({offline: true});
        }
        countries.forEach((country) => {
            country.onPress = () => {
                requestAnimationFrame(() => {navigator.forward(null, null, {country})});
            };
            country.title = country.name;
            country.image = getCountryFlag(country.code);
        });

        this.setState({
            countries,
            loaded: true,
            offline: false
        });
    }

    render() {
        if (this.state.offline) {
            return (
                <OfflineView
                    offline={this.state.offline}
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

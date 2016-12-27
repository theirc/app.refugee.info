import React, {Component, PropTypes} from 'react';
import {View} from 'react-native';
import {connect} from 'react-redux';
import {LocationListView, OfflineView} from '../components';
import I18n from '../constants/Messages';
import {getCountryFlag} from '../utils/helpers';
import styles from '../styles';
import {Regions} from '../data';

export class CountryChoice extends Component {

    static contextTypes = {
        navigator: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            countries: [],
            loaded: false,
            offline: false
        };
    }

    async componentDidMount() {
        const {navigator} = this.context;
        const regionData = new Regions(this.props);
        let countries = [];
        try {
            countries = await regionData.listCountries();
            countries = countries.filter(x => !x.hidden);
        } catch (e) {
            this.setState({offline: true});
        }
        countries.forEach((country) => {
            if (country && country.metadata) {
                country.pageTitle = (country.metadata.page_title || '').replace('\u060c', ',').split(',')[0];
            }
            country.onPress = () => {
                requestAnimationFrame(() => {navigator.forward(null, null, {country})});
            };
            country.title = country.pageTitle || (country.metadata && country.metadata.page_title) || country.name;
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
                    onRefresh={this.componentDidMount.bind(this)}
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
        language: state.language,
        direction: state.direction,
        theme: state.theme
    };
};

export default connect(mapStateToProps)(CountryChoice);

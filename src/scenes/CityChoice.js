import React, {Component, PropTypes} from 'react';
import {View} from 'react-native';
import {connect} from 'react-redux';
import {LocationListView, OfflineView} from '../components';
import I18n from '../constants/Messages';
import styles from '../styles';
import {
    updateCountryIntoStorage,
    updateRegionIntoStorage,
    updateLocationsIntoStorage
} from '../actions';
import {Regions} from '../data';

export class CityChoice extends Component {

    static propTypes = {
        country: React.PropTypes.object.isRequired
    };

    static contextTypes = {
        navigator: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.loadInitialState = this.loadInitialState.bind(this);

        this.regionData = new Regions(props);
        this.state = {
            cities: [],
            loaded: false,
            offline: false
        };
    }

    async componentDidMount() {
        this.loadInitialState();
    }

    async loadInitialState() {
        let cities = [];
        try {
            cities = await this.regionData.listChildren(this.props.country, true);
        } catch (e) {
            this.setState({offline: true});
        }
        cities.forEach((city) => {
            if (city && city.metadata) {
                city.pageTitle = (city.metadata.page_title || '').replace('\u060c', ',').split(',')[0];
            }
            city.onPress = this.onPress.bind(this, city);
            city.title = city.pageTitle || (city.metadata && city.metadata.page_title) || city.name;
            city.image = null;
        });
        this.setState({
            cities,
            loaded: true,
            offline: false
        });
    }

    async onPress(city) {
        const {dispatch, country} = this.props;
        let regionDetails = await this.regionData.getRegionDetails(city.slug);
        this.setState({region: regionDetails});

        requestAnimationFrame(() => {
            Promise.all([
                dispatch(updateCountryIntoStorage(country)),
                dispatch(updateRegionIntoStorage(regionDetails)),
                dispatch(updateLocationsIntoStorage(this.state.cities)),
                dispatch({type: 'REGION_CHANGED', payload: regionDetails}),
                dispatch({type: 'COUNTRY_CHANGED', payload: country}),
                dispatch({type: 'LOCATIONS_CHANGED', payload: this.state.cities})
            ]);
            if (city.content && city.content.length == 1) {
                return this.context.navigator.to('infoDetails', null, {
                    section: city.content[0].html,
                    sectionTitle: city.title
                });
            }
            return this.context.navigator.to('info');
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
                    header={I18n.t('SELECT_LOCATION')}
                    rows={this.state.cities}
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

export default connect(mapStateToProps)(CityChoice);

import React, {Component, PropTypes} from 'react';
import {AsyncStorage, View, StyleSheet, Image} from 'react-native';
import {connect} from 'react-redux';
import {LocationListView, OfflineView} from '../components';
import I18n from '../constants/Messages';
import styles from '../styles';
import store from '../store';
import {
    updateCountryIntoStorage,
    updateRegionIntoStorage,
    updateLocationsIntoStorage
} from '../actions';
import {Regions} from '../data'

export class CityChoice extends Component {

    static propTypes = {
        country: React.PropTypes.object.isRequired
    };

    static contextTypes = {
        navigator: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = Object.assign({}, store.getState(), {
            cities: [],
            loaded: false,
            offline: false
        });
    }

    async componentDidMount() {
        const regionData = new Regions(this.props);
        let cities;
        try {
            cities = (await regionData.listChildren(this.props.country, true)).filter((c) => c.level != 2);

            cities.forEach((c) => {
                if (c && c.metadata) {
                    c.pageTitle = (c.metadata.page_title || '').replace('\u060c', ',').split(',')[0]
                }
            });
        } catch (e) {
            this.setState({offline: true});
            return;
        }
        this.setState({
            cities,
            loaded: true,
            offline: false
        });
    }

    async _onPress(city) {
        const {dispatch} = this.props;

        city.detected = false;
        city.coords = {};

        requestAnimationFrame(() => {
            Promise.all([
                dispatch(updateCountryIntoStorage(city.country)),
                dispatch(updateRegionIntoStorage(city)),
                dispatch(updateLocationsIntoStorage(this.state.cities)),
                dispatch({type: 'REGION_CHANGED', payload: city}),
                dispatch({type: 'COUNTRY_CHANGED', payload: city.country}),
                dispatch({type: 'LOCATIONS_CHANGED', payload: this.state.cities})
            ]);
            if (city.content && city.content.length == 1) {
                return this.context.navigator.to('infoDetails', null, {
                    section: city.content[0].section,
                    sectionTitle: city.pageTitle
                });
            } else {
                return this.context.navigator.to('info', null, null, store.getState());
            }
        })
    }

    render() {
        if (this.state.offline) {
            return (
                <OfflineView
                    onRefresh={this.componentDidMount.bind(this)}
                    offline={this.state.offline}
                />
            )
        }
        return (
            <View style={styles.container}>
                <LocationListView
                    loaded={this.state.loaded}
                    header={I18n.t('SELECT_LOCATION') }
                    onPress={(rowData) => {
                        this._onPress(rowData)
                    }}
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

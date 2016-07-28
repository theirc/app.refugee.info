import React, {Component, PropTypes} from 'react';
import {AsyncStorage, Image, StyleSheet, View, Text} from 'react-native';
import {connect} from 'react-redux'
import {
    fetchCountryFromStorage,
    fetchDirectionFromStorage,
    fetchLanguageFromStorage,
    fetchLocationsFromStorage,
    fetchRegionFromStorage,
    fetchThemeFromStorage
} from '../actions'

class Initial extends Component {

    static contextTypes = {
        drawer: PropTypes.object.isRequired,
        navigator: PropTypes.object.isRequired
    };

    async componentDidMount() {
        const {navigator} = this.context;
        const {dispatch} = this.props;
        AsyncStorage.getItem('regionCache').then((regionCache) => {
            const region = regionCache;
            if (region && region != 'null') {
                if (region.content && region.content.length == 1) {
                    this.context.navigator.to('infoDetails', null,
                        { section: region.content[0].section, sectionTitle: region.pageTitle })
                } else {
                    this.context.navigator.to('info');
                }
            } else {
                navigator.to('countryChoice');
            }
        })
    }

    render() {
        // Nothing to see here, just redirecting to the info page
        return <View />
    }
}

export default connect((state) => {
    return {...state};
})(Initial);

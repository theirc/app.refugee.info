import React, {Component, PropTypes} from 'react';
import {AsyncStorage, Image, StyleSheet, View, Text} from 'react-native';
import {connect} from 'react-redux'
import {fetchRegionFromStorage} from '../actions/region';
import {fetchDirectionFromStorage} from '../actions/direction';
import {fetchLanguageFromStorage} from '../actions/language';
import {fetchCountryFromStorage} from '../actions/country';
import {fetchThemeFromStorage} from '../actions/theme'

class Initial extends Component {

    static contextTypes = {
        drawer: PropTypes.object.isRequired,
        navigator: PropTypes.object.isRequired
    };

    async componentDidMount() {
        const {navigator} = this.context;
        const {dispatch} = this.props;

        await dispatch(fetchRegionFromStorage());
        await dispatch(fetchDirectionFromStorage());
        await dispatch(fetchLanguageFromStorage());
        await dispatch(fetchCountryFromStorage());
        await dispatch(fetchThemeFromStorage());

        const region = await AsyncStorage.getItem('regionCache');
        if (region && region != 'null') { 
            navigator.to('info');
        } else {
            navigator.to('countryChoice');
        }

    }

    render() {
        // Nothing to see here, just redirecting to the info page
        return <View />
    }
}

export default connect((state) => {
    return {...state};
})(Initial);

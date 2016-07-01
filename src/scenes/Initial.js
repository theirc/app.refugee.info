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
        const region = await AsyncStorage.getItem('regionCache');

        await dispatch(fetchRegionFromStorage());
        await dispatch(fetchDirectionFromStorage());
        await dispatch(fetchLanguageFromStorage());
        await dispatch(fetchCountryFromStorage());
        await dispatch(fetchThemeFromStorage());

        if (!(region || false)) {
            navigator.to('countryChoice');
        } else {
            navigator.to('info');
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

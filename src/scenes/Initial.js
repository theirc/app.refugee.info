import React, {Component, PropTypes} from 'react';
import {AsyncStorage, Image, StyleSheet, View, Text} from 'react-native';
import store from '../store'
import {connect} from 'react-redux'

import { fetchRegionFromStorage } from '../actions/region';
import { fetchDirectionFromStorage } from '../actions/direction';
import { fetchLanguageFromStorage } from '../actions/language';
import { fetchCountryFromStorage } from '../actions/country';

 class Initial extends Component {

    static contextTypes = {
        navigator: PropTypes.object.isRequired
    };

  async componentDidMount() {
    const { dispatch } = this.props;
    const r = await AsyncStorage.getItem('regionCache');

    await dispatch(fetchRegionFromStorage());
    await dispatch(fetchDirectionFromStorage());
    await dispatch(fetchLanguageFromStorage());
    await dispatch(fetchCountryFromStorage());

    if(!(r||false)) {
      this.context.navigator.to('countryChoice');
    } else {
      this.context.navigator.to('info');
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

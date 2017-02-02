import React, {Component} from 'react';
import {AsyncStorage, View} from 'react-native';
import {connect} from 'react-redux';
import {Actions} from 'react-native-router-flux';

import {
    fetchCountryFromStorage,
    fetchDirectionFromStorage,
    fetchLanguageFromStorage,
    fetchRegionFromStorage
} from '../actions';

class Initial extends Component {
    async componentDidMount() {
        const {dispatch} = this.props;
        Promise.all([
            AsyncStorage.getItem('regionCache'),
            dispatch(fetchRegionFromStorage()),
            dispatch(fetchDirectionFromStorage()),
            dispatch(fetchLanguageFromStorage()),
            dispatch(fetchCountryFromStorage())
        ]).then((values) => {
            const region = values[0];
            if (region && region != 'null') {
                Actions.info();
            } else {
                Actions.countryChoice();
            }
        });
    }

    render() {
        // Nothing to see here, just redirecting to the info page
        return <View />;
    }
}

export default connect((state) => {
    return {...state};
})(Initial);

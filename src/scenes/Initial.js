import React, {Component, PropTypes} from 'react';
import {AsyncStorage, View} from 'react-native';
import {connect} from 'react-redux';
import {
    fetchCountryFromStorage,
    fetchDirectionFromStorage,
    fetchLanguageFromStorage,
    fetchRegionFromStorage
} from '../actions';

class Initial extends Component {

    static contextTypes = {
        drawer: PropTypes.object.isRequired,
        navigator: PropTypes.object.isRequired
    };

    async componentDidMount() {
        const {navigator} = this.context;
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
                if (region.content && region.content.length == 1) {
                    this.context.navigator.to('infoDetails', null,
                        {section: region.content[0].section, sectionTitle: region.pageTitle});
                } else {
                    this.context.navigator.to('info');
                }
            } else {
                navigator.to('countryChoice');
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

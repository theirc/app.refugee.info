import React, {Component} from 'react';
import {View} from 'react-native';
import {connect} from 'react-redux';
import {Actions} from 'react-native-router-flux';

class Initial extends Component {
    async componentDidMount() {
        const {region} = this.props;
        if (region && region != 'null') {
            Actions.info();
        } else {
            Actions.countryChoice();
        }
    }

    render() {
        // Nothing to see here, just redirecting to the info page
        return <View />;
    }
}

export default connect((state) => {
    return {...state};
})(Initial);

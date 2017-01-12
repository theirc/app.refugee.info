import React, {Component, PropTypes} from 'react';
import {StyleSheet, View} from 'react-native';
import {themes} from '../styles';


class Divider extends Component {

    static propTypes = {
        margin: PropTypes.number
    };

    render() {
        const {margin} = this.props;
        return (
            <View
                style={[
                    componentStyles.divider,
                    (margin) ? {marginTop: margin, marginBottom: margin} : {marginTop: 10, marginBottom: 10}
                ]}
            />
        );
    }
}

const componentStyles = StyleSheet.create({
    divider: {
        height: 1,
        backgroundColor: themes.light.dividerColor
    }
});

export default Divider;

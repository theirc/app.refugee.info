import React, {Component, PropTypes} from 'react';
import {StyleSheet, TouchableHighlight, View} from 'react-native';
import styles, {themes} from '../styles';


export default class Divider extends Component {

    static propTypes = {
        theme: PropTypes.oneOf(['light', 'dark']),
        margin: PropTypes.number
    };

    render() {
        const {theme, margin} = this.props;
        return (
            <View
                style={[
                    componentStyles.divider,
                    (theme=='dark') ? componentStyles.dividerDark : componentStyles.dividerLight,
                    (margin) ? {marginTop: margin, marginBottom: margin} : {marginTop: 10, marginBottom: 10}
                ]}
            />
        );
    }
}

const componentStyles = StyleSheet.create({
    divider: {
        height: 1
    },
    dividerLight: {
        backgroundColor: themes.light.dividerColor
    },
    dividerDark: {
        backgroundColor: themes.dark.darkerDividerColor
    }
});

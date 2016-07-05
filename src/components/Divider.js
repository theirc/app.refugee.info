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
                    componentStyles.button,
                    (theme=='dark') ? componentStyles.buttonDark : componentStyles.buttonLight,
                    (margin) ? {marginTop: margin, marginBottom: margin} : {marginTop: 10, marginBottom: 10}
                ]}
            />
        );
    }
}

const componentStyles = StyleSheet.create({
    button: {
        flex: 1,
        height: 1
    },
    buttonLight: {
        backgroundColor: themes.light.dividerColor
    },
    buttonDark: {
        backgroundColor: themes.dark.darkerDividerColor
    }
});

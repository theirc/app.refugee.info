import React, {Component, PropTypes} from 'react';
import {StyleSheet, TouchableHighlight, View} from 'react-native';
import styles, {themes} from '../styles';
import Icon from 'react-native-vector-icons/Ionicons';


export default class MapButton extends Component {

    static contextTypes = {
        navigator: PropTypes.object.isRequired
    };

    static propTypes = {
        direction: PropTypes.oneOf(['rtl', 'ltr']),
        services: PropTypes.array,
        ...Component.propTypes
    };

    onClick() {
        const {navigator} = this.context;
        navigator.to('map', null, { services: this.props.services });
    }

    render() {
        const {direction} = this.props;
        return (
            <TouchableHighlight
                onPress={() => this.onClick() }
                underlayColor="white"
                >
                <View
                    style={[
                        componentStyles.mapButton,
                        direction == 'rtl' ? {left: 20} : {}]}
                    >
                    <Icon
                        name="md-map"
                        style={componentStyles.mapButtomIcon}
                        />
                </View>
            </TouchableHighlight>
        );
    }
}

const componentStyles = StyleSheet.create({
    mapButton: {
        width: 64,
        height: 64,
        borderRadius: 64,
        backgroundColor: themes.light.greenAccentColor,
        position: 'absolute',
        flex: 1,
        right: 20,
        bottom: 20,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.5,
        shadowRadius: 3,
        alignItems: 'center',
        justifyContent: 'center'
    },
    mapButtomIcon: {
        color: themes.light.backgroundColor,
        fontSize: 20
    }
});

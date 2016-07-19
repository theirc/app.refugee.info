import React, {Component, PropTypes} from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import styles, {themes} from '../styles';
import Icon from 'react-native-vector-icons/Ionicons';


export default class MapButton extends Component {

    static contextTypes = {
        navigator: PropTypes.object.isRequired
    };

    static propTypes = {
        direction: PropTypes.oneOf(['rtl', 'ltr']),
        searchCriteria: PropTypes.string,
        serviceTypes: PropTypes.array,
        ...Component.propTypes
    };

    onClick() {
        const {navigator} = this.context;
        navigator.to('map', null, {searchCriteria: this.props.searchCriteria, serviceTypes: this.props.serviceTypes});
    }

    render() {
        const {direction} = this.props;
        return (
            <TouchableOpacity
                onPress={() => this.onClick()}
                activeOpacity={0.8}
                style={[{
                    position: 'absolute',
                    bottom: 20
                },
                    direction == 'rtl' ? {left: 20} : {right: 20}
                ]}
            >
                <View
                    style={[componentStyles.mapButton]}
                >
                    <Icon
                        name="md-map"
                        style={componentStyles.mapButtomIcon}
                    />
                </View>
            </TouchableOpacity>
        );
    }
}

const componentStyles = StyleSheet.create({
    mapButton: {
        width: 64,
        height: 64,
        borderRadius: 64,
        backgroundColor: themes.light.greenAccentColor,
        shadowColor: 'black',
        shadowOffset: {width: 0, height: 1},
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

import React, {Component, PropTypes} from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import styles, {getElevation, themes} from '../styles';
import {Icon} from '../components';


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
                    style={[
                        getElevation(),
                        componentStyles.mapButton
                    ]}
                >
                    <Icon
                        name="fa-map"
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
        alignItems: 'center',
        justifyContent: 'center'
    },
    mapButtomIcon: {
        color: themes.light.backgroundColor,
        fontSize: 20
    }
});

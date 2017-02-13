import React, {Component, PropTypes} from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {getElevation, themes} from '../styles';
import {Icon} from '../components';
import {Actions} from 'react-native-router-flux';


class MapButton extends Component {

    static propTypes = {
        searchCriteria: PropTypes.string,
        serviceTypes: PropTypes.array,
        ...Component.propTypes
    };

    constructor(props) {
        super(props);
        this.onPress = this.onPress.bind(this);
    }

    onPress() {
        Actions.service({map: true});
    }

    render() {
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={this.onPress}
                style={componentStyles.mapButtonContainer}
            >
                <View style={[
                    getElevation(),
                    componentStyles.mapButton]}
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
    mapButtonContainer: {
        position: 'absolute',
        bottom: 20,
        right: 20
    },
    mapButton: {
        width: 56,
        height: 56,
        borderRadius: 56,
        backgroundColor: themes.light.greenAccentColor,
        alignItems: 'center',
        justifyContent: 'center'
    },
    mapButtomIcon: {
        color: themes.light.backgroundColor,
        fontSize: 18
    }
});

export default MapButton;
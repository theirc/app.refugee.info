import React, { Component, PropTypes, View, Text } from 'react-native';

export default class ServiceMap extends Component {

    static contextTypes = {
        navigator: PropTypes.object.isRequired
    };

    render() {
        const { navigator } = this.context;

        return (
            <View>
                <Text>Map</Text>
            </View>
        );
    }

}

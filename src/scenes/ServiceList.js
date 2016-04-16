import React, { Component, PropTypes, View, Text, Image, IntentAndroid } from 'react-native';

export default class ServiceList extends Component {

    static contextTypes = {
        navigator: PropTypes.object.isRequired
    };

    render() {
        const { navigator } = this.context;

        return (
            <View>
                <Text>Service List</Text>
            </View>
        );
    }

}

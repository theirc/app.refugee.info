import React, { Component, PropTypes, View, Text } from 'react-native';

export default class GeneralInformation extends Component {

    static contextTypes = {
        navigator: PropTypes.object.isRequired
    };

    render() {
        const { navigator } = this.context;

        return (
            <View>
                <Text>General Info</Text>
            </View>
        );
    }

}

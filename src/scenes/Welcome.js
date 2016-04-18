import React, { Component, PropTypes, View, Text } from 'react-native';

export default class Welcome extends Component {

    static contextTypes = {
        navigator: PropTypes.object.isRequired
    };

    render() {
        const { navigator } = this.context;

        return (
            <View>
                <Text>Welcome</Text>
            </View>
        );
    }

}

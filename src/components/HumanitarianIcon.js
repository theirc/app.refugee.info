import React, { Component, PropTypes } from 'react';
import { Text } from 'react-native';

export default class HumanitarianIcon extends Component {

    static propTypes = {
        icon: PropTypes.string.isRequired,
        size: PropTypes.number,
        color: PropTypes.string
    };

    render() {

        return (
            <Text
                style={{
                    fontSize: this.props.size || 24,
                    color: this.props.color || '#000000',
                    fontFamily: 'icomoon'
                }}
            >
                {this.props.icon}
            </Text>
        )
    }
}

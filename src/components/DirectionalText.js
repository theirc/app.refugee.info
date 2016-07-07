import React, { Component, PropTypes } from 'react';
import { Text, Image, View } from 'react-native';

export default class DirectionalText extends Component {

    static propTypes = {
        direction: PropTypes.oneOf(['rtl', 'ltr']),
        ...Text.propTypes
    };

    constructor(props) {
        super(props);
        if(!props.direction) {
          this.props.direction = 'ltr';
        }
    }

    render() {
          let textAlign =  this.props.direction === 'ltr' ? 'flex-start' : 'flex-end';

          return <View style={{ flexDirection: 'column', flex: 1, alignItems: textAlign }}>
            <Text
              {...this.props}>
              {this.props.children}
            </Text>
          </View>
    }
}

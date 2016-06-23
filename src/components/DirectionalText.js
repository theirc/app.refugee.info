import React, { Component, PropTypes } from 'react';
import { Text, Image, View } from 'react-native';
import { connect } from 'react-redux';
import { Avatar, Drawer, Divider, COLOR, TYPO } from 'react-native-material-design';

import { typography } from 'react-native-material-design-styles';

import { I18n, CountryHeaders } from '../constants';
import {capitalize} from '../utils/helpers';
import DrawerCommons from '../utils/DrawerCommons';

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

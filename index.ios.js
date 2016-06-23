import {
    AppRegistry,
    Text,
    View,
    Navigator,
    StatusBar
} from 'react-native';
import React, {Component, PropTypes} from 'react';
import Navigation from './src/scenes/Navigation';
import Navigate from './src/utils/Navigate';
import { Toolbar } from './src/components';
import Drawer from 'react-native-drawer'
import {Provider} from 'react-redux';
import store from './src/store';
import styles from './src/styles';

import Skeleton from './src/scenes/Skeleton'

class RefugeeInfoApp extends Component {

    render() {
      return <Provider store={store}><Skeleton /></Provider>
    }
}

AppRegistry.registerComponent('RefugeeInfoApp', () => RefugeeInfoApp);

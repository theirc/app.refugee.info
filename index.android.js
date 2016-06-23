import Navigate from './src/utils/Navigate';
import { Toolbar } from './src/components';
import Navigation from './src/scenes/Navigation';
import React, { Component } from 'react';
import {
    AppRegistry,
    Navigator,
    DrawerLayoutAndroid,
    View
} from 'react-native';
import {Provider} from 'react-redux';
import store from './src/store';
import styles from './src/styles';
import { fetchRegionFromStorage } from './src/actions/region';

import Skeleton from './src/scenes/Skeleton'

class RefugeeInfoApp extends Component {

    render() {
        return <Provider store={store}><Skeleton /></Provider>
    }
}

AppRegistry.registerComponent('RefugeeInfoApp', () => RefugeeInfoApp);

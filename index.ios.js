import {
    AppRegistry
} from 'react-native';
import React, {Component} from 'react';
import {Provider} from 'react-redux';
import store from './src/store';
import Skeleton from './src/scenes/Skeleton';

class RefugeeInfoApp extends Component {

    render() {
        return <Provider store={store}><Skeleton /></Provider>;
    }
}

AppRegistry.registerComponent('RefugeeInfoApp', () => RefugeeInfoApp);

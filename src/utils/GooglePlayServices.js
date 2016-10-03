import {Platform, StyleSheet, Dimensions} from 'react-native';
import { NativeModules } from 'react-native';

var native =  NativeModules.GooglePlayServices;

async function checkPlayServices() {
    if(Platform.OS === 'android') {
        return await native.checkPlayServices();
    } else {
        return false;
    }
}

module.exports = {
    checkPlayServices
};
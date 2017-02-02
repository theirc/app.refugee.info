import {Platform} from 'react-native';
import {NativeModules} from 'react-native';

const native = NativeModules.GooglePlayServices;

async function checkPlayServices() {
    if (Platform.OS === 'android') {
        return await native.checkPlayServices();
    } else {
        return false;
    }
}

module.exports = {
    checkPlayServices
};
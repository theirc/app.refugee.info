import React from 'react';
import {View} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';

export default () => {
    return (
        <View style={{ flex: 1 }}>
            <Spinner
                overlayColor="#EEE"
                visible
            />
        </View>
    );
};

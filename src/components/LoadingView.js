import React from 'react';
import {View} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';

export default () => {
    return (
        <View>
            <Spinner
                overlayColor={'rgba(0,0,0,0.2)'}
                color="black"
                visible
            />
        </View>
    );
};

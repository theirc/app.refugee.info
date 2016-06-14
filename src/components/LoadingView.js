import React from 'react';
import {View} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';

export default () => {
    return (
        <View>
            <Spinner
                ref={'loadingSpinner'}
                overlayColor={'rgba(0,0,0,0.25)'}
                color="black"
                visible
            />
        </View>
    );
};

import React from 'react';
import {WebView, requireNativeComponent, Platform} from 'react-native';

if (Platform.OS !== 'ios') {
    requireNativeComponent('RCTExtendedWebView', WebView);
}

export default WebView;

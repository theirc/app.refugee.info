import React from 'react';
import {WebView} from 'react-native';
import requireNativeComponent from 'requireNativeComponent';

requireNativeComponent('RCTExtendedWebView', WebView);

export default WebView;
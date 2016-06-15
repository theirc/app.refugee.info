import React from 'react';
import {WebView, requireNativeComponent} from 'react-native';

requireNativeComponent('RCTExtendedWebView', WebView);

export default WebView;

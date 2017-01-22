import React, { Component, PropTypes } from 'react';
import { View, Linking, Platform, WebView, TouchableOpacity, AsyncStorage, Dimensions, StyleSheet } from 'react-native';
import { wrapHtmlContent } from '../utils/htmlUtils';
import styles, {
    themes,
    getElevation,
    isStatusBarTranslucent
} from '../styles';
import { connect } from 'react-redux';
import { MapButton, Icon, DirectionalText } from '../components';
import { getAllUrlParams } from '../utils/helpers';
import I18n from '../constants/Messages';
import Share from 'react-native-share';
import { WEB_PATH } from '../constants';
import ApiClient from '../utils/ApiClient';
import { Actions } from 'react-native-router-flux';
let DeviceInfo = require('react-native-device-info');


const {width, height} = Dimensions.get('window');

export class MicroApp extends Component {
    static backButton = true;

    static contextTypes = {
        drawer: PropTypes.object
    };
    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        language: PropTypes.string,
        region: PropTypes.object,
        app: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.webView = null;
        this.apiClient = new ApiClient(this.context, props);
        this.state = {
            loading: true,
            source: false,
            navigating: false
        };
    }

    componentDidMount() {
        let {app} = this.props;

        Actions.refresh({ title: app.name });
    }

    onMessage(event) {
        let {dispatch} = this.props;

        if (event.nativeEvent.data) {
            let data = JSON.parse(event.nativeEvent.data);
            if (data && data.action) {
                let func = this.bridgedFunctions[data.action];
                func.apply(this, data.arguments);
            }
        }
    }

    bridgedFunctions = {
        openDrawer: () => {
            this.context.drawer.open();
        },
        info: () => {
            Actions.info();
        },
        serviceList: () => {
            Actions.serviceList();
        },
        serviceMap: () => {
            Actions.serviceMap();
        }
    }


    webViewReady() {
        let isTranslucent = isStatusBarTranslucent();
        let platform = Platform.OS;
        let deviceId = DeviceInfo.getUniqueID();
        let {region, language} = this.props;

        if (this.webView) {
            this.webView.postMessage(JSON.stringify({
                action: 'init',
                arguments: [region, language, deviceId, platform, isTranslucent]
            }));
        }
    }

    postMessage = () => {
        if (this.webView) {
            this.webView.postMessage("Post message from react native");
        }
    }

    render() {
        let {app} = this.props;
        let url = `${app.app_base_url}`;

        this.webView = <WebView
            ref="webView"
            onMessage={this.onMessage.bind(this)}
            scalesPageToFit={false}
            ref={(v) => this.webView = v}
            source={{ uri: url }}
            domStorageEnabled={true}
            onLoadEnd={() => this.webViewReady()}
            />;
        return (<View
            style={componentStyles.microAppContainer}>
            <View style={{ flex: 1 }}>
                {this.webView}
            </View>
        </View>);
    }
}


const componentStyles = StyleSheet.create({
    microAppContainer: {
        flex: 1,
        position: 'absolute',
        top: 0,
        left: 0,
        width,
        height
    }
});


const mapStateToProps = (state) => {
    return {
        ...state
    };
};
export default connect(mapStateToProps)(MicroApp);

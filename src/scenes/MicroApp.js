import React, {Component, PropTypes} from 'react';
import {View, Platform, WebView, Dimensions, StyleSheet} from 'react-native';
import {
    isStatusBarTranslucent
} from '../styles';
import {connect} from 'react-redux';
import ApiClient from '../utils/ApiClient';
import {Actions} from 'react-native-router-flux';
import {Presence} from '../data';


const {width, height} = Dimensions.get('window');

export class MicroApp extends Component {
    static backButton = true;

    static contextTypes = {
        drawer: PropTypes.object
    };
    static propTypes = {
        app: PropTypes.object.isRequired,
        dispatch: PropTypes.func.isRequired,
        language: PropTypes.string,
        region: PropTypes.object
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
        this.onMessage = this.onMessage.bind(this);
    }

    componentDidMount() {
        let {app} = this.props;

        Actions.refresh({title: app.name});
    }

    onMessage(event) {
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
            Actions.service({list: true});
        },
        serviceMap: () => {
            Actions.service({map: true});
        }
    };


    webViewReady() {
        let isTranslucent = isStatusBarTranslucent();
        let platform = Platform.OS;
        let deviceId = Presence.getDeviceToken();
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
            this.webView.postMessage('Post message from react native');
        }
    };

    render() {
        let {app} = this.props;
        let url = `${app.app_base_url}`;

        this.webView = (
            <WebView
                domStorageEnabled={true}
                onLoadEnd={() => this.webViewReady()}
                onMessage={this.onMessage}
                ref={(v) => this.webView = v}
                scalesPageToFit={false}
                source={{uri: url}}
            />);
        return (
            <View
                style={componentStyles.microAppContainer}
            >
                <View style={{flex: 1}}>
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

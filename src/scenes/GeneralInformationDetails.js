import React, { Component } from 'react';
import {View, Text, TextInput, AsyncStorage, Linking} from 'react-native';
import WebView from '../nativeComponents/android/ExtendedWebView';
import { wrapHtmlContent } from '../utils/htmlUtils'
import styles from '../styles';
import I18n from '../constants/Messages';

var WEBVIEW_REF = 'webview';
export default class GeneralInformationDetails extends Component {

    static propTypes = {
        section: React.PropTypes.string.isRequired
    };

    constructor(props) {
        super(props);
        this.webView = null;
        this.state = {
            languageCode: false
        };
    }

    componentDidMount() {
        this._loadInitialState();
    }

    async _loadInitialState() {
        var languageCode = await AsyncStorage.getItem('langCode');
        this.setState({
          languageCode: languageCode || 'en',
          loading: true
        });
    }


    _onChangeText(text) {
    }

    _onNavigationStateChange(state) {
        if(this.state.loading) {
          console.log('Loading...');

          this.setState({ loading:false });
          return;
        }

        // Opening all links in the external browser except for the internal links
        let url = state.url;

        if (url.indexOf('refugeeinfo') > -1 || url.indexOf('refugee.info') > -1) {
          url = url.substr(url.indexOf('://') + 3);
          url = url.substr(url.indexOf('/'));
        }

        if(this.webView) {
          this.webView.stopLoading();

          if (url.indexOf('/') == 0) {
              // If we get to this point, we need to point to the app
              console.log('DEEPLINK ME!');
          } else {
              Linking.openURL(state.url);
          }
        }
    }

    render() {
        if(!this.state.languageCode) {
          return <View />;
        }

        let source = {
          html: wrapHtmlContent(this.props.section, this.state.languageCode)
        };
        return (
            <View style={styles.container}>
                <View style={styles.stickyInputContainer}>
                    <TextInput
                        onChangeText={(text) => this._onChangeText(text)}
                        placeholder={I18n.t('SEARCH')}
                        style={styles.stickyInput}
                        returnKeyType={'search'}
                        autoCapitalize="none"
                        autoCorrect={false}
                        clearButtonMode="always"
                    />
                </View>
                <WebView ref={(v) => this.webView = v}
                    onNavigationStateChange={(s) => this._onNavigationStateChange(s)}
                    source={source}
                />
                </View>
        );
    }
}

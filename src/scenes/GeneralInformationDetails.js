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
            loading: false,
            source: false,
        };
    }

    componentDidMount() {
        this._loadInitialState();
    }

    async _loadInitialState() {
        var languageCode = await AsyncStorage.getItem('langCode');

        let source = {
          html: wrapHtmlContent(this.props.section, languageCode)
        };

        this.setState({
          source: source
        });
    }


    async _onChangeText(text) {
        // TODO: Refactor this searches all of the text including tags

        if(text.length < 5) {
          return;
        }
        var languageCode = await AsyncStorage.getItem('langCode');

        let reg = new RegExp(`(${text})`, 'ig');
        section = (reg) ? this.props.section.replace(reg, '<mark>$1</mark>') : this.props.section;

        let source = {
          html: wrapHtmlContent(section, languageCode)
        };

        this.setState({
          source: source
        });
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
        if(!this.state.source) {
          return <View />;
        }

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
                    source={this.state.source}
                />
                </View>
        );
    }
}

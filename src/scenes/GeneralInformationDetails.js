import React, { Component } from 'react';
import {View, Text, TextInput, AsyncStorage, Linking} from 'react-native';
import WebView from '../nativeComponents/android/ExtendedWebView';
import { wrapHtmlContent } from '../utils/htmlUtils'
import styles from '../styles';
import I18n from '../constants/Messages';
import { connect } from 'react-redux';
import { MapButton, OfflineView } from '../components';

var WEBVIEW_REF = 'webview';
export class GeneralInformationDetails extends Component {

    static propTypes = {
        title: React.PropTypes.string.isRequired,
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

    _loadInitialState() {
        const {section, title, language, theme} = this.props;

        let source = {
          html: wrapHtmlContent(section, language, title, theme)
        };

        this.setState({
          source: source
        });
    }


    _onChangeText(text) {
        // TODO: Refactor this searches all of the text including tags

        const {title, language, theme} = this.props;

        if(text.length < 5) {
          return;
        }

        let reg = new RegExp(`(${text})`, 'ig');
        section = (reg) ? this.props.section.replace(reg, '<mark>$1</mark>') : this.props.section;

        let source = {
          html: wrapHtmlContent(section, language, title, theme)
        };

        this.setState({
          source: source
        });
    }

    _onNavigationStateChange(state) {
        // Opening all links in the external browser except for the internal links
        let url = state.url;

        if (url.indexOf('refugeeinfo') > -1 || url.indexOf('refugee.info') > -1) {
          url = url.substr(url.indexOf('://') + 3);
          url = url.substr(url.indexOf('/'));
        }

        if(this.webView) {
          if(state.navigationType && state.navigationType === 'click') {
            // Image are loaded using this method. So this narrows down to prevent all clicks.
            this.webView.stopLoading();
          }

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
                <MapButton direction={this.props.direction} />
                </View>
        );
    }
}


const mapStateToProps = (state) => {
    return {
        primary: state.theme.primary,
        language: state.language,
        theme: state.theme.theme,
        direction: state.direction
    };
};

export default connect(mapStateToProps)(GeneralInformationDetails);

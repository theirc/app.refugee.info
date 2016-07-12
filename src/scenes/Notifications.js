import React, {Component, PropTypes} from 'react';
import {
    View,
    Text,
    ListView,
    RefreshControl,
    StyleSheet,
    TouchableHighlight,
    AsyncStorage,
    TextInput,
    Image,
    WebView
} from 'react-native';
import I18n from '../constants/Messages';
import ApiClient from '../utils/ApiClient';
import ServiceCommons from '../utils/ServiceCommons';
import MapButton from '../components/MapButton';
import {OfflineView, SearchBar, SearchFilterButton} from '../components';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import InfiniteScrollView from 'react-native-infinite-scroll-view';
import {Regions, Services} from '../data';
import styles, {themes, getUnderlayColor, getFontFamily, getRowOrdering, getAlignItems} from '../styles';
import {wrapHtmlContent} from '../utils/htmlUtils'

var _ = require('underscore');


export class Notifications extends Component {
    render() {
        if (!this.props.region) {
            return <View />
        }
        const {language, theme} = this.props;

        let backgroundColor = theme == 'light' ? themes.light.backgroundColor : themes.dark.backgroundColor;
        let webViewStyle = { backgroundColor: backgroundColor, opacity: 1 };
        let html = this.props.region.metadata.banners.map((b, i) => `<div class="banner">${b}</div>`).join('<br />');
        let source = {
            html: wrapHtmlContent(html, language, '', theme)
        };

        return <View style={styles.container}>
            <WebView ref={(v) => this.webView = v}
                style={webViewStyle}
                source={source}
                />
        </View>;
    }
}

function mapStateToProps(state) {
    return {
        theme: state.theme,
        language: state.language,
        region: state.region,
    }
}

export default connect(mapStateToProps)(Notifications);
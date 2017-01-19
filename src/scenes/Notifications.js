import React, {Component} from 'react';
import {
    View,
    WebView
} from 'react-native';
import {connect} from 'react-redux';
import styles from '../styles';
import {wrapHtmlContent} from '../utils/htmlUtils';


export class Notifications extends Component {
    render() {
        const {language, region} = this.props;
        if (!region) {
            return <View />;
        }
        let html = region.banners.map((banner) => `<div class="banner">${banner.html}</div>`).join('<br />');
        let source = {
            html: wrapHtmlContent(html, language, '', 'light')
        };
        return (
            <View style={styles.container}>
                <WebView source={source} />
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        language: state.language,
        region: state.region
    };
}

export default connect(mapStateToProps)(Notifications);
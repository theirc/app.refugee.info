import React, { Component } from 'react';
import {View, AsyncStorage} from 'react-native';
import WebView from '../nativeComponents/android/ExtendedWebView';
import { wrapHtmlContent } from '../utils/htmlUtils'

export default class GeneralInformationDetails extends Component {

    static propTypes = {
        section: React.PropTypes.string.isRequired
    };

    constructor(props) {
        super(props);
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
          languageCode: languageCode || 'en'
        });
    }

    render() {
        if(!this.state.languageCode) {
          return <View />;
        }

        let source = {
          html: wrapHtmlContent(this.props.section, this.state.languageCode)
        };
        return (
            <View style={{height: 600}}>
                <WebView
                    source={source}
                    style={{marginBottom: 50}}
                />
            </View>
        );
    }
}

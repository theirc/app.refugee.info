import React, { Component } from 'react';
import {View, WebView} from 'react-native';


export default class GeneralInformationDetails extends Component {

    static propTypes = {
        section: React.PropTypes.string.isRequired
    };

    render() {
        return (
            <View style={{height: 600}}>
                <WebView
                    source={{html: this.props.section}}
                    style={{marginBottom: 50}}
                />
            </View>
        );
    }
}

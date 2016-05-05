import React, { Component } from 'react';
import {View, WebView} from 'react-native';


export default class GeneralInformationDetails extends Component {
    render() {
        return (
            <View style={{height: 600}}>
                <WebView style={{marginBottom: 50}} source={{html: this.props.section}}/>
            </View>
        )
    }
}

import React, {Component, PropTypes, View, WebView} from 'react-native';


export default class GeneralInformationDetails extends Component {
    render() {
        return (
            <View style={{height: 600}}>
                <WebView source={{html: this.props.section}}/>
            </View>
        )
    }
}

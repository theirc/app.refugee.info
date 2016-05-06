import React, {Component} from 'react';
import {PropTypes, View, ScrollView, Text, AsyncStorage, StyleSheet} from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import WebView from '../nativeComponents/android/ExtendedWebView';

export default class GeneralInformation extends Component {

    static contextTypes = {
        navigator: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            content: []
        };
    }

    componentDidMount() {
        this._loadInitialState();
    }

    async _loadInitialState() {
        let region = JSON.parse(await AsyncStorage.getItem('region'));
        if (!region) {
            return;
        }
        this.setState({
            content: region.content
        });
    }

    onClick(title, section) {
        const {navigator} = this.context;
        navigator.forward(null, title, {section}, this.state);
    }

    _renderHeader(section) {
        return (
            <View style={styles.header}>
                <Text style={styles.headerText}>{section.title}</Text>
            </View>
        );
    }

    _renderContent(section) {
        return (
            <View style={styles.content}>
                <WebView
                    contentInset={{left: 10, bottom: 30}}
                    source={{html: section.section}}
                />
            </View>
        );
    }

    render() {
        return (
            <ScrollView style={styles.container}>
                <Accordion
                    duration={400}
                    renderContent={this._renderContent}
                    renderHeader={this._renderHeader}
                    sections={this.state.content}
                />
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column'
    },
    listViewContainer: {
        flex: 1,
        flexDirection: 'column'
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'column',
        padding: 15,
        backgroundColor: '#EEE'
    },
    title: {
        textAlign: 'center',
        fontSize: 22,
        fontWeight: '300',
        marginBottom: 20
    },
    header: {
        backgroundColor: '#F5FCFF',
        padding: 10
    },
    headerText: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '500'
    },
    content: {
        flex: 1,
        paddingRight: 60,
        paddingLeft: 30,
        backgroundColor: '#fff',
        height: 500
    }
});

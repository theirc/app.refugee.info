import React, { Component } from 'react';
import {PropTypes, View, Text, AsyncStorage, StyleSheet, ListView, TouchableHighlight} from 'react-native';

export default class GeneralInformation extends Component {

    static contextTypes = {
        navigator: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2
            })
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
            dataSource: this.state.dataSource.cloneWithRows(region.content)
        });
    }

    onClick(title, section) {
        const { navigator } = this.context;
        navigator.forward(null, title, {section}, this.state);
    }

    renderRow(rowData) {
        return (
            <TouchableHighlight
                onPress={this.onClick.bind(this, rowData.title, rowData.section)}
                style={styles.buttonContainer}
                underlayColor="white"
            >
                <Text>{rowData.title}</Text>
            </TouchableHighlight>
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <ListView
                    dataSource={this.state.dataSource}
                    enableEmptySections
                    renderRow={this.renderRow.bind(this)}
                    style={styles.listViewContainer}
                />
            </View>
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
    }
});

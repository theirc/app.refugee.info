import React, { Component, PropTypes } from 'react';
import { View, ListView, StyleSheet, Text, TouchableHighlight } from 'react-native';


export default class LocationListView extends Component {

    static contextTypes = {
        navigator: PropTypes.object.isRequired
    };

    static propTypes = {
        header: PropTypes.string.isRequired,
        onPress: PropTypes.func.isRequired,
        rows: PropTypes.arrayOf(React.PropTypes.shape({
            id: PropTypes.number,
            name: PropTypes.string.isRequired
        }))
    };

    constructor(props) {
        super(props);
        this.dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1.id !== row2.id
        });
    }

    renderHeader() {
        return (
            <View style={styles.header}>
              <Text style={styles.headerText}>{this.props.header}</Text>
            </View>
          );
    }

    renderRow(rowData) {
        return (
            <TouchableHighlight
                onPress={() => this.props.onPress(rowData)}
                style={styles.buttonContainer}
                underlayColor="white"
            >
                <Text style={styles.buttonText}>{rowData.name[0].toLocaleUpperCase() + rowData.name.slice(1)}</Text>
            </TouchableHighlight>
        );
    }

    render() {
        if (this.props.rows.length === 0) {
            return (
                <Text
                    style={styles.container}>
                        There are no locations
                </Text>
            );
        } else {
            return (
                <ListView
                    style={styles.container}
                    dataSource={this.dataSource.cloneWithRows(this.props.rows)}
                    enableEmptySections
                    renderHeader={() => this.renderHeader()}
                    renderRow={(rowData) => this.renderRow(rowData)}
                />
            );
        }

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 0.59,
        flexDirection: 'column',
        backgroundColor: '#F5F5F5'
    },
    listViewContainer: {
        flex: 1,
        flexDirection: 'column'
    },
    header : {
        flex: 1,
        backgroundColor: '#F5F5F5',
        padding: 15,
    },
    headerText : {
        flex: 1,
        backgroundColor: '#F5F5F5',
        fontWeight: 'bold',
        fontSize: 15,
        color: '#313131',
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'column',
        padding: 15,
        backgroundColor: '#F5F5F5',
    },
    buttonText: {
        color: '#555556',
        fontWeight: 'bold',
    }
});

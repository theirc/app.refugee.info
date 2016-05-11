import React, { Component, PropTypes } from 'react';
import { ListView, StyleSheet, Text, TouchableHighlight } from 'react-native';


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
        return (<Text>{this.props.header}</Text>);
    }

    renderRow(rowData) {
        return (
            <TouchableHighlight
                onPress={() => this.props.onPress(rowData)}
                style={styles.buttonContainer}
                underlayColor="white"
            >
                <Text>{rowData.name[0].toLocaleUpperCase() + rowData.name.slice(1)}</Text>
            </TouchableHighlight>
        );
    }

    render() {
        if (this.props.rows.length === 0) {
            return (
                <Text>There are no locations</Text>
            );
        } else {
            return (
                <ListView
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
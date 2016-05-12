import React, { Component, PropTypes } from 'react';
import { View, ListView, StyleSheet, Text, TouchableHighlight } from 'react-native';
import Button  from 'react-native-button';


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
        this.state = {
            selected: null
        };
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
        const buttonContainerStyle = {
            flex: 1,
            flexDirection: 'column',
            padding: 15,
            backgroundColor: (this.state.selected && rowData.id === this.state.selected.id) ? 'white' : '#F5F5F5'
        };
        return (
            <TouchableHighlight
                onPress={() => this.setState({selected: rowData})}
                style={buttonContainerStyle}
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
                    style={styles.container}
                >
                        There are no locations
                </Text>
            );
        } else {
            return (
                <View style={styles.container}>
                    <ListView
                        dataSource={this.dataSource.cloneWithRows(this.props.rows)}
                        enableEmptySections
                        renderHeader={() => this.renderHeader()}
                        renderRow={(rowData) => this.renderRow(rowData)}
                        style={styles.container}
                    />
                    <View style={styles.selectBlockWrapper}>
                        <View style={styles.selectLeft} />
                        <View style={styles.selectWrapper}>
                            <Button
                                containerStyle={styles.selectContainer}
                                disabled={this.state.selected === null}
                                onPress={() => this.props.onPress(this.state.selected)}
                                style={styles.select}
                            >
                                Submit
                            </Button>
                        </View>
                        <View style={styles.selectRight} />
                    </View>
                 </View>
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
        padding: 15
    },
    headerText : {
        flex: 1,
        backgroundColor: '#F5F5F5',
        fontWeight: 'bold',
        fontSize: 15,
        color: '#313131'
    },
    buttonText: {
        color: '#555556',
        fontWeight: 'bold'
    },
    selectBlockWrapper: {
        backgroundColor: '#F5F5F5',
        flex: 0.08,
        flexDirection: 'row'
    },
    selectWrapper: {
        flex: 0.2
    },
    selectLeft: {
        flex: 0.79
    },
    selectRight: {
        flex: 0.01
    },
    select: {
        flex: 0.05,
        color: 'white',
        fontSize: 14
    },
    selectContainer: {
        padding: 7,
        overflow: 'hidden',
        borderRadius: 20,
        backgroundColor: '#606060',
        marginTop: 3
    }
});

import React, { Component, PropTypes } from 'react';
import { View, ListView, StyleSheet, Text, TouchableHighlight } from 'react-native';
import { Button } from 'react-native-material-design';

import { default as Icon } from 'react-native-vector-icons/FontAwesome';
import I18n from '../constants/Messages';


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
        let buttonIsSelectedStyle;
        let buttonIsSelectedTextStyle;

        if (this.state.selected && rowData.id === this.state.selected.id) {
            buttonIsSelectedStyle = styles.buttonContainerSelected;
            buttonIsSelectedTextStyle = styles.buttonTextSelected;
        }
        else {
            buttonIsSelectedStyle = styles.buttonContainerNormal;
            buttonIsSelectedTextStyle = styles.buttonTextNormal;
        }

        return (
            <TouchableHighlight
                onPress={() => {
                    if (this.state.selected && this.state.selected.id === rowData.id) {
                        this.setState({selected: null});
                    } else {
                        this.setState({selected: rowData});
                    }
                }}
                style={[styles.buttonContainer, buttonIsSelectedStyle]}
                underlayColor="white"
            >
                <View style={{flex: 1, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between'}}>
                    <Text style={[styles.buttonText, buttonIsSelectedTextStyle]}>
                        {rowData.name[0].toLocaleUpperCase() + rowData.name.slice(1)}
                    </Text>
                    {(this.state.selected && this.state.selected.id === rowData.id) ?
                        <Icon
                            color="black"
                            name="check"
                            size={16}
                            style={{justifyContent: 'flex-end'}}
                        /> : null}
                </View>
            </TouchableHighlight>
        );
    }

    render() {
        if (this.props.rows.length === 0) {
            return (
                <View style={styles.noLocationsContainer}>
                    <Text
                        style={styles.noLocationsText}
                    >
                            There are no locations
                    </Text>
                </View>
            );
        } else {
            return (
                <View style={styles.container}>
                    <ListView
                        dataSource={this.dataSource.cloneWithRows(this.props.rows)}
                        enableEmptySections
                        renderHeader={() => this.renderHeader()}
                        renderRow={(rowData) => this.renderRow(rowData)}
                        style={styles.listViewContainer}
                    />
                    <View style={styles.selectBlockWrapper}>
                        <View style={styles.selectLeft} />
                        <View style={styles.selectWrapper}>
                            <Button
                                text={I18n.t('SELECT')}
                                raised={true}
                                disabled={this.state.selected === null}
                                onPress={() => this.props.onPress(this.state.selected)}
                            />
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
        flex: 0.67,
        flexDirection: 'column',
        backgroundColor: '#F5F5F5'
    },
    noLocationsContainer: {
        flex: 0.67,
        flexDirection: 'column',
        backgroundColor: '#F5F5F5'
    },
    listViewContainer: {
        flex: 0.88,
        flexDirection: 'column'
    },
    header: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        padding: 15
    },
    headerText: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        fontWeight: 'bold',
        fontSize: 15,
        color: '#313131'
    },
    noLocationsText: {
        flex: 1,
        fontWeight: 'bold',
        fontSize: 15,
        color: '#313131',
        textAlign: 'center',
        marginTop: 12
    },
    buttonText: {
        fontWeight: 'bold'
    },
    selectBlockWrapper: {
        flex: 0.12,
        backgroundColor: '#F5F5F5',
        flexDirection: 'row'
    },
    selectWrapper: {
        flex: 0.2
    },
    selectLeft: {
        flex: 0.59
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
    },
    selectDisabled: {
        color: '#c0c0c0'
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'column',
        padding: 15
    },
    buttonContainerSelected: {
        backgroundColor: '#E1E0E0'
    },
    buttonContainerNormal: {
        backgroundColor: '#F5F5F5'
    },
    buttonTextNormal: {
        color: '#555556'
    },
    buttonTextSelected: {
        color: '#313131'
    }
});

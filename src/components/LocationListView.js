import React, { Component, PropTypes } from 'react';
import { View, ListView, StyleSheet, Text, TouchableHighlight, Image } from 'react-native';
import { Button } from 'react-native-material-design';

import { default as Icon } from 'react-native-vector-icons/FontAwesome';
import I18n from '../constants/Messages';
import { connect } from 'react-redux';


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
        })),
        image: PropTypes.func
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
        let buttonIsSelected = (this.state.selected && this.state.selected.id === rowData.id);
        let image = null;
        if (this.props.image) {
            image = this.props.image(rowData.name);
        }
        return (
            <TouchableHighlight
                onPress={() => {
                    if (buttonIsSelected) {
                        this.setState({selected: null});
                    } else {
                        this.setState({selected: rowData});
                    }
                }}
                style={[styles.buttonContainer, buttonIsSelected?
                                                    styles.buttonContainerSelected : '']}
                underlayColor="white"
            >
                <View style={styles.rowWrapper}>
                    <View style={styles.rowHeader}>
                        {image &&
                        <Image
                            source={image}
                            style={styles.image}
                        />}
                        <Text style={[styles.buttonText, buttonIsSelected?
                                                            styles.buttonTextSelected : '']}>
                            {rowData.name[0].toLocaleUpperCase() + rowData.name.slice(1)}
                        </Text>
                    </View>
                    {(buttonIsSelected) ?
                        <Icon
                            color="black"
                            name="check"
                            size={16}
                            style={styles.icon}
                        /> : null}
                </View>
            </TouchableHighlight>
        );
    }

    render() {
        const primary = this.props.primary;
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
                                primary={primary}
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


const mapStateToProps = (state) => {
    return {
        primary: state.theme.primary
    };
};

export default connect(mapStateToProps)(LocationListView);


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
        fontWeight: 'bold',
        color: '#555556'
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
        padding: 15,
        backgroundColor: '#F5F5F5'
    },
    buttonContainerSelected: {
        backgroundColor: '#E1E0E0'
    },
    buttonTextSelected: {
        color: '#313131'
    },
    icon: {
        justifyContent: 'flex-end'
    },
    rowWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    rowHeader: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    image: {
        marginRight: 5
    }
});

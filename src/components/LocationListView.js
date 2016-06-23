import React, { Component, PropTypes } from 'react';
import { View, ListView, StyleSheet, Text, TouchableHighlight, Image } from 'react-native';
import { Button } from 'react-native-material-design';
import { default as Icon } from 'react-native-vector-icons/FontAwesome';
import I18n from '../constants/Messages';
import { connect } from 'react-redux';
import LoadingView from '../components/LoadingView';
import styles from '../styles';

export default class LocationListView extends Component {

    static contextTypes = {
        navigator: PropTypes.object.isRequired
    };

    static propTypes = {
        header: PropTypes.string.isRequired,
        image: PropTypes.func,
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
        let buttonIsSelected = (this.state.selected && this.state.selected.id === rowData.id);
        let image = null;
        if (this.props.image) {
            image = this.props.image(rowData.code);
        }
        return (
            <TouchableHighlight
                onPress={() => {
                   this.props.onPress(rowData)
                }}
                style={[styles.buttonContainer]}
                underlayColor="white" >
                <View style={styles.rowWrapper}>
                    <View style={styles.rowHeader}>
                        {image &&
                        <Image
                            source={image}
                            style={styles.countryFlag}
                        />}
                        <Text style={[styles.buttonText, buttonIsSelected ? styles.buttonTextSelected : '']}>
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

        if (this.props.rows.length === 0 && this.props.loaded) {
            return (
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.headerText}>{I18n.t('NO_LOCATIONS_FOUND')}</Text>
                    </View>
                </View>
            );
        }
        else if (!this.props.rows.length && !this.props.loaded) {
            return (
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.headerText}>{I18n.t('LOADING_LOCATIONS')}</Text>
                    </View>
                </View>
            );
        }
        else {
            return (
                <View style={styles.container}>
                    <ListView
                        dataSource={this.dataSource.cloneWithRows(this.props.rows)}
                        enableEmptySections
                        renderHeader={() => this.renderHeader()}
                        renderRow={(rowData) => this.renderRow(rowData)}
                        style={styles.listViewContainer}
                    />
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

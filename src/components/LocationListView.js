import React, {Component, PropTypes} from 'react';
import {View, ListView, StyleSheet, Text, TouchableHighlight, Image} from 'react-native';
import {Button, Divider} from 'react-native-material-design';
import {default as Icon} from 'react-native-vector-icons/FontAwesome';

import {I18n, CountryHeaders} from '../constants';
import {LoadingView, DirectionalText} from '../components';
import styles from '../styles';
import {connect} from 'react-redux';

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
        let {direction} = this.props;
        if (!direction) {
            direction = 'ltr';
        }
        return (
            <View style={styles.header}>
                <DirectionalText direction={direction} style={styles.headerText}>{this.props.header}</DirectionalText>
            </View>
        );
    }

    renderRow(rowData) {
        let buttonIsSelected = (this.state.selected && this.state.selected.id === rowData.id);
        let image = null;
        if (this.props.image) {
            image = this.props.image(rowData.code);
        }
        let {direction, theme} = this.props;
        if (!(direction || false)) {
            direction = 'ltr';
        }

        const imageElement = (image && <Image
            source={image}
            style={styles.countryFlag}
        />);

        return (
            <View>
                <TouchableHighlight
                    onPress={() => {
                   this.props.onPress(rowData)
                }}
                    style={styles.buttonContainer}
                    underlayColor={theme == 'light' ? 'rgba(72, 133, 237, 0.2)' : 'rgba(0, 0, 0, 0.1)'}
                >
                    <View style={styles.locationListItem}>
                        <View style={styles.rowHeader}>
                            {direction === 'ltr' && imageElement }
                            <DirectionalText
                                direction={direction}
                                style={[styles.buttonText, buttonIsSelected ? styles.buttonTextSelected : '']}
                            >
                                {rowData.pageTitle || rowData.metadata.page_title}
                            </DirectionalText>
                            {direction === 'rtl' && imageElement }
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
                <Divider />
            </View>
        );
    }

    render() {
        const primary = this.props.primary;
        let {direction} = this.props;
        if (!(direction || false)) {
            direction = 'ltr';
        }

        if (this.props.rows.length === 0 && this.props.loaded) {
            return (
                <View style={styles.container}>
                    <View style={styles.header}>
                        <DirectionalText direction={direction}
                                         style={styles.headerText}>{I18n.t('NO_LOCATIONS_FOUND')}</DirectionalText>
                    </View>
                </View>
            );
        }
        else if (!this.props.rows.length && !this.props.loaded) {
            return (
                <View style={styles.container}>
                    <View style={styles.header}>
                        <DirectionalText direction={direction}
                                         style={styles.headerText}>{I18n.t('LOADING_LOCATIONS')}</DirectionalText>
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
        primary: state.theme.primary,
        direction: state.direction,
        language: state.language,
        theme: state.theme.theme
    };
};

export default connect(mapStateToProps)(LocationListView);

import React, {Component, PropTypes} from 'react';
import {View, ListView, StyleSheet, Text, TouchableHighlight, Image} from 'react-native';
import {Button, Divider} from 'react-native-material-design';
import {default as Icon} from 'react-native-vector-icons/FontAwesome';

import {I18n, CountryHeaders} from '../constants';
import {LoadingView, DirectionalText} from '../components';
import styles, {getUnderlayColor, generateTextStyles} from '../styles';
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
        })),
        theme: PropTypes.oneOf(['light', 'dark'])
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

    renderHeader(custom_header_text=null) {
        let {direction, theme} = this.props;
        if (!direction) {
            direction = 'ltr';
        }
        return (
            <View style={[
                    styles.viewHeaderContainer,
                    theme=='dark' ? styles.viewHeaderContainerDark : styles.viewHeaderContainerLight
                ]}
            >
                <Text
                    style={[
                        styles.viewHeaderText,
                        theme=='dark' ? styles.viewHeaderTextDark : styles.viewHeaderTextLight
                    ]}
                >
                    {custom_header_text ? custom_header_text.toUpperCase() : this.props.header.toUpperCase()}
                </Text>
            </View>
        );
    }

    renderRow(rowData) {
        let buttonIsSelected = (this.state.selected && this.state.selected.id === rowData.id);
        let image = null;
        if (this.props.image) {
            image = this.props.image(rowData.code);
        }
        let {direction, theme, language} = this.props;
        if (!(direction || false)) {
            direction = 'ltr';
        }

        const imageElement = (image && <Image source={image} style={styles.listItemIcon} />);
        const imageDivider = (image && <View style={[
            styles.dividerAbsolute,
            theme=='dark' ? styles.dividerDark : styles.dividerLight
        ]} />);
        return (
                <TouchableHighlight
                    onPress={() => {this.props.onPress(rowData)}}
                    underlayColor={getUnderlayColor(theme)}
                >
                    <View
                        style={[
                            styles.listItemContainer,
                            theme=='dark' ? styles.listItemContainerDark : styles.listItemContainerLight
                        ]}
                    >
                        { imageElement }
                        { imageDivider }
                        <View style={styles.listItemTextContainer}>
                            <Text style={[
                                styles.listItemText,
                                generateTextStyles(language),
                                theme=='dark' ? styles.textDark : styles.textLight
                            ]}>
                                {rowData.pageTitle || rowData.metadata.page_title}
                            </Text>
                        </View>
                    </View>
                </TouchableHighlight>
        );
    }

    render() {
        const primary = this.props.primary;
        let {direction} = this.props;
        if (!(direction || false)) {
            direction = 'ltr';
        }
        let custom_header_text = null;
        if (this.props.rows.length === 0 && this.props.loaded) {
            custom_header_text = I18n.t('NO_LOCATIONS_FOUND')
        }
        else if (!this.props.rows.length && !this.props.loaded) {
            custom_header_text = I18n.t('LOADING_LOCATIONS');
        }
            return (
                <View style={styles.container}>
                    <ListView
                        dataSource={this.dataSource.cloneWithRows(this.props.rows)}
                        enableEmptySections
                        renderHeader={() => this.renderHeader(custom_header_text)}
                        renderRow={(rowData) => !custom_header_text ? this.renderRow(rowData) : null}
                        style={styles.listViewContainer}
                    />
                </View>
            );
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

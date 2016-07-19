import React, {Component, PropTypes} from 'react';
import {View, ListView, StyleSheet, Text, TouchableHighlight, Image} from 'react-native';
import {I18n} from '../constants';
import styles, {getUnderlayColor, getFontFamily, getRowOrdering} from '../styles';
import {connect} from 'react-redux';
import {ListItem} from '../components';

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
        return (
            <ListItem
                onPress={() => {this.props.onPress(rowData)}}
                image={(this.props.image) ? this.props.image(rowData.code) : null}
                text={rowData.pageTitle || rowData.metadata.page_title || rowData.name}
                centered={true}
            />
        )
    }

    render() {
        let custom_header_text;
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
                        enableEmptySections={true}
                        renderHeader={() => this.renderHeader(custom_header_text)}
                        renderRow={(rowData) => !custom_header_text ? this.renderRow(rowData) : null}
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
        theme: state.theme
    };
};

export default connect(mapStateToProps)(LocationListView);

import React, {Component, PropTypes} from 'react';
import {View, ListView} from 'react-native';
import {I18n} from '../constants';
import styles from '../styles';
import {LocationListItem, DirectionalText} from '../components';

export class LocationListView extends Component {

    static contextTypes = {
        navigator: PropTypes.object.isRequired
    };

    static propTypes = {
        header: PropTypes.string.isRequired,
        loaded: PropTypes.bool,
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

    renderHeader(customHeaderText = null) {
        return (
            <View style={[styles.viewHeaderContainer, styles.viewHeaderContainerLight]}>
                <DirectionalText style={[styles.viewHeaderText, styles.viewHeaderTextLight]}>
                    {customHeaderText ? customHeaderText.toUpperCase() : this.props.header.toUpperCase()}
                </DirectionalText>
            </View>
        );
    }

    renderRow(rowData) {
        return (
            <LocationListItem
                image={rowData.image}
                onPress={rowData.onPress}
                text={rowData.title}
            />
        );
    }

    render() {
        const {loaded} = this.props;
        let customHeaderText;
        if (this.props.rows.length === 0 && loaded) {
            customHeaderText = I18n.t('NO_LOCATIONS_FOUND');
        }
        else if (!this.props.rows.length && !loaded) {
            customHeaderText = I18n.t('LOADING_LOCATIONS');
        }
        return (
            <View style={styles.container}>
                <ListView
                    dataSource={this.dataSource.cloneWithRows(this.props.rows)}
                    enableEmptySections
                    renderHeader={() => this.renderHeader(customHeaderText)}
                    renderRow={(rowData) => this.renderRow(rowData)}
                />
            </View>
        );
    }
}

export default LocationListView;

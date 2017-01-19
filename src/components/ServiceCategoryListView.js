import React, {Component, PropTypes} from 'react';
import {
    View,
    ListView
} from 'react-native';
import {Button, SelectableListItem} from '../components';
import I18n from '../constants/Messages';
import styles from '../styles';

export class ServiceCategoryListView extends Component {

    static propTypes = {
        dataSource: PropTypes.object.isRequired,
        onClear: PropTypes.func,
        onFilter: PropTypes.func
    };

    renderServiceTypeRow(type) {
        return (
            <SelectableListItem
                icon={type.vector_icon || null}
                onPress={type.onPress}
                selected={type.active}
                text={type.name}
            />
        );
    }

    render() {
        const {dataSource, onClear, onFilter} = this.props;
        return (
            <View style={{flex: 1}}>
                <View style={[styles.searchBarContainer, styles.searchBarContainerLight]}>
                    <Button
                        buttonStyle={{height: 44, marginRight: 2}}
                        color="green"
                        icon="md-close"
                        onPress={onClear}
                        text={I18n.t('CLEAR_FILTERS').toUpperCase()}
                    />
                    <Button
                        buttonStyle={{height: 44, marginLeft: 2}}
                        color="green"
                        icon="md-funnel"
                        onPress={onFilter}
                        text={I18n.t('FILTER_SERVICES').toUpperCase()}
                    />
                </View>
                <ListView
                    dataSource={dataSource}
                    enableEmptySections
                    keyboardDismissMode="on-drag"
                    keyboardShouldPersistTaps
                    renderRow={(type) => this.renderServiceTypeRow(type)}
                    style={{flex: 1}}
                />
            </View>
        );
    }
}

export default ServiceCategoryListView;

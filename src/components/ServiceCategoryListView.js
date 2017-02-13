import React, {Component, PropTypes} from 'react';
import {
    View,
    ListView
} from 'react-native';
import {SelectableListItem, DirectionalText} from '../components';
import styles, {isStatusBarTranslucent} from '../styles';
import I18n from '../constants/Messages';


export class ServiceCategoryListView extends Component {

    static propTypes = {
        onClear: PropTypes.func,
        onFilter: PropTypes.func,
        serviceTypes: PropTypes.array.isRequired
    };

    constructor(props) {
        super(props);
        this.dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1.id !== row2.id
        });
    }

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
        const {serviceTypes} = this.props;
        return (
            <View style={{flex: 1, marginTop: isStatusBarTranslucent() ? 25 + 105 : 105}}>
                <View style={[styles.viewHeaderContainer, styles.viewHeaderContainerLight]}>
                    <DirectionalText style={[styles.viewHeaderText, styles.viewHeaderTextLight]}>
                        {I18n.t('FILTER_BY_CATEGORY').toUpperCase()}
                        </DirectionalText>
                </View>
                <ListView
                    dataSource={this.dataSource.cloneWithRows(serviceTypes)}
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

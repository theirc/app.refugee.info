import React, {Component, PropTypes} from 'react';
import {View, ListView} from 'react-native';
import {ServiceListItem, DirectionalText} from '../components';
import {isStatusBarTranslucent} from '../styles';
import I18n from '../constants/Messages';
import styles from '../styles';


export class ServiceList extends Component {

    static propTypes = {
        services: PropTypes.array
    };

    constructor(props) {
        super(props);

        this.dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1.id !== row2.id
        });
    }

    renderRow(rowData) {
        return (
            <ServiceListItem service={rowData}/>
        );
    }

    render() {
        return (
            <View style={{flex: 1, marginTop: isStatusBarTranslucent() ? 25 + 105 : 105}}>
                <View style={[styles.viewHeaderContainer, styles.viewHeaderContainerLight]}>
                    <DirectionalText style={[styles.viewHeaderText, styles.viewHeaderTextLight]}>
                        {I18n.t('NEAREST_SERVICES').toUpperCase()}
                    </DirectionalText>
                </View>
                <ListView
                    dataSource={this.dataSource.cloneWithRows(this.props.services)}
                    enableEmptySections
                    keyboardDismissMode="on-drag"
                    keyboardShouldPersistTaps
                    renderRow={(service) => this.renderRow(service)}
                />
            </View>
        );
    }
}

export default ServiceList;

import React, {Component, PropTypes} from 'react';
import {View, Text, AsyncStorage} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Button} from 'react-native-material-design';
import I18n from '../constants/Messages';
import {connect} from 'react-redux';
import styles from '../styles';

export default class OfflineView extends Component {

    static propTypes = {
        onRefresh: PropTypes.func.isRequired,
        offline: PropTypes.bool.isRequired,
        lastSync: PropTypes.number
    };

    onRefreshHandler() {
        this.props.onRefresh();
    };
    
    render() {
        if (this.props.offline) {
            return (
                <View style={styles.offlineModeContainer}>
                    <Icon style={styles.offlineModeIcon} name="warning"/>
                    <View style={styles.offlineModeTextContainer}>
                        <Text style={styles.offlineModeText}>{I18n.t('OFFLINE_MODE')}</Text>
                        <Text style={styles.OfflineModeLastSync}>
                            {I18n.t('LAST_SYNC')}: {this.props.lastSync} {I18n.t('MINUTES_AGO')}
                        </Text>
                    </View>
                    <View style={styles.offlineModeButtonContainer}>
                        <Button
                            text={I18n.t('TRY_TO_REFRESH').toUpperCase()}
                            onPress={()=> this.onRefreshHandler()}
                        />
                    </View>
                </View>
            )
        }
        return null
    }
};

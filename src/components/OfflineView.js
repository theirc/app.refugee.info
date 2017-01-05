import React, {Component, PropTypes} from 'react';
import {View, StyleSheet} from 'react-native';
import {Icon, Button, DirectionalText} from '../components';
import I18n from '../constants/Messages';
import styles from '../styles';

export class OfflineView extends Component {

    static propTypes = {
        offline: PropTypes.bool.isRequired,
        onRefresh: PropTypes.func.isRequired
    };

    onRefreshHandler() {
        this.props.onRefresh();
    }

    render() {
        const {offline} = this.props;
        if (offline) {
            return (
                <View style={[{borderBottomWidth: 1, flex: 1}, styles.bottomDividerLight]}>
                    <View style={componentStyles.offlineModeContainer}>
                        <Icon style={componentStyles.offlineModeIcon} name="md-warning" />
                        <View style={componentStyles.offlineModeTextContainer}>
                            <DirectionalText style={[
                                componentStyles.offlineModeText,
                                styles.textLight
                            ]}
                            >
                                {I18n.t('OFFLINE_MODE')}
                            </DirectionalText>
                        </View>
                    </View>
                    <View style={componentStyles.offlineModeButtonContainer}>
                        <Button
                            buttonStyle={{height: 35, marginTop: 15, marginBottom: 5}}
                            color="green"
                            onPress={() => this.onRefreshHandler()}
                            text={I18n.t('TRY_TO_REFRESH').toUpperCase()}
                            textStyle={{fontSize: 14}}
                            transparent
                        />
                    </View>
                </View>
            );
        }
        return <View />;
    }
}


const componentStyles = StyleSheet.create({
    offlineModeContainer: {
        padding: 15,
        paddingBottom: 0,
        flexDirection: 'column'
    },
    offlineModeTextContainer: {
        marginLeft: 50
    },
    offlineModeText: {
        textAlign: 'center'
    },
    offlineModeIcon: {
        position: 'absolute',
        top: 25,
        left: 25,
        color: '#FFD700',
        fontSize: 36
    },
    offlineModeButtonContainer: {
        flexGrow: 1,
        width: 180,
        height: 50,
        alignSelf: 'center'
    }
});

export default OfflineView;


import React, {Component} from 'react';
import {View} from 'react-native';
import {connect} from 'react-redux';
import I18n from '../constants/Messages';
import styles from '../styles';
import {Button, DirectionalText} from '../components';
import {Actions} from 'react-native-router-flux';


class NetworkFailure extends Component {
    render() {
        return (
            <View style={[styles.container]}>
                <View>
                    <DirectionalText style={[{paddingVertical: 20, textAlign: 'center'}]}>
                        {I18n.t('NETWORK_FAILURE')}
                    </DirectionalText>
                    <View style={{
                        flexGrow: 1,
                        width: 180,
                        height: 35,
                        alignSelf: 'center'}}
                    >
                        <Button
                            color="green"
                            onPress={Actions.pop}
                            text={I18n.t('RETRY')}
                            textStyle={{textAlign: 'center', fontSize: 14}}
                        />
                    </View>
                </View>
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        ...state
    };
};

export default connect(mapStateToProps)(NetworkFailure);

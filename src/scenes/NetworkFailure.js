import React, { Component, PropTypes } from 'react';

import { View, StyleSheet, Text } from 'react-native';
import { Button } from 'react-native-material-design';
import { connect } from 'react-redux';

import I18n from '../constants/Messages';


class NetworkFailure extends Component {

    static contextTypes = {
        navigator: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        if (props.hasOwnProperty('previousPath') && props.previousPath) {
            this.previousPath = props.previousPath.split('.')[0];
        }
    }

    async _onPress() {
        const { navigator } = this.context;
        navigator.to(this.previousPath);
    }

    render() {
        const { theme, primary } = this.props;
        return (
            <View style={styles.container}>
                <View style={styles.horizontalContainer}>
                    <Text style={styles.error}>
                        {I18n.t('NETWORK_FAILURE')}
                    </Text>
                    <Button
                        theme={theme}
                        primary={primary}
                        text={I18n.t('RETRY')}
                        raised={true}
                        onPress={() => this._onPress()}
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EEE'
    },
    horizontalContainer: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center'
    },
    error: {
        marginBottom: 5
    }
});

export default connect()(NetworkFailure);

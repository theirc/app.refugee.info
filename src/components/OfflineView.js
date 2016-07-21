import React, {Component, PropTypes} from 'react';
import {View, Text, AsyncStorage, StyleSheet} from 'react-native';
import {Icon} from '../components';
import {Button} from '../components'
import I18n from '../constants/Messages';
import {connect} from 'react-redux';
import {getFontFamily, getBottomDividerColor, getTextColor} from '../styles';

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
        const {theme, offline, language} = this.props;
        if (offline) {
            return (
                <View style={[
                    componentStyles.offlineModeContainer,
                    {borderBottomWidth: 2},
                    getBottomDividerColor(theme)

                ]}>
                    <Icon style={componentStyles.offlineModeIcon} name="md-warning"/>
                    <View style={componentStyles.offlineModeTextContainer}>
                        <Text style={[
                            componentStyles.offlineModeText,
                            getFontFamily(language),
                            getTextColor(theme)
                        ]}
                        >
                            {I18n.t('OFFLINE_MODE')}
                        </Text>
                    </View>
                    <View style={componentStyles.offlineModeButtonContainer}>
                        <Button
                            text={I18n.t('TRY_TO_REFRESH').toUpperCase()}
                            onPress={()=> this.onRefreshHandler()}
                            buttonStyle={{height: 35, marginTop: 15, marginBottom: 5}}
                            textStyle={{fontSize: 14}}
                            color="green"
                        />
                    </View>
                </View>
            )
        }
        return null
    }
};

const mapStateToProps = (state) => {
    return {
        region: state.region,
        direction: state.direction,
        language: state.language,
        theme: state.theme
    };
};

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
    OfflineModeLastSync: {
        marginTop: 10,
        textAlign: 'center',
        fontSize: 12,
        color: '#333333'
    },
    offlineModeIcon: {
        position: 'absolute',
        top: 25,
        left: 25,
        color: '#FFD700',
        fontSize: 36
    },
    offlineModeButtonContainer: {
        width: 180,
        alignSelf: 'center',
        marginRight: -15
    }
});

export default connect(mapStateToProps)(OfflineView);


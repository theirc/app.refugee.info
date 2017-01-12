import React, {Component, PropTypes} from 'react';
import {View} from 'react-native';
import {connect} from 'react-redux';
import I18n from '../constants/Messages';
import styles, {getFontFamily, getTextColor} from '../styles';
import {Button, DirectionalText} from '../components';

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
        const {navigator} = this.context;
        navigator.to(this.previousPath);
    }

    render() {
        const {theme, language} = this.props;
        return (
            <View style={[styles.alignCenter, styles.flex]}>
                <DirectionalText
                    style={[
                        {marginBottom: 5},
                        getTextColor(theme),
                        getFontFamily(language)
                    ]}
                >
                    {I18n.t('NETWORK_FAILURE')}
                </DirectionalText>
                <Button
                    buttonStyle={{paddingLeft: 30, paddingRight: 30}}
                    color="green"
                    onPress={() => this._onPress()}
                    style={{marginTop: 15}}
                    text={I18n.t('RETRY')}
                    textStyle={{textAlign: 'center', fontSize: 14}}
                />
            </View>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        language: state.language,
        theme: state.theme
    };
};

export default connect(mapStateToProps)(NetworkFailure);

import React, { Component } from 'react';
import { PropTypes } from 'react-native';
import { Toolbar as MaterialToolbar } from 'react-native-material-design';
import I18n from '../constants/Messages';

export default class Toolbar extends Component {

    static contextTypes = {
        navigator: PropTypes.object
    };

    static propTypes = {
        onIconPress: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            title: 'Refugee Info'
        };
    }

    render() {
        const { navigator } = this.context;
        const { onIconPress } = this.props;
        let title = require('../assets/RI-logo.png');
        if (navigator && navigator.currentRoute && navigator.currentRoute.title != I18n.t('REFUGEE_INFO')) {
            title = navigator.currentRoute.title;
        }
        return (
            <MaterialToolbar
                icon={navigator && navigator.isChild ? 'keyboard-backspace' : require('../assets/ic_menu_white_24dp.png')}
                onIconPress={() => {navigator && navigator.isChild ? navigator.back() : onIconPress();}}
                rightIconStyle={{
                    margin: 10
                }}
                logoStyle={{
                    marginLeft: 16,
                    marginTop: 4,
                    width: 189,
                    height: 56
                }}
                testID="test-id-toolbar"
                title={title}
            />
        );
    }
}

import React, { Component, PropTypes } from 'react';
import { Toolbar as MaterialToolbar } from 'react-native-material-design';
import I18n from '../constants/Messages';
import { connect } from 'react-redux';
import styles from '../styles';

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
        const { onIconPress, primary, region } = this.props;
        let title = require('../assets/RI-logo.png');
        if (navigator && navigator.currentRoute && navigator.currentRoute.title != I18n.t('REFUGEE_INFO')) {
            title = navigator.currentRoute.title;
        }
        return (
            <MaterialToolbar
                primary={primary}
                icon={!region ? null : (navigator && navigator.isChild ? 'keyboard-backspace' : 'menu')}
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
                style={styles.materialToolbar}
                testID="test-id-toolbar"
                title={title}
            />
        );
    }
}

const mapStateToProps = (state) => {
    return {
        primary: state.theme.primary,
        region: state.region
    };
};

export default connect(mapStateToProps)(Toolbar);

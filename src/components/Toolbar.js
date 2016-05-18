import React, { Component } from 'react';
import { PropTypes, ToolbarAndroid, StyleSheet } from 'react-native';

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

        this.title = navigator && navigator.currentRoute ? navigator.currentRoute.title : 'Refugee Info'
        return (
            <ToolbarAndroid
                navIcon={require('../res/ic_menu_white_24dp.png')}
                onIconClicked={() => {navigator && navigator.isChild ? navigator.back() : onIconPress();}}
                style={styles.toolbar}
                title={this.title}
                titleColor='white'
                logo={(this.title == 'Refugee Info') ? require('../res/RI-logo.png') : null }
                contentInsetEnd={50}
            />
        );
    }
}

var styles = StyleSheet.create({
    toolbar: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 56,
        backgroundColor: '#1e90ff',
    },
});

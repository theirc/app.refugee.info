import React, { Component, PropTypes } from 'react';
import { StyleSheet, TouchableHighlight, Image } from 'react-native';
import styles from '../styles';


export default class MapButton extends Component {

    static contextTypes = {
        navigator: PropTypes.object.isRequired
    };

    onClick() {
        const { navigator } = this.context;
        navigator.to('map');
    }

    render() {
        return (
            <TouchableHighlight
                onPress={() => this.onClick()}
                style={styles.floatingActionButton}
                underlayColor="white"
            >
                <Image
                    source={require('../assets/mapbutton.png')}
                />
            </TouchableHighlight>
        );
    }
}


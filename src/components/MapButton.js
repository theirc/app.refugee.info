import React, { Component, PropTypes } from 'react';
import { StyleSheet, TouchableHighlight, Image } from 'react-native';

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
                style={styles.container}
                underlayColor="white"
            >
                <Image
                    source={require('../assets/mapbutton.png')}
                />
            </TouchableHighlight>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        flex: 1,
        right: 20,
        bottom: 20,
        borderWidth: 1,
        borderRadius: 50,
        opacity: 0.7
    }
});

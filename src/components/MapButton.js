import React, { Component, PropTypes } from 'react';
import { View, StyleSheet, TouchableHighlight, Image } from 'react-native';

export default class MapButton extends Component {

    static contextTypes = {
        navigator: PropTypes.object.isRequired
    };

    static propTypes = {

    };

    constructor(props) {
        super(props);
    }

    onClick() {
        const { navigator } = this.context;
        this.context.navigator.to('map');
    }

    render() {
        return (
            <TouchableHighlight
                onPress={() => this.onClick()}
                style={styles.container}
                underlayColor="white"
            >
                <Image
                    source={require('../graphics/mapbutton.png')}
                />
            </TouchableHighlight>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        flex: 1,
        right: 10,
        bottom: 10,
        borderWidth: 1,
        borderRadius: 50,
        opacity: 0.7
    }
});

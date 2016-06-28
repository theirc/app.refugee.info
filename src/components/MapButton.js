import React, {Component, PropTypes} from 'react';
import {StyleSheet, TouchableHighlight, Image} from 'react-native';
import styles from '../styles';


export default class MapButton extends Component {

    static contextTypes = {
        navigator: PropTypes.object.isRequired
    };

    static propTypes = {
        direction: PropTypes.oneOf(['rtl', 'ltr']),
        services: PropTypes.array,
        ...Component.propTypes
    };

    onClick() {
        const {navigator} = this.context;
        navigator.to('map', null, {services: this.props.services});
    }

    render() {
        const {direction} = this.props;
        return (
            <TouchableHighlight
                onPress={() => this.onClick()}
                style={[styles.floatingActionButton, direction === 'rtl' ? { left:20 } : { right: 20 }]}
                underlayColor="white"
            >
                <Image
                    source={require('../assets/mapbutton.png')}
                />
            </TouchableHighlight>
        );
    }
}

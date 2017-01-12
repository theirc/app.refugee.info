import React, {Component, PropTypes} from 'react';
import {ActivityIndicator, View, Dimensions} from 'react-native';
import {themes} from '../styles';

const {width, height} = Dimensions.get('window');


class LoadingOverlay extends Component {

    static propTypes = {
        height: PropTypes.number,
        transparent: PropTypes.bool,
        width: PropTypes.number
    };

    static defaultProps = {
        height,
        width,
        transparent: false
    };

    render() {
        const {width, height, transparent} = this.props;
        return (
            <View style={{
                flex: 1,
                position: 'absolute',
                bottom: 0,
                left: 0,
                width,
                height,
                backgroundColor: transparent ? 'rgba(0,0,0,0)': 'rgba(255,255,255,0.55)',
                alignItems: 'center',
                justifyContent: 'center',
                elevation: 4
            }}
            >
                <ActivityIndicator
                    animating
                    color={themes.light.textColor}
                    size="large"
                />
            </View>
        );
    }
}

export default LoadingOverlay;
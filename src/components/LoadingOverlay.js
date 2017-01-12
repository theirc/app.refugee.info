import React, {Component, PropTypes} from 'react';
import {ActivityIndicator, View, Dimensions} from 'react-native';
import {themes} from '../styles';

const {width, height} = Dimensions.get('window');


class LoadingOverlay extends Component {

    static propTypes = {
        height: PropTypes.number,
        width: PropTypes.number
    };

    static defaultProps = {
        height,
        width
    };

    render() {
        const {width, height} = this.props;
        return (
            <View style={{
                flex: 1,
                position: 'absolute',
                bottom: 0,
                left: 0,
                width,
                height,
                backgroundColor: 'rgba(255,255,255,0.7)',
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
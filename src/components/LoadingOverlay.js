import React, {Component, PropTypes} from 'react';
import {ActivityIndicator, View, LayoutAnimation} from 'react-native';
import styles, {themes} from '../styles';

export default class LoadingOverlay extends Component {

    static propTypes = {
        theme: PropTypes.oneOf(['light', 'dark']),
        height: PropTypes.number.isRequired,
        width: PropTypes.number.isRequired
    };

    render() {
        const {theme, width, height} = this.props;
        return (
            <View
                style={{
                    flex: 1,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: width,
                    height: height,
                    backgroundColor: theme=='dark' ? 'rgba(33,33,33,0.7)' : 'rgba(255,255,255,0.7)',
                    alignItems: 'center',
                    justifyContent: 'center',
                    elevation: 4
                }}
            >
                <ActivityIndicator
                    animating={true}
                    size="large"
                    color={theme=='dark' ? themes.dark.textColor : themes.light.textColor}
                />
            </View>
        );
    }
}
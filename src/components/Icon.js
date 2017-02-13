import {
    getIconComponent,
    getIconName
} from '../styles';
import HumanitarianIcon from './HumanitarianIcon';
import React, {Component} from 'react';
import {StyleSheet, Platform} from 'react-native';

export default class Icon extends Component {
    static propTypes = {
    };

    render() {
        let props = {...this.props};
        const IconComponent = getIconComponent(props.name);
        props.name = getIconName(props.name);
        let style = StyleSheet.flatten([props.style]);
        props.style = style;

        if (Platform.OS != 'ios') {
            if (HumanitarianIcon == IconComponent) {
                if (style.fontSize) {
                    style.fontSize -= 4;
                }
            }
        }
        if (!props.name) {
            return null;
        }
        return (<IconComponent {...props} />);
    }
}

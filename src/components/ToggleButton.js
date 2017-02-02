import React, {Component, PropTypes} from 'react';
import {StyleSheet, TouchableHighlight, View} from 'react-native';
import styles, {themes} from '../styles';
import {DirectionalText, Icon} from '../components';

export class ToggleButton extends Component {

    static propTypes = {
        active: PropTypes.bool,
        icon: PropTypes.string,
        iconStyle: PropTypes.object,
        onPress: PropTypes.func,
        text: PropTypes.string
    };

    renderIcon() {
        const {icon, iconStyle, active} = this.props;
        if (!icon) {
            return null;
        }
        return (
            <View style={[
                {paddingLeft: 10},
                styles.alignCenter,
                {height: 24}]}
            >
                <Icon
                    name={icon}
                    style={[
                        componentStyles.buttonIcon,
                        iconStyle,
                        active && {color: themes.light.backgroundColor}
                    ]}
                />
            </View>
        );
    }

    render() {
        const {text, active, onPress} = this.props;
        const iconImage = this.renderIcon();

        return (
            <View
                style={[
                    componentStyles.button,
                    active && {backgroundColor: themes.light.greenAccentColor}
                ]}
            >
                <TouchableHighlight
                    onPress={onPress}
                    style={[styles.flex]}
                    underlayColor="rgba(0, 0, 0, 0.2)"
                >
                    <View style={[
                        componentStyles.buttonTextContainer,
                        styles.row
                    ]}
                    >
                        {iconImage}
                        <DirectionalText style={[
                            componentStyles.buttonText,
                            active && {color: themes.light.backgroundColor}
                        ]}
                        >
                            {text}
                        </DirectionalText>
                    </View>
                </TouchableHighlight>
            </View>
        );
    }
}

const componentStyles = StyleSheet.create({
    button: {
        flexGrow: 1,
        height: 44,
        backgroundColor: themes.light.backgroundColor
    },
    buttonTextContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flexGrow: 1
    },
    buttonText: {
        fontSize: 13,
        textAlign: 'center',
        color: themes.light.darkerDividerColor
    },
    buttonIcon: {
        fontSize: 22,
        paddingRight: 10,
        color: themes.light.darkerDividerColor
    }
});

export default ToggleButton;

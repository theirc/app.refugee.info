import React, {Component, PropTypes} from 'react';
import {StyleSheet, TouchableHighlight, TouchableOpacity, View} from 'react-native';
import styles, {
    themes,
    getElevation
} from '../styles';
import {DirectionalText, Icon} from '../components';

export class Button extends Component {

    static propTypes = {
        buttonStyle: PropTypes.object,
        color: PropTypes.oneOf(['white', 'black', 'green', 'yellow']),
        icon: PropTypes.string,
        iconStyle: PropTypes.object,
        onPress: PropTypes.func,
        text: PropTypes.string,
        textStyle: PropTypes.object,
        transparent: PropTypes.bool
    };

    getButtonColor(color) {
        if (color == 'black') return componentStyles.buttonBlack;
        else if (color == 'green') return componentStyles.buttonGreen;
        else if (color == 'yellow') return componentStyles.buttonYellow;
        else return componentStyles.buttonWhite;
    }

    getButtonUnderlayColor(color) {
        if (color == 'black') return 'rgba(255,255,255,0.2)';
        else if (color == 'green') return 'rgba(0,150,70,0.8)';
        else if (color == 'yellow') return 'rgba(255,255,255,0.5)';
        else return 'rgba(177,177,177,0.5)';
    }

    getButtonTextColor(color) {
        if (color == 'black') return componentStyles.buttonTextBlack;
        else if (color == 'green') return componentStyles.buttonTextGreen;
        else if (color == 'yellow') return componentStyles.buttonTextYellow;
        else return componentStyles.buttonTextWhite;
    }

    renderIcon() {
        const {transparent, icon, iconStyle, color} = this.props;
        if (!icon) {
            return null;
        }
        return (
            <View style={[
                {paddingLeft: 10},
                transparent && {paddingLeft: 0, paddingRight: 0},
                styles.alignCenter,
                {height: 24}]}
            >
                <Icon
                    name={icon}
                    style={[
                        transparent ? {color: themes.light.greenAccentColor} : this.getButtonTextColor(color),
                        componentStyles.buttonIcon,
                        iconStyle
                    ]}
                />
            </View>
        );
    }

    render() {
        const {text, color, onPress, textStyle, buttonStyle, transparent} = this.props;
        const iconImage = this.renderIcon();

        if (transparent) {
            return (
                <View style={[{flex: 1}, buttonStyle]}>
                    <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={onPress}
                        style={[{flexGrow: 1, marginLeft: 5, marginRight: 5}]}
                    >
                        {iconImage}
                        <View style={componentStyles.buttonTextContainer}>
                            <DirectionalText style={[
                                componentStyles.buttonText,
                                {color: themes.light.greenAccentColor},
                                textStyle]}
                            >
                                {text}
                            </DirectionalText>
                        </View>
                    </TouchableOpacity>
                </View>
            );
        }

        return (
            <View
                style={[
                    getElevation(),
                    this.getButtonColor(color),
                    componentStyles.button,
                    buttonStyle
                ]}
            >
                <TouchableHighlight
                    onPress={onPress}
                    style={[styles.flex]}
                    underlayColor={this.getButtonUnderlayColor(color)}
                >
                    <View style={[
                        componentStyles.buttonTextContainer,
                        styles.row
                    ]}
                    >
                        {iconImage}
                        <DirectionalText style={[
                            componentStyles.buttonText,
                            this.getButtonTextColor(color),
                            textStyle]}
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
        height: 45,
        borderRadius: 2
    },
    buttonWhite: {
        backgroundColor: themes.light.backgroundColor
    },
    buttonBlack: {
        backgroundColor: themes.dark.toolbarColor
    },
    buttonGreen: {
        backgroundColor: themes.light.greenAccentColor
    },
    buttonYellow: {
        backgroundColor: themes.light.yellowAccentColor
    },
    buttonTextContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flexGrow: 1
    },
    buttonText: {
        fontSize: 13,
        textAlign: 'center'
    },
    buttonIcon: {
        fontSize: 22
    },
    buttonTextWhite: {
        color: themes.light.textColor
    },
    buttonTextBlack: {
        color: themes.dark.textColor
    },
    buttonTextGreen: {
        color: themes.dark.textColor
    },
    buttonTextYellow: {
        color: themes.light.textColor
    }
});

export default Button;

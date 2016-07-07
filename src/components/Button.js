import React, {Component, PropTypes} from 'react';
import {StyleSheet, TouchableHighlight, Platform, View, Text} from 'react-native';
import styles, {themes, generateTextStyles} from '../styles';
import {connect} from 'react-redux';
import { default as Icon } from 'react-native-vector-icons/MaterialIcons';

export default class Button extends Component {

    static propTypes = {
        text: PropTypes.string,
        icon: PropTypes.string,
        style: PropTypes.object,
        textStyle: PropTypes.object,
        buttonStyle: PropTypes.object,
        color: PropTypes.oneOf(['white', 'black', 'green', 'yellow']),
        onPress: PropTypes.func
    };

    getButtonColor(color) {
        if (color == 'black') return componentStyles.buttonBlack;
        else if (color == 'green') return componentStyles.buttonGreen;
        else if (color == 'yellow') return componentStyles.buttonYellow;
        else return componentStyles.buttonWhite
    }

    getButtonTextColor(color) {
        if (color == 'black') return componentStyles.buttonTextBlack;
        else if (color == 'green') return componentStyles.buttonTextGreen;
        else if (color == 'yellow') return componentStyles.buttonTextYellow;
        else return componentStyles.buttonTextWhite
    }

    /**
     * Ugly but we can't get the color from the styles
     */
    getIconColor(color) {
        if (color == 'black') return themes.dark.textColor;
        else if (color == 'green') return themes.dark.textColor;
        else if (color == 'yellow') return themes.light.textColor;
        else return themes.light.textColor;
    }

    render() {
        const {text, color, onPress, language, style, direction, icon, textStyle, buttonStyle} = this.props;

        let textColor = (this.getIconColor(color));
        let iconImage = icon &&
            <Icon
                name={icon}
                size={22}
                style={direction == 'ltr' ? componentStyles.icon : componentStyles.iconRTL}
                color={textColor}
                />
            ;

        return (
            <TouchableHighlight onPress={onPress} style={[{ marginBottom: 10 }, style]}>
                <View
                    style={[
                        componentStyles.button,
                        this.getButtonColor(color),
                        buttonStyle,
                        (icon ? (direction == 'ltr' ? { paddingLeft: 22 } : { paddingRight: 22 }) : {})
                    ]}
                >
                    {iconImage}
                    <Text style={[
                        componentStyles.buttonText,
                        this.getButtonTextColor(color),
                        generateTextStyles(language),
                        textStyle,
                    ]}>
                        {text}
                    </Text>
                </View>
            </TouchableHighlight>

        );
    }
}

const mapStateToProps = (state) => {
    return {
        region: state.region,
        direction: state.direction,
        language: state.language
    };
};

const componentStyles = StyleSheet.create({
    button: {
        flex: 1,
        height: 45,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 1 },
        alignItems: 'center',
        justifyContent: 'center',
        shadowOpacity: 0.4,
        shadowRadius: 1,
        flexDirection: 'column',
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

    buttonText: {
        fontSize: 16,
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
    },


    icon: {
        position: 'absolute',
        top: 4,
        left: 8,
    },
    iconRTL: {
        position: 'absolute',
        top: 4,
        right: 11,
    },
});

export default connect(mapStateToProps)(Button);

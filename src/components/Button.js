import React, {Component, PropTypes} from 'react';
import {StyleSheet, TouchableHighlight, Platform, View, Text} from 'react-native';
import styles, {
    themes, 
    getFontFamily, 
    getRowOrdering,
    getIconComponent,
    getIconName,
} from '../styles';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';

export default class Button extends Component {

    static propTypes = {
        text: PropTypes.string,
        icon: PropTypes.string,
        style: PropTypes.object,
        textStyle: PropTypes.object,
        buttonStyle: PropTypes.object,
        iconStyle: PropTypes.object,
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

    render() {
        const {text, color, onPress, language, style, direction, icon, textStyle, buttonStyle, iconStyle} = this.props;

        const Icon = getIconComponent(iconName);
        let iconName = getIconName(icon);

        let iconImage = icon &&
            <View style={[
                direction=='rtl' ? {paddingRight: 10} : {paddingLeft: 10},
                styles.alignCenter
            ]}>
                <Icon
                    name={iconName}
                    style={[
                        this.getButtonTextColor(color),
                        componentStyles.buttonIcon,
                        iconStyle
                    ]}
                />
            </View>;

        return (
            <TouchableHighlight onPress={onPress} style={[{ marginBottom: 10 }, style]}>
                <View
                    style={[
                        componentStyles.button,
                        this.getButtonColor(color),
                        buttonStyle,
                        getRowOrdering(direction)
                    ]}
                >
                    {iconImage}
                    <Text style={[
                        componentStyles.buttonText,
                        this.getButtonTextColor(color),
                        getFontFamily(language),
                        textStyle
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
        shadowOffset: {width: 0, height: 1},
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowOpacity: 0.4,
        shadowRadius: 1
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
        flex: 1,
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

export default connect(mapStateToProps)(Button);

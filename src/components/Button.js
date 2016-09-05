import React, {Component, PropTypes} from 'react';
import {StyleSheet, TouchableHighlight, Platform, View, Text} from 'react-native';
import styles, {
    themes,
    getFontFamily,
    getRowOrdering,
    getElevation
} from '../styles';
import Icon from './Icon'
import {connect} from 'react-redux';

export class Button extends Component {

    static propTypes = {
        text: PropTypes.string,
        icon: PropTypes.string,
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

    getButtonUnderlayColor(color) {
        if (color == 'black') return "rgba(255,255,255,0.2)";
        else if (color == 'green') return "rgba(0,150,70,0.8)";
        else if (color == 'yellow') return "rgba(255,255,255,0.5)";
        else return "rgba(177,177,177,0.5)";
    }

    getButtonTextColor(color) {
        if (color == 'black') return componentStyles.buttonTextBlack;
        else if (color == 'green') return componentStyles.buttonTextGreen;
        else if (color == 'yellow') return componentStyles.buttonTextYellow;
        else return componentStyles.buttonTextWhite
    }

    render() {
        const {text, color, onPress, language, direction, icon, textStyle, buttonStyle, iconStyle} = this.props;

        let iconImage = icon &&
            <View style={[
                direction == 'rtl' ? {paddingRight: 10} : {paddingLeft: 10},
                styles.alignCenter
            ]}>
                <Icon
                    name={icon}
                    style={[
                        this.getButtonTextColor(color),
                        componentStyles.buttonIcon,
                        iconStyle
                    ]}
                />
            </View>;

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
                        componentStyles.buttonInner,
                        getRowOrdering(direction)
                    ]}>
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
            </View>
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
        borderRadius: 2
    },
    buttonInner: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
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
        fontSize: 13,
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

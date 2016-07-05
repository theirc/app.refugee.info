import React, {Component, PropTypes} from 'react';
import {StyleSheet, TouchableHighlight, View, Text} from 'react-native';
import styles, {themes, generateTextStyles} from '../styles';
import {connect} from 'react-redux';

export default class Button extends Component {

    static propTypes = {
        text: PropTypes.string,
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
        const {text, color, onPress, language} = this.props;
        return (
            <TouchableHighlight onPress={onPress} style={{marginBottom: 10}}>
                <View
                    style={[
                        componentStyles.button,
                        this.getButtonColor(color)
                ]}>
                    <Text style={[
                        componentStyles.buttonText,
                        this.getButtonTextColor(color),
                        generateTextStyles(language)
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
        justifyContent: 'center',
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
        fontSize: 16
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

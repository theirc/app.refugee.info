import React, {Component, PropTypes} from 'react';
import {
    View,
    StyleSheet
} from 'react-native';
import DirectionalText from './DirectionalText';
import {
    themes
} from '../styles';


class MenuSection extends Component {

    static propTypes = {
        children: PropTypes.array,
        title: PropTypes.string
    };

    render() {
        const {title, children} = this.props;

        return (
            <View style={componentStyles.headerWrapper}>
                {title && <View style={componentStyles.header}>
                    <DirectionalText
                        {...this.props}
                        style={[componentStyles.text]}
                    >
                        {title}
                    </DirectionalText>
                </View>}
                {children}
            </View>
        );
    }
}

const componentStyles = StyleSheet.create({
    header: {
        borderBottomWidth: 1,
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderBottomColor: themes.light.darkerDividerColor

    },
    headerWrapper: {
        paddingBottom: 30
    },
    text: {
        color: themes.light.greenAccentColor,
        fontWeight: 'bold'
    }
});

export default MenuSection;


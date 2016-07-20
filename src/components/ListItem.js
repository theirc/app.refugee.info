import React, {Component, PropTypes} from 'react';
import {
    View,
    Text,
    TouchableHighlight,
    StyleSheet,
    Image,
    Platform
} from 'react-native';
import {connect} from 'react-redux';
import styles, {
    getFontFamily,
    getUnderlayColor,
    getRowOrdering,
    getAlignItems,
    getTextColor,
    getContainerColor,
    getBottomDividerColor,
    getDividerColor,
    themes
} from '../styles';
import Icon from './Icon';

export default class ListItem extends Component {

    static propTypes = {
        onPress: PropTypes.func,
        text: PropTypes.string,
        icon: PropTypes.string,
        iconSize: PropTypes.number,
        iconColor: PropTypes.string,
        fontSize: PropTypes.number,
        image: PropTypes.number,
        centered: PropTypes.bool
    };

    render() {
        const {theme, onPress, text, language, direction, iconColor, fontSize, image, centered, iconSize} = this.props;
        let iconName = (this.props.icon || '').trim();

        const button_icon = (image) ? (
            <Image
                source={image}
                style={[
                    componentStyles.listItemImageInline,
                    {width: iconSize || 24, height: iconSize || 24}
                ]}
            />) : (iconName) ? (
            <Icon
                name={iconName || defaultIcon }
                style={[
                    componentStyles.listItemIcon,
                    {fontSize: iconSize || 24},
                    iconColor && {color: iconColor}
                ]}
            />) : null;
        if (centered) {
            const imageElement = (image &&
            <Image
                source={image}
                style={[
                    (direction == 'rtl')
                        ? componentStyles.listItemImageAbsoluteRTL
                        : componentStyles.listItemImageAbsolute
                ]}
            />);
            const imageDivider = (image && (
                <View
                    style={[
                        componentStyles.dividerAbsolute,
                        getDividerColor(theme)
                    ]}
                />));

            return (
                <TouchableHighlight
                    onPress={onPress}
                    underlayColor={getUnderlayColor(theme)}
                >
                    <View
                        style={[
                            styles.listItemContainer,
                            getRowOrdering(direction),
                            getContainerColor(theme)
                        ]}
                    >
                        { imageElement }
                        { imageDivider }
                        <View style={componentStyles.listItemTextContainer}>
                            <Text
                                style={[
                                    componentStyles.listItemText,
                                    getFontFamily(language),
                                    getTextColor(theme)
                                ]}
                            >
                                {text}
                            </Text>
                        </View>
                    </View>
                </TouchableHighlight>
            );
        }
        else return (
            <View>
                <TouchableHighlight
                    onPress={onPress}
                    underlayColor={getUnderlayColor(theme) }
                >
                    <View
                        style={[
                            componentStyles.listItemContainer,
                            getRowOrdering(direction),
                            getContainerColor(theme)
                        ]}
                    >
                        <View
                            style={[
                                componentStyles.listItemIconContainer
                            ]}
                        >
                            {button_icon}
                        </View>
                        <View style={[
                            componentStyles.dividerInline,
                            getDividerColor(theme)
                        ]}/>
                        <View style={[
                            componentStyles.listItemTextContainer,
                            getAlignItems(direction),
                            getBottomDividerColor(theme),
                            {borderBottomWidth: 1}
                        ]}>
                            <Text style={[
                                componentStyles.listItemText,
                                getTextColor(theme),
                                getFontFamily(language),
                                {fontSize} && {fontSize: fontSize}
                            ]}>
                                {text}
                            </Text>
                        </View>
                    </View>
                </TouchableHighlight>
            </View>
        )
    }
};

const mapStateToProps = (state) => {
    return {
        theme: state.theme,
        direction: state.direction,
        language: state.language
    };
};

const componentStyles = StyleSheet.create({
    listItemContainer: {
        flex: 1,
        height: 50
    },
    listItemTextContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 20,
        paddingRight: 20
    },
    listItemText: {
        fontSize: 15
    },
    listItemIconContainer: {
        width: 50,
        height: 50,
        padding: 13,
        marginLeft: 5,
        marginRight: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    listItemIcon: {
        color: themes.light.greenAccentColor
    },
    listItemImageInline: {
        margin: 13
    },
    listItemImageAbsolute: {
        position: 'absolute',
        left: 15,
        top: 9,
        width: 32,
        height: 32
    },
    listItemImageAbsoluteRTL: {
        position: 'absolute',
        right: 15,
        top: 9,
        width: 32,
        height: 32
    },
    dividerInline: {
        marginVertical: 13,
        width: 1
    },
    dividerAbsolute: {
        position: 'absolute',
        top: 13,
        width: 1,
        height: 24,
        left: 63
    }

});

export default connect(mapStateToProps)(ListItem);

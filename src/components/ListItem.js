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
import styles, {getFontFamily, getUnderlayColor, themes, getRowOrdering, getAlignItems} from '../styles';
var Ionicons = require('react-native-vector-icons/Ionicons');
var FontAwesome = require('react-native-vector-icons/FontAwesome');

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
        const defaultIcon = 'md-bus';
        let Icon;
        if (!iconName) {
            iconName = defaultIcon;
        }
        if (iconName.indexOf('ion-') == 0) {
            iconName = iconName.substring(4);
            Icon = Ionicons;
        } else if (iconName.indexOf('fa-') == 0) {
            iconName = iconName.substring(3);
            Icon = FontAwesome;
        } else {
            Icon = Ionicons;
        }
        const button_icon = image ?
            <Image
                source={image}
                style={[
                    componentStyles.listItemImageInline,
                    {width: iconSize || 24, height: iconSize || 24}
                ]}
            /> :
            <Icon
                name={iconName || defaultIcon }
                style={[
                    componentStyles.listItemIcon,
                    {fontSize: iconSize || 24},
                    iconColor && { color: iconColor }
                ]}
            />;
        if (centered) {
            const imageElement = (image &&
            <Image 
                source={image} 
                style={[
                    (direction=='rtl')
                        ? componentStyles.listItemImageAbsoluteRTL
                        : componentStyles.listItemImageAbsolute
                ]}
            />);
            const imageDivider = (image &&
            <View
                style={[
                    componentStyles.dividerAbsolute,
                    theme=='dark' ? styles.dividerDark : styles.dividerLight
                ]}
            />);
            
            return (
                <TouchableHighlight
                    onPress={onPress}
                    underlayColor={getUnderlayColor(theme)}
                >
                    <View
                        style={[
                            styles.listItemContainer,
                            getRowOrdering(direction),
                            theme=='dark' ? styles.containerDark : styles.containerLight
                        ]}
                    >
                        { imageElement }
                        { imageDivider }
                        <View style={componentStyles.listItemTextContainer}>
                            <Text 
                                style={[
                                    componentStyles.listItemText,
                                    getFontFamily(language),
                                    theme=='dark' ? styles.textDark : styles.textLight
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
                            theme == 'dark' ? styles.containerDark : styles.containerLight
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
                            theme == 'dark' ? styles.dividerDark : styles.dividerLight
                        ]}/>
                        <View style={[
                            componentStyles.listItemTextContainer,
                            getAlignItems(direction),
                            { borderBottomWidth: 1 },
                            theme == 'dark' ? styles.bottomDividerDark : styles.bottomDividerLight

                        ]}>
                            <Text style={[
                                componentStyles.listItemText,
                                theme == 'dark' ? styles.textDark : styles.textLight,
                                getFontFamily(language),
                                { fontSize } && { fontSize: fontSize }
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

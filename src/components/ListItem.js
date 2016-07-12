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
import styles, {generateTextStyles, getUnderlayColor, themes, getRowOrdering, getAlignItems} from '../styles';
var Ionicons = require('react-native-vector-icons/Ionicons');
var FontAwesome = require('react-native-vector-icons/FontAwesome');

export default class ListItem extends Component {

    static propTypes = {
        onPress: PropTypes.func,
        text: PropTypes.string,
        icon: PropTypes.string,
        iconColor: PropTypes.string,
        fontSize: PropTypes.number,
        image: PropTypes.number
    };

    render() {
        const {theme, onPress, text, language, direction, iconColor, fontSize, image} = this.props;
        let iconName = (this.props.icon||'').trim();
        const defaultIcon = 'md-bus';
        let Icon;
        if(!iconName) {
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
                style={[componentStyles.listItemImageInline]}
                /> :
            <Icon
                name={iconName || defaultIcon }
                style={[
                    componentStyles.listItemIconInline,
                    iconColor && { color: iconColor }
                ]}
                />;
        return (
            <View>
                <TouchableHighlight
                    onPress={onPress}
                    underlayColor={getUnderlayColor(theme) }
                    >
                    <View
                        style={[
                            componentStyles.listItemContainer,
                            getRowOrdering(direction),
                            theme == 'dark' ? componentStyles.listItemContainerDark : componentStyles.listItemContainerLight
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
                                generateTextStyles(language),
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
    listItemContainerLight: {
        backgroundColor: themes.light.backgroundColor
    },
    listItemContainerDark: {
        backgroundColor: themes.dark.backgroundColor
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
    listItemIconInline: {

        fontSize: 24,
        color: themes.light.greenAccentColor
    },
    listItemImageInline: {
        width: 24,
        height: 24,
        margin: 13
    },
    dividerInline: {
        marginTop: 13,
        width: 1,
        height: 24
    }

});

export default connect(mapStateToProps)(ListItem);

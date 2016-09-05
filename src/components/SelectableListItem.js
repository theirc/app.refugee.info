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

export class SelectableListItem extends Component {

    static propTypes = {
        onPress: PropTypes.func,
        text: PropTypes.string,
        iconSize: PropTypes.number,
        iconColor: PropTypes.string,
        fontSize: PropTypes.number,
    };

    render() {
        const {theme, onPress, text, language, direction, fontSize, iconSize, selected, icon, image} = this.props;
        let selectedIcon = (selected &&
            <View
                style={[componentStyles.listItemIconContainer]}
            >
                <Icon
                    name="ios-checkmark-circle"
                    style={[componentStyles.listItemIcon]}
                />
            </View>
        );

        const button_icon = (image) ? (
            <Image
                source={image}
                style={[
                    componentStyles.listItemImageInline,
                    { width: iconSize || 24, height: iconSize || 24 }
                ]}
                />) : (icon) ? (
                    <Icon
                        name={icon}
                        style={[
                            componentStyles.listItemIcon,
                            { fontSize: iconSize || 24, color: themes[theme||'light'].textColor },
                        ]}
                        />) : null;
        return (
            <View>
                <TouchableHighlight
                    onPress={onPress}
                    underlayColor={getUnderlayColor(theme)}
                >
                    <View
                        style={[
                            componentStyles.listItemContainer,
                            getRowOrdering(direction),
                            getBottomDividerColor(theme),
                            getContainerColor(theme),
                            {borderBottomWidth: 1}
                        ]}
                    >
                        {button_icon && (<View>
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
                        </View>
                        ) }
                        <View style={[
                            componentStyles.listItemTextContainer,
                            getAlignItems(direction),
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
                        {selectedIcon}
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
        language: state.language,
        selectedTypes: state.selectedTypes
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
        color: themes.light.greenAccentColor,
        fontSize: 24
    },

});

export default connect(mapStateToProps)(SelectableListItem);

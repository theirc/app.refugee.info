import React, {Component, PropTypes} from 'react';
import {
    View,
    Text,
    TouchableHighlight,
    StyleSheet,
    Image,
    Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {connect} from 'react-redux';
import styles, {generateTextStyles, getUnderlayColor, themes} from '../styles';

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
        const {theme, onPress, text, icon, language, direction, iconColor, fontSize, image} = this.props;
        const defaultIcon = 'md-bus';
        const button_icon = image ?
            <Image
                source={image}
                style={[componentStyles.listItemImageInline]}
            /> :
            <Icon
                name={icon || defaultIcon }
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
                            direction=='rtl' ? styles.rowRTL : styles.row,
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
                            {alignItems: direction=='rtl' ? 'flex-end' : 'flex-start'},
                            {borderBottomWidth: 1},
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
        theme: state.theme.theme,
        direction: state.direction,
        language: state.language
    };
};

const componentStyles = StyleSheet.create({
    listItemContainer: {
        flex: 1,
        paddingLeft: 10,
        paddingRight: 10,
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

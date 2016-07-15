import React, {Component, PropTypes} from 'react';
import {View, Image, Text, StyleSheet, TouchableOpacity, Dimensions} from 'react-native';
import I18n from '../constants/Messages';
import {connect} from 'react-redux';
import {getFontFamily, getRowOrdering, themes} from '../styles';
import Icon from 'react-native-vector-icons/Ionicons';
import {DirectionalText} from '../components';
import {
    theme,
    getIconComponent,
    getIconName,
} from '../styles';

export default class Toolbar extends Component {

    static contextTypes = {
        navigator: PropTypes.object
    };

    static propTypes = {
        onMenuIconPress: PropTypes.func,
        theme: PropTypes.oneOf(['light', 'dark']),
        drawerOpen: PropTypes.bool,
        toolbarTitle: PropTypes.string,
        toolbarTitleIcon: PropTypes.string
    };

    render() {
        const {navigator} = this.context;
        const {theme, onMenuIconPress, drawerOpen, direction, region, language} = this.props;
        let {toolbarTitle, toolbarTitleIcon, toolbarTitleImage} = this.props;
        let title = '';
        if (toolbarTitle) {
            title = toolbarTitle;
        }
        else if (navigator && navigator.currentRoute) {
            title = navigator.currentRoute.title;
        }

        let iconName = (toolbarTitleIcon || '').trim();
        let titleIcon = null;
        if (iconName) {
            const Icon = getIconComponent(iconName);
            iconName = getIconName(iconName);

            titleIcon = (<View
                style={[componentStyles.titleIcon, {
                    padding: 2,
                    backgroundColor: themes.light.greenAccentColor,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderColor: themes[theme].backgroundColor,
                    borderRadius: 7,
                },
                ]}>
                <Icon
                    name={iconName || defaultIcon }
                    style={[
                        {
                            fontSize: 18,
                            color: themes.dark.textColor,
                            textAlign: 'center',
                            alignItems: 'center',
                            justifyContent: 'center',
                        },
                    ]}
                    />
            </View>);
        } else if (toolbarTitleImage) {
            titleIcon = (<Image
                source={{ uri: toolbarTitleImage }}
                style={componentStyles.titleIcon}
                />);
        }

        let menuIcon = drawerOpen ? "md-close" : "ios-menu";
        let backIcon = direction == "rtl" ? "md-arrow-forward" : "md-arrow-back";
        let icon = null;
        if (navigator) {
            icon = (
                <TouchableOpacity
                    style={{ width: 50, alignItems: 'flex-end', justifyContent: 'center'}}
                    onPress={navigator.isChild ? () => navigator.back() : onMenuIconPress}
                ><Icon
                    name={navigator.isChild ? backIcon : menuIcon}
                    style={
                        navigator.isChild ? [
                            componentStyles.backIcon,
                            theme == 'dark' ? componentStyles.backIconDark : componentStyles.backIconLight
                        ] : [
                            componentStyles.menuIcon,
                            theme == 'dark' ? componentStyles.menuIconDark : componentStyles.menuIconLight
                        ]
                    }
                />
                </TouchableOpacity>);
        }

        let showIcon = navigator && (region || navigator.isChild);
        return (
            <View
                style={[
                    componentStyles.toolbarContainer,
                    theme == 'dark' ? componentStyles.toolbarContainerDark : componentStyles.toolbarContainerLight
                ]}
            >
                <View style={componentStyles.toolbarTop}>
                    <Image
                        style={componentStyles.brandImage}
                        source={theme == 'dark' ? themes.dark.logo : themes.light.logo }
                    />
                    {showIcon && icon}
                </View>
                <View style={[
                    componentStyles.toolbarBottom,
                    getRowOrdering(direction)
                ]}>
                    {titleIcon}
                    <Text style={[
                        componentStyles.toolbarTitle,
                        getFontFamily(language),
                        theme == 'dark' ? componentStyles.toolbarTitleDark : componentStyles.toolbarTitleLight
                    ]}>
                        {title}
                    </Text>
                </View>
            </View>
        );
    }

}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const mapStateToProps = (state) => {
    return {
        region: state.region,
        direction: state.direction,
        language: state.language,
        toolbarTitle: state.toolbarTitle,
        toolbarTitleIcon: state.toolbarTitleIcon,
        toolbarTitleImage: state.toolbarTitleImage
    };
};

const componentStyles = StyleSheet.create({
    toolbarContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        paddingTop: 25,
        paddingBottom: 15,
        paddingRight: 15,
        paddingLeft: 15,
        flexDirection: 'column',
        height: windowHeight > 500 ? 140 : 110,
        borderBottomWidth: 2
    },
    toolbarContainerLight: {
        backgroundColor: themes.light.toolbarColor,
        borderBottomColor: themes.light.darkerDividerColor
    },
    toolbarContainerDark: {
        backgroundColor: themes.dark.toolbarColor,
        borderBottomColor: themes.dark.toolbarColor
    },
    toolbarTop: {
        flexDirection: 'row',
        height: 50,
        justifyContent: 'space-between'
    },
    toolbarBottom: {
        flex: 1,
        alignItems: 'flex-end'
    },
    brandImage: {
        marginTop: 5,
        height: 40,
        width: 120
    },
    menuIcon: {
        fontSize: 28
    },
    menuIconLight: {
        color: themes.light.textColor
    },
    menuIconDark: {
        color: themes.dark.yellowAccentColor
    },
    backIcon: {
        fontSize: 28
    },
    backIconLight: {
        color: themes.light.greenAccentColor
    },
    backIconDark: {
        color: themes.dark.yellowAccentColor
    },
    toolbarTitle: {
        fontSize: 20
    },
    toolbarTitleLight: {
        color: themes.light.textColor
    },
    toolbarTitleDark: {
        color: themes.dark.textColor
    },
    titleIcon: {
        width: 26,
        height: 26,
        marginLeft: 5,
        marginRight: 5
    }
});

export default connect(mapStateToProps)(Toolbar);

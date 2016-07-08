import React, {Component, PropTypes} from 'react';
import {View, Image, Text, StyleSheet, TouchableOpacity} from 'react-native';
import I18n from '../constants/Messages';
import {connect} from 'react-redux';
import {generateTextStyles, themes} from '../styles';
import Icon from 'react-native-vector-icons/Ionicons';
import {DirectionalText} from '../components';

export default class Toolbar extends Component {

    static contextTypes = {
        navigator: PropTypes.object
    };

    static propTypes = {
        onMenuIconPress: PropTypes.func,
        theme: PropTypes.oneOf(['light', 'dark']),
        drawerOpen: PropTypes.bool,
        toolbarTitle: PropTypes.string
    };

    render() {
        const {navigator} = this.context;
        const {theme, onMenuIconPress, drawerOpen, direction, region, language} = this.props;
        let {toolbarTitle} = this.props;
        let title = '';
        if (!region) {
            if (navigator && navigator.isChild)
                title = navigator.currentRoute.title || navigator.childName;
            else if (navigator && navigator.currentRoute)
                title = navigator.currentRoute.title;
        } else {
            title = region.pageTitle || (region.metadata && region.metadata.page_title) || '';
        }

        let menuIcon = drawerOpen ? "md-close" : "ios-menu";
        let backIcon = direction == "rtl" ? "md-arrow-forward" : "md-arrow-back";
        let icon = null;
        if (navigator) {
            icon = (<TouchableOpacity
                style={{ width: 40, alignItems: 'flex-end' }}
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
                            ]}
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
                <View style={[componentStyles.toolbarBottom,]}>
                    <DirectionalText direction={direction} style={[
                        componentStyles.toolbarTitle,
                        generateTextStyles(language),
                        theme == 'dark' ? componentStyles.toolbarTitleDark : componentStyles.toolbarTitleLight
                    ]}>
                        {title}
                    </DirectionalText>
                </View>

            </View>
        );
    }

}

const mapStateToProps = (state) => {
    return {
        region: state.region,
        direction: state.direction,
        language: state.language,
        toolbarTitle: state.toolbarTitle
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
        height: 140,
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
        flexDirection: 'row',
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
    }
});

export default connect(mapStateToProps)(Toolbar);

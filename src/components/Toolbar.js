import React, {Component, PropTypes} from 'react';
import {
    View,
    Image,
    StyleSheet,
    TouchableOpacity,
    Platform
} from 'react-native';
import {DirectionalText, Icon} from '../components';
import {connect} from 'react-redux';
import styles, {
    getToolbarHeight,
    isStatusBarTranslucent,
    themes
} from '../styles';


export class Toolbar extends Component {

    static contextTypes = {
        navigator: PropTypes.object
    };

    static propTypes = {
        drawerOpen: PropTypes.bool,
        onMenuIconPress: PropTypes.func,
        toolbarTitle: PropTypes.string,
        toolbarTitleIcon: PropTypes.string
    };

    back = false;

    _goBack() {
        const {navigator} = this.context;

        if (!this.back) {
            this.back = true;
            navigator.back();

            setTimeout(() => {
                this.back = false;
            }, 1000);
        }
    }

    renderTitleIcon() {
        const {toolbarTitleIcon} = this.props;
        const iconName = (toolbarTitleIcon || '').trim();
        if (!iconName) {
            return <View />;
        }
        return (
            <View style={componentStyles.titleIconContainer}>
                <Icon
                    name={iconName}
                    style={componentStyles.titleIcon}
                />
            </View>
        );
    }

    renderToolbarActionIcon() {
        const {navigator} = this.context;
        const {onMenuIconPress, drawerOpen} = this.props;
        const menuIcon = drawerOpen ? 'md-close' : 'ios-menu';
        const backIcon = 'md-arrow-back';

        return (
            <TouchableOpacity
                onPress={navigator.isChild ? () => this._goBack() : onMenuIconPress}
                style={componentStyles.toolbarIconContainer}
            >
                <Icon
                    name={navigator.isChild ? backIcon : menuIcon}
                    style={navigator.isChild
                        ? [componentStyles.backIcon, componentStyles.backIconLight]
                        : [componentStyles.menuIcon, componentStyles.menuIconLight]
                    }
                />
            </TouchableOpacity>
        );
    }

    render() {
        const {navigator} = this.context;
        const {toolbarTitle} = this.props;

        let title = toolbarTitle ? toolbarTitle : '';
        if (navigator && navigator.currentRoute) {
            title = navigator.currentRoute.title;
        }
        const smallHeader = navigator && navigator.currentRoute && navigator.currentRoute.component.smallHeader;
        const noHeader = navigator && navigator.currentRoute && navigator.currentRoute.component.noHeader;

        const toolbarActionIcon = navigator ? this.renderToolbarActionIcon() : <View />;
        const titleIcon = this.renderTitleIcon();

        if (noHeader) {
            return <View />;
        }

        return (
            <View
                style={[
                    componentStyles.toolbarContainer,
                    smallHeader && {height: (Platform.Version >= 21 || Platform.OS === 'ios') ? 80 : 55}
                ]}
            >
                <View style={componentStyles.toolbarTop}>
                    {toolbarActionIcon}
                    <Image
                        source={themes.light.logo}
                        style={componentStyles.brandImage}
                    />
                </View>

                {!smallHeader && (
                    <View style={[componentStyles.toolbarBottom, styles.row]}>
                        {titleIcon}
                        <DirectionalText style={[componentStyles.toolbarTitle, componentStyles.toolbarTitleLight]}>
                            {title}
                        </DirectionalText>
                    </View>)}
            </View>
        );
    }

}

const mapStateToProps = (state) => {
    return {
        region: state.region,
        direction: state.direction,
        toolbarTitle: state.toolbarTitle
    };
};

const componentStyles = StyleSheet.create({
    toolbarContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        paddingTop: (isStatusBarTranslucent()) ? 25 : 0,
        paddingBottom: 10,
        paddingRight: 15,
        paddingLeft: 15,
        flexDirection: 'column',
        height: getToolbarHeight(),
        borderBottomWidth: 2,
        backgroundColor: themes.light.toolbarColor,
        borderBottomColor: themes.light.darkerDividerColor
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
    toolbarIconContainer: {
        width: 50,
        alignItems: 'flex-start',
        justifyContent: 'center'
    },
    menuIcon: {
        fontSize: 28
    },
    menuIconLight: {
        color: themes.light.textColor
    },
    backIcon: {
        fontSize: 28
    },
    backIconLight: {
        color: themes.light.greenAccentColor
    },
    toolbarTitle: {
        fontSize: 20
    },
    toolbarTitleLight: {
        color: themes.light.textColor
    },
    titleIconContainer: {
        width: 26,
        height: 26,
        marginHorizontal: 5,
        padding: 2,
        backgroundColor: themes.light.greenAccentColor,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: themes.light.backgroundColor,
        borderRadius: 7
    },
    titleIcon: {
        fontSize: 18,
        color: themes.dark.textColor,
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default connect(mapStateToProps)(Toolbar);

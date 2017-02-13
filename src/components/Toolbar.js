import React, {Component, PropTypes} from 'react';
import {
    View,
    Image,
    StyleSheet,
    TouchableOpacity,
    I18nManager
} from 'react-native';
import {DirectionalText, Icon} from '../components';
import {connect} from 'react-redux';
import styles, {
    getToolbarHeight,
    isStatusBarTranslucent,
    themes
} from '../styles';
import {Actions} from 'react-native-router-flux';


export class Toolbar extends Component {

    static contextTypes = {
        drawer: PropTypes.object
    };

    static propTypes = {
        component: PropTypes.any,
        drawerOpen: PropTypes.bool,
        getTitle: PropTypes.func,
        navigationState: PropTypes.object,
        region: PropTypes.object,
        title: PropTypes.oneOfType([PropTypes.string, PropTypes.func])
    };

    renderToolbarActionIcon() {
        const {drawerOpen, region} = this.props;
        const menuIcon = drawerOpen ? 'md-close' : 'ios-menu';
        if (!region) {
            return <View />;
        }
        return (
            <TouchableOpacity
                onPress={this.context.drawer.open}
                style={componentStyles.toolbarIconContainer}
            >
                <Icon
                    name={menuIcon}
                    style={componentStyles.menuIcon}
                />
            </TouchableOpacity>
        );
    }

    renderBackIcon() {
        const isRTL = I18nManager.isRTL;
        const backIcon = isRTL ? 'md-arrow-forward' : 'md-arrow-back';
        const state = this.props.navigationState;
        const childState = state.children[state.index];
        const backButton = childState.component && childState.component.backButton;
        if (!backButton) {
            return <View style={componentStyles.backIconContainer}/>;
        }
        return (
            <TouchableOpacity
                onPress={Actions.pop}
                style={componentStyles.backIconContainer}
            >
                <Icon
                    name={backIcon}
                    style={componentStyles.backIcon}
                />
            </TouchableOpacity>
        );
    }

    render() {
        let title = this.props.getTitle ? this.props.getTitle(this.props) : this.props.title;
        if (title === undefined && this.props.component && this.props.component.title) {
            title = this.props.component.title;
        }
        if (typeof (title) === 'function') {
            title = title(this.props);
        }

        const toolbarActionIcon = this.renderToolbarActionIcon();
        const backButton = this.renderBackIcon();

        return (
            <View style={componentStyles.toolbarContainer}>
                <View style={componentStyles.toolbarTop}>
                    {toolbarActionIcon}
                    <View style={styles.row}>
                        <Image
                            source={themes.light.logo}
                            style={componentStyles.brandImage}
                        />
                        {backButton}
                    </View>
                    {}
                </View>

                <View style={[componentStyles.toolbarBottom, styles.row]}>
                    <DirectionalText style={[componentStyles.toolbarTitle, componentStyles.toolbarTitleLight]}>
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
    backIconContainer: {
        width: 20,
        alignItems: 'flex-end',
        justifyContent: 'center'
    },
    menuIcon: {
        fontSize: 28,
        color: themes.light.textColor
    },
    backIcon: {
        fontSize: 28,
        color: themes.light.greenAccentColor
    },
    toolbarTitle: {
        fontSize: 20
    },
    toolbarTitleLight: {
        color: themes.light.textColor
    }
});

export default connect(mapStateToProps)(Toolbar);

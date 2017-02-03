import React, { Component, PropTypes } from 'react';
import {
    View,
    Image,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import { DirectionalText, Icon } from '../components';
import { connect } from 'react-redux';
import styles, {
    getToolbarHeight,
    isStatusBarTranslucent,
    themes
} from '../styles';
import { Actions } from 'react-native-router-flux';


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
        const {drawerOpen, region, language} = this.props;
        const menuIcon = drawerOpen ? 'md-close' : 'ios-menu';
        const isRTL = ['ar', 'fa'].indexOf(language) > -1;
        const backIcon = isRTL ? 'md-arrow-forward' : 'md-arrow-back';

        const state = this.props.navigationState;
        const childState = state.children[state.index];
        const backButton = childState.component && childState.component.backButton;

        if (!region) {
            return <View />;
        }
        return (
            <TouchableOpacity
                onPress={backButton ? Actions.pop : this.context.drawer.open}
                style={componentStyles.toolbarIconContainer}
                >
                <Icon
                    name={backButton ? backIcon : menuIcon}
                    style={backButton ? componentStyles.backIcon : componentStyles.menuIcon}
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

        return (
            <View style={componentStyles.toolbarContainer}>
                <View style={componentStyles.toolbarTop}>
                    {toolbarActionIcon}
                    <Image
                        source={themes.light.logo}
                        style={componentStyles.brandImage}
                        />
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
        toolbarTitle: state.toolbarTitle,
        language: state.language
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

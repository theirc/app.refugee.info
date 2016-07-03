import React, {Component, PropTypes} from 'react';
import {View, Image, Text} from 'react-native';
import I18n from '../constants/Messages';
import {connect} from 'react-redux';
import styles from '../styles';
import Icon from 'react-native-vector-icons/Ionicons';

export default class Toolbar extends Component {

    static contextTypes = {
        navigator: PropTypes.object
    };

    static propTypes = {
        onMenuIconPress: PropTypes.func,
        theme: PropTypes.oneOf(['light', 'dark']),
        drawerOpen: PropTypes.bool,
    };

    render() {
        const {navigator} = this.context;
        const {theme, isChild, onMenuIconPress, drawerOpen, direction, region} = this.props;
        let title = '';
        if (navigator && navigator.currentRoute)
            title = navigator.currentRoute.title;

        let menuIcon = drawerOpen ? "md-close" : "ios-menu";
        let backIcon = direction == "rtl" ? "md-arrow-forward" : "md-arrow-back";
        let iconColor = theme == 'light' ? "#000000" : "#ffffff";
        let icon = null;
        if (navigator) {
            icon = <Icon
                name={navigator.isChild ? backIcon : menuIcon}
                style={[styles.menuIcon, { color: iconColor }]}
                onPress={navigator.isChild ? () => navigator.back() : onMenuIconPress}
                />;
        }

        let showIcon = navigator && (region || navigator.isChild);

        console.log();

        return (
            <View
                style={[
                    styles.toolbarContainer,
                    theme == 'dark' ? styles.toolbarContainerDark : styles.toolbarContainerLight
                ]}
                >
                <View style={styles.toolbarTop}>
                    <Image
                        style={styles.brandImage}
                        source={require('../assets/logo.png') }
                        />
                    {showIcon && icon}
                </View>
                <View style={styles.toolbarBottom}>
                    <Text style={[
                        styles.toolbarTitle,
                        theme == 'dark' ? styles.toolbarTitleDark : styles.toolbarTitleLight
                    ]}>
                        {title}
                    </Text>
                </View>

            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        primary: state.theme.primary,
        region: state.region,
        direction: state.direction,
    };
};

export default connect(mapStateToProps)(Toolbar);

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
        theme: PropTypes.oneOf(['light', 'dark'])
    };
    
    render() {
        const {navigator} = this.context;
        const {theme, isChild, onMenuIconPress} = this.props;
        let title = '';
        if (navigator && navigator.currentRoute)
            title = navigator.currentRoute.title;
        return (
            <View
                style={[
                    styles.toolbarContainer, 
                    theme=='dark' ? styles.toolbarContainerDark : styles.toolbarContainerLight
                ]}
            >
                <View style={styles.toolbarTop}>
                    <Image
                        style={styles.brandImage}
                        source={require('../assets/logo.png')}
                    />
                    <Icon
                        name="ios-menu"
                        style={styles.menuIcon}
                        onPress={onMenuIconPress}
                    />
                </View>
                <View style={styles.toolbarBottom}>
                    <Text style={[
                        styles.toolbarTitle,
                        theme=='dark' ? styles.toolbarTitleDark : styles.toolbarTitleLight
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
        direction: state.direction
    };
};

export default connect(mapStateToProps)(Toolbar);

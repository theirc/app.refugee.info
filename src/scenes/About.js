import React, {Component, PropTypes} from 'react';
import {AsyncStorage, Image, StyleSheet, View, Text, Dimensions} from 'react-native';
import {connect} from 'react-redux';
import {Drawer, Button, RadioButtonGroup, Subheader} from 'react-native-material-design';
import I18n from '../constants/Messages';
import styles from '../styles';


class About extends Component {

    static contextTypes = {
        navigator: PropTypes.object.isRequired
    };

    render() {
        const {theme} = this.props;
        const logoAbout = require('../assets/about.png');

        return (
            <View style={styles.detailsContainer}>
                <Text style={[
                        styles.sectionHeader,
                        theme=='dark' ? styles.textDark : styles.textLight
                    ]}>
                    {I18n.t('ABOUT_HEADER') }
                </Text>
                <Text style={[styles.sectionContent, theme=='dark' ? styles.textDark : styles.textLight]}>
                    {I18n.t('ABOUT_CONTENT_1') }
                </Text>
                <Image
                    source={logoAbout}
                    resizeMode={Image.resizeMode.contain}
                    style={localStyles.logoAbout}
                />
                <Text style={[styles.sectionContent, theme=='dark' ? styles.textDark : styles.textLight]}>
                    {I18n.t('ABOUT_CONTENT_2') }
                </Text>
            </View>
        );
    }
}

const localStyles = StyleSheet.create({
    logoAbout: {
        width: Dimensions.get('window').availWidth
    }
});

const mapStateToProps = (state) => {
    return {
        primary: state.theme.primary,
        theme: state.theme.theme,
        language: state.language
    };
};

export default connect(mapStateToProps)(About);

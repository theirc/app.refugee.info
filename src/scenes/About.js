import React, {Component, PropTypes} from 'react';
import {Image, StyleSheet, View, Dimensions} from 'react-native';
import {connect} from 'react-redux';
import I18n from '../constants/Messages';
import {DirectionalText} from '../components';
import styles from '../styles';


export class About extends Component {

    static contextTypes = {
        navigator: PropTypes.object.isRequired
    };

    render() {
        const logoAbout = require('../assets/about.png');

        return (
            <View style={styles.detailsContainer}>
                <DirectionalText style={[styles.sectionHeader, styles.textLight]}>
                    {I18n.t('ABOUT_HEADER') }
                </DirectionalText>

                <DirectionalText style={[styles.sectionContent, styles.textLight]}>
                    {I18n.t('ABOUT_CONTENT_1') }
                </DirectionalText>

                <Image
                    resizeMode={Image.resizeMode.contain}
                    source={logoAbout}
                    style={localStyles.logoAbout}
                />

                <DirectionalText style={[styles.sectionContent, styles.textLight]}>
                    {I18n.t('ABOUT_CONTENT_2') }
                </DirectionalText>
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
        language: state.language
    };
};

export default connect(mapStateToProps)(About);

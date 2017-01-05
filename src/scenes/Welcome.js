import React, {Component, PropTypes} from 'react';
import {Image, StyleSheet, View, Text, Dimensions, TouchableHighlight} from 'react-native';
import {connect} from 'react-redux';
import styles, {themes, getFontFamily} from '../styles';
import I18n from '../constants/Messages';
import {updateLanguageIntoStorage} from '../actions/language';
import {updateDirectionIntoStorage} from '../actions/direction';
import {DirectionalText} from '../components';

const {width, height} = Dimensions.get('window');

class Welcome extends Component {
    static propTypes = {
        dispatch: PropTypes.func,
        finished: PropTypes.func,
        firstLoad: PropTypes.bool,
        language: PropTypes.string
    };

    constructor(props) {
        super(props);
        this.state = {
            showLanguage: false,
            languageSelected: false
        };
        this.setEnglish = this.setLanguage.bind(this, 'en');
        this.setArabic = this.setLanguage.bind(this, 'ar');
        this.setFarsi = this.setLanguage.bind(this, 'fa');
    }

    componentDidMount() {
        if (!this.props.firstLoad) {
            this.props.finished();
        }

        const {props} = this;

        let {language} = props;
        if (!language || this.state.languageSelected) {
            return;
        }

        setTimeout(() => {
            if (!props.firstLoad) {
                return;
            }
            this.setState({
                languageSelected: false,
                showLanguage: true
            });
        }, 1000);
    }

    async setLanguage(language) {
        const {dispatch} = this.props;

        await this.setState({
            languageSelected: true
        });
        const direction = ['ar', 'fa'].indexOf(language) > -1 ? 'rtl' : 'ltr';
        await Promise.all([
            dispatch(updateDirectionIntoStorage(direction)),
            dispatch(updateLanguageIntoStorage(language)),
            dispatch({type: 'DIRECTION_CHANGED', payload: direction}),
            dispatch({type: 'LANGUAGE_CHANGED', payload: language})
        ]).then(() => {
            return this.setState({
                language,
                showLanguage: false
            });
        }).then(() => this.props.finished());
    }

    renderLanguageSelection() {
        return (
            <View style={componentStyles.languageChoiceContainer}>
                <View style={componentStyles.languageChoiceHeader}>
                    <View style={{justifyContent: 'center'}}>
                        <DirectionalText style={[
                            styles.textAccentGreen,
                            {fontSize: 13, alignItems: 'center'}]}
                        >
                            {I18n.t('LANGUAGE').toUpperCase()}
                        </DirectionalText>
                    </View>
                </View>
                <TouchableHighlight
                    onPress={this.setEnglish}
                    style={componentStyles.button}
                    underlayColor="rgba(0, 0, 0, 0.2)"
                >
                    <Text style={[
                        {fontSize: 13, color: themes.light.textColor},
                        getFontFamily('en')]}
                    >
                        English
                    </Text>
                </TouchableHighlight>

                <TouchableHighlight
                    onPress={this.setArabic}
                    style={componentStyles.button}
                    underlayColor="rgba(0, 0, 0, 0.2)"
                >
                    <Text style={[
                        {fontSize: 13, color: themes.light.textColor},
                        getFontFamily('ar')]}
                    >
                        العربيـة
                    </Text>
                </TouchableHighlight>

                <TouchableHighlight
                    onPress={this.setFarsi}
                    style={componentStyles.button}
                    underlayColor="rgba(0, 0, 0, 0.2)"
                >
                    <Text style={[
                        {fontSize: 13, color: themes.light.textColor},
                        getFontFamily('fa')]}
                    >
                        فارسی
                    </Text>
                </TouchableHighlight>
            </View>);
    }


    render() {
        const {showLanguage} = this.state;
        const logo = require('../assets/splash-screen.png');

        return (
            <View style={componentStyles.screen}>
                <View>
                    <Image
                        resizeMode={Image.resizeMode.cover}
                        source={logo}
                        style={[componentStyles.logo]}
                    />
                    {showLanguage && this.renderLanguageSelection()}
                </View>
            </View>
        );
    }
}

const componentStyles = StyleSheet.create({
    screen: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: '#000000'
    },
    logo: {
        width,
        height
    },
    languageChoiceContainer: {
        flexDirection: 'column',
        position: 'absolute',
        bottom: 0,
        width
    },
    languageChoiceHeader: {
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: themes.dark.backgroundColor
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 45,
        width
    }
});

function mapStateToProps(state) {
    return {
        language: state.language,
        direction: state.direction
    };
}

export default connect(mapStateToProps)(Welcome);

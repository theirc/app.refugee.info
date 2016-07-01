import React, {Component, PropTypes} from 'react';
import {AsyncStorage, Image, StyleSheet, View} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import {connect} from 'react-redux';
import {Drawer, Button, RadioButtonGroup, Subheader} from 'react-native-material-design';
import DrawerCommons from '../utils/DrawerCommons';
import I18n from '../constants/Messages';
import styles from '../styles';
import store from '../store';
import {updateLanguageIntoStorage} from '../actions/language'
import {updateDirectionIntoStorage} from '../actions/direction'
import {updateRegionIntoStorage} from '../actions/region'
import {updateCountryIntoStorage} from '../actions/country'
import {updateThemeIntoStorage} from '../actions/theme'

class Settings extends Component {

    static contextTypes = {
        navigator: PropTypes.object.isRequired
    };

    componentDidMount() {
    }

    setLanguage(lang) {
        this.setState({
            language: lang
        })
    }
    setTheme(theme) {
        this.setState({
            theme: theme
        })
    }

    updateSettings() {
        const {navigator} = this.context;
        const {language, theme} = this.state;
        const {dispatch} = this.props;
        const direction = ['ar', 'fa'].indexOf(language) > -1 ? 'rtl' : 'ltr';
        let originalTheme = {...this.props.theme};
        originalTheme.theme = theme;

        dispatch(updateLanguageIntoStorage(language));
        dispatch(updateDirectionIntoStorage(direction));
        dispatch(updateRegionIntoStorage(null));
        dispatch(updateCountryIntoStorage(null));
        dispatch(updateThemeIntoStorage(theme));

        dispatch({type: "REGION_CHANGED", payload: null});
        dispatch({type: 'COUNTRY_CHANGED', payload: null});
        dispatch({type: "CHANGE_LANGUAGE", payload: language});
        dispatch({type: "DIRECTION_CHANGED", payload: direction});
        dispatch({type: "THEME_CHANGED", payload: theme});
        

        navigator.to('initial');
    }

    render() {
        const {theme, language} = this.props;

        return (
            <View style={styles.container}>
                <Subheader text="Language"/>

                <RadioButtonGroup
                    onSelect={(value)=> this.setLanguage(value) }
                    theme={theme.theme}
                    primary={theme.primary}
                    selected={language}
                    items={[{
                          value: 'en', label: 'English'
                      }, {
                          value: 'ar', label: 'Arabic'
                      },{
                          value: 'fa', label: 'Farsi'
                      }
                    ]}
                />
                <Subheader text="Theme"/>
                
                <RadioButtonGroup
                    onSelect={(value)=> this.setTheme(value) }
                    theme={theme.theme}
                    primary={theme.primary}
                    selected={theme.theme}
                    items={[{
                          value: 'light', label: 'Light'
                      }, {
                          value: 'dark', label: 'Dark'
                      }
                    ]}
                />
                <Button raised onPress={() => this.updateSettings()} text="Update"/>
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        route: state.navigation,
        language: state.language,
        theme: state.theme,
        direction: state.direction
    };
};

export default connect(mapStateToProps)(Settings);

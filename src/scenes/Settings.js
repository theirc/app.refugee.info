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

    selectLanguage(lang) {
      const {navigator} = this.context;
      const { dispatch } = this.props;
      const direction = ['ar','fa'].indexOf(lang) > -1 ? 'rtl' : 'ltr';

      dispatch(updateLanguageIntoStorage(lang));
      dispatch(updateDirectionIntoStorage(direction));
      dispatch(updateRegionIntoStorage(null));
      dispatch(updateCountryIntoStorage(null));

      dispatch({type: "REGION_CHANGED", payload: null});
      dispatch({type: 'COUNTRY_CHANGED', payload: null});
      dispatch({type: "LANGUAGE_CHANGED", payload: lang});
      dispatch({type: "DIRECTION_CHANGED", payload: direction});

      navigator.to('initial');
    }

    render() {
        const {theme, language} = this.props;

        return (
            <View style={localStyle.container}>
                <Subheader text="Language" />

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
                  <Button raised onPress={() => this.selectLanguage(this.state.language)} text="Select"/>
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        route: state.navigation,
        language: state.language,
        theme: state.theme,
    };
};

const localStyle = StyleSheet.create({
      container: {
          flex: 1,
          flexDirection: 'column'
      },
})

export default connect(mapStateToProps)(Settings);

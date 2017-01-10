import React, {Component, PropTypes} from 'react';
import {
    View,
    ScrollView,
    Dimensions,
    Alert,
    I18nManager
} from 'react-native';
import {connect} from 'react-redux';
import I18n from '../constants/Messages';
import styles, {
    themes,
    getToolbarHeight
} from '../styles';
import {
    Icon,
    LoadingOverlay,
    ListItem,
    DirectionalText
} from '../components';
import {
    updateCountryIntoStorage,
    updateDirectionIntoStorage,
    updateLanguageIntoStorage,
    updateLocationsIntoStorage,
    updateRegionIntoStorage
} from '../actions';
import RNRestart from 'react-native-restart';
import ApiClient from '../utils/ApiClient';

const {width, height} = Dimensions.get('window');


class Settings extends Component {

    static contextTypes = {
        navigator: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            loading: false
        };
        this.goToCountryChoice = this.goToCountryChoice.bind(this);
        this.setEnglish = this.updateSettings.bind(this, 'en');
        this.setArabic = this.updateSettings.bind(this, 'ar');
        this.setFarsi = this.updateSettings.bind(this, 'fa');
    }


    updateSettings(language) {
        this.setState({
            loading: true
        });
        const {dispatch, region, country} = this.props;
        const direction = ['ar', 'fa'].indexOf(language) > -1 ? 'rtl' : 'ltr';
        const isRTL = direction === 'rtl';
        I18nManager.forceRTL(isRTL);
        this.apiClient = new ApiClient(this.context, {language});

        let newRegion = null;
        let newCountry = null;

        Promise.all([
            this.apiClient.getLocation(region.slug, true),
            this.apiClient.getCountry(country.slug, true)
        ]).then((values) => {
            newRegion = values[0];
            newCountry = values[1];
            this.apiClient.getAllChildrenOf(newCountry.id, true).then((children) => {
                let locations = [{newCountry, ...newCountry}].concat(children);
                locations = locations.filter((city) => !city.hidden);
                locations.forEach((city) => {city.country = country});
                Promise.all([
                    dispatch(updateLanguageIntoStorage(language)),
                    dispatch(updateDirectionIntoStorage(direction)),
                    dispatch(updateCountryIntoStorage(newCountry)),
                    dispatch(updateRegionIntoStorage(newRegion)),
                    dispatch(updateLocationsIntoStorage(locations)),
                    dispatch({type: 'LANGUAGE_CHANGED', payload: language}),
                    dispatch({type: 'DIRECTION_CHANGED', payload: direction}),
                    dispatch({type: 'REGION_CHANGED', payload: newRegion}),
                    dispatch({type: 'COUNTRY_CHANGED', payload: newCountry}),
                    dispatch({type: 'LOCATIONS_CHANGED', payload: locations}),
                    dispatch({type: 'TOOLBAR_TITLE_CHANGED', payload: I18n.t('SETTINGS')})
                ]).then(() => {
                    this.setState({loading: false});
                    RNRestart.Restart();
                });
            });
        }).catch(() => {
            this.setState({
                loading: false
            });
            Alert.alert(
                I18n.t('CANNOT_CHANGE_LANGUAGE'),
                `${I18n.t('NETWORK_PROBLEM')}`,
                [{text: I18n.t('OK')}]
            );
        });
    }

    goToCountryChoice() {
        const {navigator} = this.context;
        requestAnimationFrame(() => navigator.to('countryChoice'));
    }

    render() {
        const {loading} = this.state;
        return (
            <ScrollView style={styles.container}>
                <ListItem
                    fontSize={13}
                    icon="ios-flag"
                    iconColor={themes.light.textColor}
                    onPress={this.goToCountryChoice}
                    text={I18n.t('CHANGE_COUNTRY')}
                />

                <View style={[
                    styles.row,
                    styles.bottomDividerLight,
                    {marginTop: 30, borderBottomWidth: 1}]}
                >
                    <View style={[
                        styles.alignCenter,
                        {height: 50, width: 50, marginRight: 10}
                    ]}
                    >
                        <Icon
                            name="ios-chatboxes"
                            style={[
                                {fontSize: 24},
                                styles.textAccentGreen
                            ]}
                        />
                    </View>
                    <View style={{justifyContent: 'center'}}>
                        <DirectionalText style={[
                            styles.textAccentGreen,
                            {fontSize: 13}
                        ]}
                        >
                            {I18n.t('CHANGE_LANGUAGE').toUpperCase()}
                        </DirectionalText>
                    </View>
                </View>

                <ListItem
                    onPress={this.setEnglish}
                    text={I18n.t('ENGLISH')}
                />
                <ListItem
                    onPress={this.setArabic}
                    text={I18n.t('ARABIC')}
                />
                <ListItem
                    onPress={this.setFarsi}
                    text={I18n.t('FARSI')}
                />

                {loading &&
                <LoadingOverlay
                    height={height - getToolbarHeight()}
                    width={width}
                />}
            </ScrollView>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        route: state.navigation,
        language: state.language,
        theme: state.theme,
        direction: state.direction,
        region: state.region,
        country: state.country
    };
};

export default connect(mapStateToProps)(Settings);

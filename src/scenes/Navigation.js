import React, { Component } from 'react';
import { AsyncStorage, PropTypes, Text } from 'react-native';

import { Drawer } from 'react-native-material-design';

import I18n from '../constants/Messages';
import {capitalize} from '../utils/helpers';
import regionStore from '../stores/regionStore';

export default class Navigation extends Component {

    static contextTypes = {
        drawer: PropTypes.object.isRequired,
        navigator: PropTypes.object.isRequired
    };

    static _getBaseLangCode(code) {
        return code.split('-')[0];
    }

    static _isFallback() {
        let code = Navigation._getBaseLangCode(I18n.locale);
        return !(code in I18n.translations);
    }

    static _isActiveLanguage(langCode) {
        let code = Navigation._getBaseLangCode(langCode);
        return I18n.locale.startsWith(code) ||
            (code == I18n.defaultLocale && Navigation._isFallback());
    }

    componentDidMount() {
        this._loadInitialState();
    }

    async _loadInitialState() {
        regionStore.subscribe(() => this.setState(regionStore.getState()));
        this.setState({
            region: JSON.parse(await AsyncStorage.getItem('region'))
        });
    }

    constructor(props) {
        super(props);
        this.state = {
            route: null,
            region: null
        };
    }

    _getLanguageMenuItem(code, name) {
        return {
            icon: 'language',
            value: I18n.t(name),
            active: Navigation._isActiveLanguage(code),
            onPress: () => this.changeLanguage(code),
            onLongPress: () => this.changeLanguage(code)
        };
    }

    changeLanguage(code) {
        I18n.locale = code;
        this.changeScene('welcome');
    }

    changeScene = (path, name, props={}) => {
        const { drawer, navigator } = this.context;

        this.setState({
            route: path
        });
        navigator.to(path, name, props);
        drawer.closeDrawer();
    };
    
    render() {
        const { route } = this.state;

        if (!this.state.region) {
            return <Text>Choose location first</Text>;
        }

        return (
            <Drawer theme="light">
                <Drawer.Section
                    items={[{
                        icon: 'home',
                        value: I18n.t('HOME'),
                        active: !route || route === 'welcome',
                        onPress: () => this.changeScene('cityChoice', null, {countryId: (this.state.region) ? this.state.region.country.id : null}),
                        onLongPress: () => this.changeScene('cityChoice', null, {countryId: (this.state.region) ? this.state.region.country.id : null})
                    }]}
                    title={this.state.region && `${capitalize(this.state.region.country.name)}, ${capitalize(this.state.region.name)}`}
                />

                <Drawer.Section
                    items={[{
                        icon: 'list',
                        value: I18n.t('LIST_SERVICES'),
                        active: route === 'services',
                        onPress: () => this.changeScene('services'),
                        onLongPress: () => this.changeScene('services')
                    }, {
                        icon: 'map',
                        value: I18n.t('EXPLORE_MAP'),
                        active: route === 'map',
                        onPress: () => this.changeScene('map'),
                        onLongPress: () => this.changeScene('map')
                    }, {
                        icon: 'info',
                        value: I18n.t('GENERAL_INFO'),
                        active: route === 'info',
                        onPress: () => this.changeScene('info'),
                        onLongPress: () => this.changeScene('info')
                    }
                    ]}
                    title={I18n.t('REFUGEES_INFO')}
                />

                <Drawer.Section
                    items={[
                        this._getLanguageMenuItem('en', 'ENGLISH'),
                        this._getLanguageMenuItem('fr', 'FRENCH')
                    ]}
                    title={I18n.t('LANGUAGE')}
                />
            </Drawer>
        );
    }
}

import React from 'react';
import { AsyncStorage, Platform, InteractionManager } from 'react-native';
import { Drawer } from 'react-native-material-design';
import I18n from '../constants/Messages';

export default class DrawerCommons {

    constructor(component) {
        this.component = component;
    }

    static _getBaseLangCode(code) {
        return code.split('-')[0];
    }

    static _isFallback(currentLang) {
        let code = DrawerCommons._getBaseLangCode(currentLang);
        return !(code in I18n.translations);
    }

    static _isActiveLanguage(currentLang, langCode) {
        const code = DrawerCommons._getBaseLangCode(langCode);
        return currentLang.startsWith(code) ||
            (code == I18n.defaultLocale && DrawerCommons._isFallback(currentLang));
    }

    static _getThemeIcon(currentTheme, theme) {
        return currentTheme == theme ? 'radio-button-checked' : 'radio-button-unchecked';
    }

    getLanguageMenuItem(code, name, flag) {
        return {
            value: I18n.t(name),
            image: flag,
            imageStyle: { position: 'absolute', top: 8 },
            active: DrawerCommons._isActiveLanguage(this.component.props.code, code),
            onPress: () => this.changeLanguage(code),
            onLongPress: () => this.changeLanguage(code)
        };
    }

    changeLanguage(code, reload = true) {
        const { dispatch } = this.component.props;
        I18n.locale = code;
        dispatch({ type: 'CHANGE_LANGUAGE', payload: code });
        if (reload) {
            AsyncStorage.setItem('langCode', code);
            this.changeScene(this.component.props.route);
        }
    }

    changeTheme(theme, color, reload = true) {
        const { dispatch } = this.component.props;
        dispatch({ payload: theme, type: 'THEME_CHANGED' });
        dispatch({ payload: color, type: 'PRIMARY_CHANGED' });
        if (reload) {
            AsyncStorage.setItem('theme', theme);
            AsyncStorage.setItem('color', color);
            this.changeScene('initial');
        }
    }

    closeDrawer() {
        const { drawer, navigator } = this.component.context;

        if (Platform.OS === 'ios') {
            this.component.context.drawer.close()
        }
        else {
            drawer.closeDrawer();
        }
    }

    changeScene(path, name, props = {}) {
        const { drawer, navigator } = this.component.context;
        const { dispatch } = this.component.props;
        InteractionManager.runAfterInteractions(() => {
            navigator.to(path, name, props);
            dispatch({ type: 'CHANGE_ROUTE', payload: path });
            this.closeDrawer();
        });
    };

    renderLanguageSection() {
        return (
            <Drawer.Section
                items={[
                    this.getLanguageMenuItem('en', 'ENGLISH', require('../assets/flags/gb.png')),
                    this.getLanguageMenuItem('fr', 'FRENCH', require('../assets/flags/fr.png')),
                    this.getLanguageMenuItem('ar', 'ARABIC', require('../assets/flags/_Arab_League.png'))
                ]}
                title={I18n.t('LANGUAGE') }
                />
        );
    }

    renderThemeSection() {
        let {theme} = this.component.props;
        return (
            <Drawer.Section
                items={[{
                    icon: DrawerCommons._getThemeIcon(theme, 'light'),
                    value: 'Light',
                    onPress: () => this.changeTheme('light', 'googleBlue'),
                    onLongPress: () => this.changeTheme('light', 'googleBlue')
                },
                    {
                        icon: DrawerCommons._getThemeIcon(theme, 'dark'),
                        value: 'Dark',
                        onPress: () => this.changeTheme('dark', 'paperGrey'),
                        onLongPress: () => this.changeTheme('dark', 'paperGrey')
                    }]}
                title={I18n.t('THEME') }
                />
        );
    }

}

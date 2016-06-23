import I18n from './constants/Messages';

export default {
    initial: {
        initialRoute: true,
        exitOnBackPress: true,
        title: I18n.t('REFUGEE_INFO'),
        component: require('./scenes/Initial').default
    },

    languageSelection: {
        exitOnBackPress: true,
        title: I18n.t('REFUGEE_INFO'),
        component: require('./scenes/LanguageSelection').default
    },

    countryChoice: {
        title: I18n.t('REFUGEE_INFO'),
        component: require('./scenes/CountryChoice').default,

        children: {
            cityChoice: {
                title: I18n.t('REFUGEE_INFO'),
                component: require('./scenes/CityChoice').default
            }
        }
    },

    cityChoice: {
        title: I18n.t('REFUGEE_INFO'),
        component: require('./scenes/CityChoice').default
    },

    services: {
        title: I18n.t('SERVICE_LIST'),
        component: require('./scenes/ServiceList').default,

        children: {
            details: {
                title: I18n.t('SERVICE_DETAILS'),
                component: require('./scenes/ServiceDetails').default
            }
        }
    },

    map: {
        title: I18n.t('SERVICE_MAP'),
        component: require('./scenes/ServiceMap').default,

        children: {
            details: {
                title: I18n.t('SERVICE_DETAILS'),
                component: require('./scenes/ServiceDetails').default
            }
        }
    },

    info: {
        exitOnBackPress: true,
        title: I18n.t('GENERAL_INFO'),
        component: require('./scenes/GeneralInformation').default,
        children: {
            details: {
                title: I18n.t('GENERAL_INFO'),
                component: require('./scenes/GeneralInformationDetails').default
            }
        }
    },
    infoDetails: {
        title: I18n.t('GENERAL_INFO'),
        component: require('./scenes/GeneralInformationDetails').default
    },

    networkFailure: {
        title: I18n.t('REFUGEE_INFO'),
        component: require('./scenes/NetworkFailure').default
    },

    settings: {
        title: I18n.t('SETTINGS'),
        component: require('./scenes/Settings').default
    }
};

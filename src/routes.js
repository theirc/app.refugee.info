import I18n from './constants/Messages';

export default {
    initial: {
        initialRoute: true,
        exitOnBackPress: true,
        title: () => I18n.t('REFUGEE_INFO'),
        component: require('./scenes/Initial').default
    },

    countryChoice: {
        title: () => I18n.t('WHERE_ARE_YOU'),
        component: require('./scenes/CountryChoice').default,

        children: {
            cityChoice: {
                title: () => I18n.t('WHERE_ARE_YOU'),
                component: require('./scenes/CityChoice').default
            }
        }
    },

    cityChoice: {
        title: () => I18n.t('WHERE_ARE_YOU'),
        component: require('./scenes/CityChoice').default
    },

    services: {
        title: () => I18n.t('SERVICES'),
        component: require('./scenes/ServiceList').default,

        children: {
            details: {
                title: () => I18n.t('SERVICE_DETAILS'),
                component: require('./scenes/ServiceDetails').default
            }
        }
    },

    map: {
        title: () => I18n.t('SERVICES'),
        component: require('./scenes/ServiceMap').default,

        children: {
            details: {
                title: () => I18n.t('SERVICE_DETAILS'),
                component: require('./scenes/ServiceDetails').default
            }
        }
    },

    info: {
        exitOnBackPress: true,
        title: () => I18n.t('GENERAL_INFO'),
        component: require('./scenes/GeneralInformation').default,
        children: {
            details: {
                title: () => I18n.t('GENERAL_INFO'),
                component: require('./scenes/GeneralInformationDetails').default,
                children: {
                    // Important information linked from details
                    importantLink: {
                        title: () => I18n.t('GENERAL_INFO'),
                        component: require('./scenes/GeneralInformation').default,
                    },
                }
            }
        }
    },
    infoDetails: {
        title: () => I18n.t('GENERAL_INFO'),
        component: require('./scenes/GeneralInformationDetails').default
    },

    networkFailure: {
        title: () => I18n.t('REFUGEE_INFO'),
        component: require('./scenes/NetworkFailure').default
    },

    notifications: {
        title: () => I18n.t('ANNOUNCEMENTS'),
        component: require('./scenes/Notifications').default
    },
    news: {
        title: () => I18n.t('NEWS'),
        component: require('./scenes/NewsThatMoves').default
    },

    settings: {
        title: () => I18n.t('SETTINGS'),
        component: require('./scenes/Settings').default
    },

    about: {
        title: () => I18n.t('ABOUT'),
        component: require('./scenes/About').default
    },

    contact: {
        title: () => I18n.t('CONTACT_US'),
        component: require('./scenes/Contact').default
    }
};

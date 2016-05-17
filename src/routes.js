import I18n from './constants/Messages';

export default {

    welcome: {
        initialRoute: true,

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
        title: I18n.t('GENERAL_INFO'),
        component: require('./scenes/GeneralInformation').default,
        children: {
            details: {
                title: '',
                component: require('./scenes/GeneralInformationDetails').default
            }
        }
    }
};

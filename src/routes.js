export default {

    welcome: {
        initialRoute: true,

        title: 'Refugee Info',
        component: require('./scenes/Welcome').default,
    },

    services: {
        title: 'Service List',
        component: require('./scenes/ServiceList').default
    },

    map: {
        title: 'Service Map',
        component: require('./scenes/ServiceMap').default
    },

    info: {
        title: 'General Information',
        component: require('./scenes/GeneralInformation').default
    },
}

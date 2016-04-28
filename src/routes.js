export default {

    welcome: {
        initialRoute: true,

        title: 'Refugee Info',
        component: require('./scenes/Welcome').default
    },

    services: {
        title: 'Service List',
        component: require('./scenes/ServiceList').default,

        children: {
            details: {
                title: 'Service Details',
                component: require('./scenes/ServiceDetails').default
            }
        }
    },

    map: {
        title: 'Service Map',
        component: require('./scenes/ServiceMap').default,

        children: {
            details: {
                title: 'Service Details',
                component: require('./scenes/ServiceDetails').default
            }
        }
    },

    info: {
        title: 'General Information',
        component: require('./scenes/GeneralInformation').default,
        children: {
            details: {
                title: '',
                component: require('./scenes/GeneralInformationDetails').default
            }
        }
    }
}

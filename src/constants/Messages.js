import I18n from 'react-native-i18n';
export default I18n;

I18n.fallbacks = true;
I18n.defaultLocale = 'en';

I18n.translations = {
    en: {
        HOME: 'Change City',
        LIST_SERVICES: 'List Services',
        EXPLORE_MAP: 'Explore Services on Map',
        GENERAL_INFO: 'General Information',
        GPS_DISABLED: 'Unable to determine location. Please enable GPS.',
        NETWORK_PROBLEM: 'There is a problem with your Internet connection',
        LOADING_SERVICES: 'Loading services...',
        CANT_FIND_LOCATION: 'Sorry, we can\'t find your location. Please choose location from the list',
        DETECTING_LOCATION: 'Detecting...',
        DETECT_LOCATION: 'Detect Location',
        REFUGEE_INFO: 'Refugee Info',
        LOADING: 'Loading...',
        SELECT: 'Select',
        LATEST_SERVICES: 'Latest services in',
        COST_OF_SERVICE: 'Cost of service',
        CHOOSE_REGION: 'Please choose region on home page',
        SELECTION_CRITERIA: 'Selection Criteria',
        GET_DIRECTIONS: 'Get directions',
        CALL: 'Call',
        RATING: 'Rating',
        OPENING_HOURS: 'Opening hours',
        DESCRIPTION: 'Description',
        SEARCH: 'Search...',
        SUBMIT: 'Submit',
        RATE_THIS_SERVICE: 'Rate this service',
        YOUR_RATING: 'Your rating',
        COMMENT: 'Comment',
        NAME: 'Name',
        CLOSE: 'Close',
        FIELD_REQUIRED: 'This field is required',
        LANGUAGE: 'Language',
        ENGLISH: 'English',
        FRENCH: 'French',
        ARABIC: 'Arabic',
        SELECT_COUNTRY: 'Please choose the country where you are',
        SELECT_LOCATION: 'Please choose your location',
        SERVICE_LIST: 'Service List',
        SERVICE_DETAILS: 'Service Details',
        SERVICE_MAP: 'Service Map',
        THEMES: 'Themes'

    },
    fr: {
        LANGUAGE: 'La langue'
    },
    ar: {
        LANGUAGE: 'لغة'
    }
};

import I18n from 'react-native-i18n';
export default I18n;

I18n.fallbacks = true;
I18n.defaultLocale = 'en';

I18n.translations = {
    en: {
        HOME: 'Home',
        GPS_DISABLED: 'Unable to determine location. Please enable GPS.',
        NETWORK_PROBLEM: 'There is a problem with your Internet connection',
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
        SERVICE_LIST: 'Services',
        EXPLORE_MAP: 'Map',
        GENERAL_INFO: 'Information',
        SERVICE_DETAILS: 'Service Details',
        SERVICE_MAP: 'Service Map',
        THEME: 'Theme',
        CHANGE_COUNTRY: 'Change Country',
        CHANGE_CITY: 'Change City',
        SET_COUNTRY: 'Set Country',
        SHARE: 'Share',
        NETWORK_FAILURE: 'Network failure',
        RETRY: 'Retry',
        LOADING_LOCATIONS: 'Loading locations, please wait...',
        LOADING_SERVICES: 'Loading services, please wait...',
        NO_LOCATIONS_FOUND: 'No locations found',
        OFFLINE_MODE: 'You are in offline mode!\nData might be outdated!',
        TRY_TO_REFRESH: 'Try to refresh',
        FEEDBACK_OFFLINE: 'Comments and feedback are disabled in offline mode',
        LAST_SYNC: 'Last sync',
        MINUTES_AGO: 'minutes ago'
    },
    fr: {
        LANGUAGE: 'La langue'
    },
    ar: {
        LANGUAGE: 'لغة'
    }
};

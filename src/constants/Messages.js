import I18n from 'react-native-i18n';
export default I18n;

I18n.fallbacks = true;
I18n.defaultLocale = 'en';

/*
Actual data files are in stored in JSON so it can translated using transifex.
*/
I18n.translations = {
    en: require('./data/en.json'),
    ar: require('./data/ar.json'),
    fa: require('./data/fa.json')
};

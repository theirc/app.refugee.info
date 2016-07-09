
 function addTranslatedProperties(obj, language, ...properties) {
    properties.forEach((p) => {
        Object.defineProperty(obj, p, {
            enumerable: false,
            configurable: false,
            get: () => (obj[p + '_' + language] || obj[p + '_en']), 
            set: (v) => obj[p + '_' + language] = v,
        });
    });
}

module.exports = {
    addTranslatedProperties
};
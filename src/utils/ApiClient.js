import { AsyncStorage } from 'react-native';
const InteractionManager = require('InteractionManager');

export default class ApiClient {

    constructor(context, api_root='http://api.refugee.info') {
        this.navigator = context.navigator;
        this.apiRoot = api_root;
    }

    async fetch(relativeUrl) {
        await InteractionManager.runAfterInteractions();
        var languageCode = await AsyncStorage.getItem('langCode');
        var headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };

        if (languageCode) {
          headers['Accept-Language'] = languageCode;
        }

        return fetch(`${this.apiRoot}${relativeUrl}`, { headers:headers })
            .then((response) => response.json())
            .catch((error) => {
                console.log(error);
                
                this.navigator.to('networkFailure');
            });
    }

    post(relativeUrl, data) {
        return fetch(`${this.apiRoot}${relativeUrl}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then((response) => response)
        .catch((error) => {
            this.navigator.to('networkFailure');
        });
    }

    getRootLocations() {
        return this.fetch('/v1/region/?format=json&level=1');
    }

    getLocations(parentId) {
        return this.fetch(`/v1/region/?format=json&parent=${parentId}`);
    }

    getLocation(id) {
        return this.fetch(`/v1/region/${id}/?format=json&`);
    }

    getRegions(parentId) {
        return this.fetch(`/v1/region/?format=json&parent=${parentId}&level=2`);
    }

    getCities(parentId) {
        return this.fetch(`/v1/region/?format=json&parent=${parentId}&level=3`);
    }

    getLocationByPosition(longitude, latitude, level) {
        return this.fetch(`/v1/region/?format=json&point=${latitude},${longitude}&level=${level}`);
    }

    getServiceTypes() {
        return this.fetch('/v1/servicetypes/?format=json');
    }

    getServices(locationSlug) {
        return this.fetch(`/v1/services/search/?format=json&geographic_region=${locationSlug}`);
    }

    getFeedbacks(service) {
        return this.fetch(`/v1/feedback/?format=json&service=${service}&extra_comments=2`);
    }

    getService(id) {
        return this.fetch(`/v1/services/search/?format=json&id=${id}`);
    }

    postFeedback(service, name, rating, comment) {
        return this.post('/v1/feedback/?format=json', {
            name,
            phone_number: '',
            nationality: null,
            area_of_residence: null,
            service: service.url,
            delivered: null,
            quality: rating,
            non_delivery_explained: null,
            wait_time: null,
            wait_time_satisfaction: null,
            difficulty_contacting: 'no',
            other_difficulties: '',
            staff_satisfaction: null,
            extra_comments: comment,
            anonymous: false
        });
    }
}

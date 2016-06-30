import {AsyncStorage} from 'react-native';
const InteractionManager = require('InteractionManager');

export default class ApiClient {

    constructor(context, props = {language: 'en'}, api_root = 'http://api.refugee.info') {
        this.navigator = context.navigator;
        this.apiRoot = api_root;
        this.language = props.language || 'en';
    }

    async fetch(relativeUrl, raise_exception = false) {
        await InteractionManager.runAfterInteractions();
        var languageCode = this.language;
        var headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };

        if (languageCode) {
            headers['Accept-Language'] = languageCode;
        }
        return fetch(`${this.apiRoot}${relativeUrl}`, {headers: headers})
            .then((response) => response.json())
            .catch((error) => {
                if (raise_exception) {
                    throw 'offline'
                }
                else {
                    this.navigator.to('networkFailure');
                }
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

    getLocations(parentId, raise_exception = false) {
        return this.fetch(`/v1/region/?format=json&parent=${parentId}`, raise_exception);
    }

    getLocation(id, raise_exception = false) {
        return this.fetch(`/v1/region/${id}/?format=json&`, raise_exception);
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

    getServiceTypes(raise_exception = false) {
        return this.fetch('/v1/servicetypes/?format=json', raise_exception);
    }

    getServices(locationSlug, latitude, longitude, raise_exception = false) {
        if (latitude && longitude) {
            return this.fetch(`/v1/services/search/?format=json&geographic_region=${locationSlug}
        &closest=${latitude},${longitude}`, raise_exception);
        }
        else return this.fetch(`/v1/services/search/?format=json&geographic_region=${locationSlug}`, raise_exception);
    }

    getFeedbacks(service, raise_exception = false) {
        return this.fetch(`/v1/feedback/?format=json&service=${service}&extra_comments=2`, raise_exception);
    }

    getService(id, raise_exception = false) {
        return this.fetch(`/v1/services/search/?format=json&id=${id}`, raise_exception);
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

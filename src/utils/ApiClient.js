import {API_PATH} from '../constants'

const InteractionManager = require('InteractionManager');

export default class ApiClient {

    constructor(context, props = { language: 'en' }, api_root = API_PATH) {
        if (context) {
            this.navigator = context.navigator;
        }
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
        return fetch(`${this.apiRoot}${relativeUrl}`, { headers: headers })
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

    getAllChildrenOf(parentId, raise_exception = false) {
        return this.fetch(`/v1/region/?format=json&is_child_of=${parentId}`, raise_exception);
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

    getServicePage(locationSlug, coords = {}, searchCriteria = "", page = 1, pageSize = 10, types, raise_exception = false) {
        let url = `/v1/services/search/?format=json&geographic_region=${locationSlug}`;

        if (coords.hasOwnProperty('latitude')) {
            const {latitude, longitude} = coords;
            url += `&closest=${latitude},${longitude}`;
        }
        if (!!searchCriteria) {
            url += `&name=${searchCriteria}`;
        }
        if (!!types) {
            url += `&type_numbers=${types}`;
        }
        url += `&page=${page}&page_size=${pageSize}`;
        return this.fetch(url, raise_exception);
    }

    getServices(locationSlug, latitude, longitude, raise_exception = false, page = 1, pageSize = 10) {
        let paging = `page=${page}&page_size=${pageSize}`;
        let map = (res) => {
            return res.results;
        };
        if (latitude && longitude) {
            return this.fetch(`/v1/services/search/?format=json&geographic_region=${locationSlug}&${paging}
        &closest=${latitude},${longitude}`, raise_exception).then(map);
        }
        else return this.fetch(`/v1/services/search/?format=json&geographic_region=${locationSlug}&${paging}`, raise_exception).then(map);
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

    sendEmail(name, subject, email, message) {
        return this.post('/send_email/', {
            name,
            subject,
            email,
            message
        });
    }
}

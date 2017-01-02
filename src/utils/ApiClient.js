import {API_PATH} from '../constants';

const InteractionManager = require('InteractionManager');

export default class ApiClient {

    constructor(context, props = {language: 'en'}, api_root = API_PATH) {
        if (context) {
            this.navigator = context.navigator;
        }
        this.apiRoot = api_root;
        this.language = props.language || 'en';
    }

    async fetch(relativeUrl, raiseException = false) {
        await InteractionManager.runAfterInteractions();
        const languageCode = this.language;
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };

        if (languageCode) {
            headers['Accept-Language'] = languageCode;
        }
        return fetch(`${this.apiRoot}${relativeUrl}`, {headers})
            .then((response) => response.json())
            .catch(() => {
                if (raiseException) {
                    throw 'offline';
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
            .catch(() => {
                this.navigator.to('networkFailure');
            });
    }

    getCountries(raiseException = false) {
        return this.fetch('region/?level=1&simple', raiseException);
    }

    getAllChildrenOf(parentId, raiseException = false) {
        return this.fetch(`region/?is_child_of=${parentId}&simple`, raiseException);
    }

    getLocation(slug, raiseException = false) {

        return this.fetch(`region/${slug}/`, raiseException);
    }

    getServiceTypes(raise_exception = false) {
        return this.fetch('servicetypes/?format=json', raise_exception);
    }

    getServicePage(locationSlug, coords = {}, searchCriteria = '', page = 1, pageSize = 10, types, raiseException = false) {
        let url = `services/search/?format=json&geographic_region=${locationSlug}`;

        if (coords.hasOwnProperty('latitude')) {
            const {latitude, longitude} = coords;
            url += `&closest=${latitude},${longitude}`;
        }
        if (searchCriteria) {
            url += `&name=${searchCriteria}`;
        }
        if (types) {
            url += `&type_numbers=${types}`;
        }
        url += `&page=${page}&page_size=${pageSize}`;
        return this.fetch(url, raiseException);
    }

    getService(id, raise_exception = false) {
        return this.fetch(`services/search/?format=json&id=${id}`, raise_exception);
    }


    getRating(region, index, content_slug) {
        let identifier = content_slug ? `&content_slug=${content_slug}` : `&index=${index}`;
        return this.fetch(`region/get_rate/?region_slug=${region.slug}${identifier}`);
    }

    setRating(region, index, content_slug, rating) {
        return this.post('region/add_rate/?format=json', {
            region_slug: region.slug,
            index,
            info_slug: content_slug,
            rate: rating
        });
    }

    removeRating(region, index, content_slug, rating) {
        return this.post('region/remove_rate/?format=json', {
            region_slug: region.slug,
            index,
            info_slug: content_slug,
            rate: rating
        });
    }
}

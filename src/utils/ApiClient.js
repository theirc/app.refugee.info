import {API_PATH} from '../constants';
import {Actions} from 'react-native-router-flux';

const InteractionManager = require('InteractionManager');


export default class ApiClient {

    constructor(context, props = {language: 'en'}, apiRoot = API_PATH) {
        this.apiRoot = apiRoot;
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
                    Actions.networkFailure();
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
                Actions.networkFailure();
            });
    }

    getCountries(raiseException = false) {
        return this.fetch(`region/?level=1&no_content&language=${this.language}`, raiseException);
    }

    getCountry(slug, raiseException = false, language = 'en') {
        return this.fetch(`region/${slug}?no_content&language=${language}`, raiseException);
    }

    getAllChildrenOf(parentId, raiseException = false) {
        return this.fetch(`region/?is_child_of=${parentId}&no_content&language=${this.language}`, raiseException);
    }

    async getLocation(slug, raiseException = false) {
        let returnRegion = await this.fetch(`region/${slug}/?language=${this.language}`, raiseException);

        // Retrofitting the old with the new:
        let fullObject = await this.fetch(`regions/${returnRegion.id}/?language=${this.language}`, raiseException);

        returnRegion.apps = (fullObject && fullObject.apps) || [];
        returnRegion.object = fullObject;

        return {...fullObject, ...returnRegion};
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
            url += `&search=${searchCriteria}`;
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

    getAbout(raiseException = false) {
        return this.fetch(`about/${this.language}`, raiseException);
    }

}

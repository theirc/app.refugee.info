

export default class ApiClient {

    constructor(api_root='http://api.refugee.info/v1/') {
        this.apiRoot = api_root;
    }

    getRootLocations() {
        return fetch(`${this.apiRoot}region/?format=json&level=1`)
            .then((response) => response.json());
    }

    getRegions(parentId) {
        return fetch(`${this.apiRoot}region/?format=json&parent=${parentId}&level=2`)
            .then((response) => response.json());
    }
    
    getCities(parentId) {
        return fetch(`${this.apiRoot}region/?format=json&parent=${parentId}&level=3`)
            .then((response) => response.json());
    }
}

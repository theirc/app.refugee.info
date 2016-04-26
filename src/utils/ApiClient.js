

export default class ApiClient {

    constructor(api_root='http://api.refugee.info') {
        this.apiRoot = api_root;
    }

    fetch(relativeUrl) {
        return fetch(`${this.apiRoot}${relativeUrl}`)
            .then((response) => response.json());
    }

    getRootLocations() {
        return this.fetch('/v1/region/?format=json&level=1');
    }

    getLocations(parentId) {
        return this.fetch(`/v1/region/?format=json&parent=${parentId}`);
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
}

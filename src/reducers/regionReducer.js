export default (state = {region: null}, action) => {
    switch (action.type) {
    case 'REGION_CHANGED':
        return Object.assign({}, state, {region: action.payload});
    default:
        return state;
    }
};

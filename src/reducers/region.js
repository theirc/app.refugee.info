export default (state = null, action) => {
    switch (action.type) {
    case 'REGION_CHANGED':
        return action.payload;
    case 'RECEIVE_REGION':
        return action.payload;
    default:
        return state;
    }
};



export default (state = false, action) => {
    switch (action.type) {
    case 'DRAWER_CHANGED':
        return action.payload;
    default:
        return state;
    }
};

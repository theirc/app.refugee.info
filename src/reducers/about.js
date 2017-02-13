export default (state = null, action) => {
    switch (action.type) {
    case 'ABOUT_CHANGED':
        return action.payload;
    default:
        return state;
    }
};

export default (state = 'en', action) => {
    switch (action.type) {
    case 'CHANGE_LANGUAGE':
        return action.payload;
    default:
        return state;
    }
};

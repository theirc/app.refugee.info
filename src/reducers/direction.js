export default (state = 'ltr', action) => {
    switch (action.type) {
    case 'CHANGE_DIRECTION':
        return action.payload;
    default:
        return state;
    }
};

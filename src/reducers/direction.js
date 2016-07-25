export default (state = 'ltr', action) => {
    switch (action.type) {
    case 'DIRECTION_CHANGED':
        return action.payload;
    default:
        return state;
    }
};

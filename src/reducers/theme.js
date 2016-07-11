export default (state = 'dark', action) => {
    switch (action.type) {
        case 'THEME_CHANGED':
            return action.payload;
        case 'RECEIVE_THEME':
            return action.payload;
        default:
            return state;
    }
};

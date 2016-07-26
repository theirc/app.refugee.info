export default (state = 'dark', action) => {
    switch (action.type) {
        case 'THEME_CHANGED':
            return action.payload;
        default:
            return state;
    }
};

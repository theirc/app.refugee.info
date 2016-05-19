export default (state = { theme: 'light', primary: 'googleBlue'}, action) => {
    switch (action.type) {
    case 'THEME_CHANGED':
        return Object.assign(state, {theme: action.payload});
    case 'PRIMARY_CHANGED':
        return Object.assign(state, {primary: action.payload});
    default:
        return state;
    }
};

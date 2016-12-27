export default (state = '', action) => {
    switch (action.type) {
    case 'TOOLBAR_TITLE_CHANGED':
        return action.payload || '';
    default:
        return state;
    }
};

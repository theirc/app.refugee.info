export default (state = { theme: 'light', primary: 'googleBlue' }, action) => {
    switch (action.type) {
        case 'THEME_CHANGED':
            return Object.assign(state, { theme: action.payload });
        case 'PRIMARY_CHANGED':
            return Object.assign(state, { primary: action.payload });
        case 'RECEIVE_THEME':
            if (typeof (action.payload) === 'object') {
                return Object.assign(state, action.payload);
            }
            return Object.assign(state, { theme: action.payload });
        default:
            return state;
    }
};

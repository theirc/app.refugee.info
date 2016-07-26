export default (state = null, action) => {
    switch (action.type) {
        case 'LOCATIONS_CHANGED':
            if(action.payload && action.payload.metadata) {
                action.payload.pageTitle = (action.payload.metadata.page_title || '').replace('\u060c', ',').split(',')[0];
            }
            return action.payload;
        default:
            return state;
    }
};

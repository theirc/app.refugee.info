export default (state = null, action) => {
    switch (action.type) {
    case 'COUNTRY_CHANGED':
        if(action.payload && action.payload.metadata) {
          const pageTitle = (action.payload.metadata.page_title || '')
            .replace('\u060c', ',').split(',')[0];
          action.payload.pageTitle = pageTitle;
        }

        return action.payload;
    default:
        return state;
    }
};

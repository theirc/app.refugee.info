import React from 'react';
import {InteractionManager} from 'react-native';

export default class DrawerCommons {

    constructor(component) {
        this.component = component;
    }

    closeDrawer() {
        this.component.context.drawer.close()
    }

    changeScene(path, name, props = {}) {
        const {drawer, navigator} = this.component.context;
        const {dispatch} = this.component.props;
        InteractionManager.runAfterInteractions(() => {
            navigator.to(path, name, props);
            dispatch({type: 'ROUTE_CHANGED', payload: path});
            this.closeDrawer();
        });
    };
}

import {
    View,
    StatusBar,
    Platform
} from 'react-native';
import React, { Component } from 'react';
import { Toolbar } from '../components';
import { connect } from 'react-redux';
import scenes from '../routes';
import { Router, Reducer } from 'react-native-router-flux';
import { GA_TRACKER } from '../constants';

const RouterWithRedux = connect()(Router);

export class App extends Component {

    toggleDrawer = () => {
        if (!this.state.drawerOpen) {
            this.drawer.open();
        } else {
            this.drawer.close();
        }
    };

    renderStatusBar() {
        if (Platform.OS === 'ios') {
            return (
                <StatusBar
                    barStyle="default"
                    />
            );
        } else {
            return (
                <StatusBar
                    backgroundColor="rgba(0,0,0,0.3)"
                    translucent
                    />
            );
        }
    }

    render() {
        const reducerCreate = params => {
            const defaultReducer = Reducer(params)
            return (state, action) => {
                if (action.scene) {
                    GA_TRACKER.trackScreenView(action.scene.sceneKey);
                }
                return defaultReducer(state, action);
            }
        }

        const statusBar = this.renderStatusBar();
        return (
            <View style={{ flex: 1 }}>
                {statusBar}
                <RouterWithRedux
                    createReducer={reducerCreate}
                    navBar={Toolbar}
                    scenes={scenes}
                    />
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return { ...state };
};

export default connect(mapStateToProps)(App);

import {
    View,
    StatusBar,
    Platform
} from 'react-native';
import React, {Component} from 'react';
import {Toolbar} from '../components';
import {connect} from 'react-redux';
import scenes from '../routes';
import {Router, Reducer, Actions} from 'react-native-router-flux';
import {GA_TRACKER} from '../constants';

const RouterWithRedux = connect()(Router);

export class App extends Component {

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
            const defaultReducer = Reducer(params);
            return (state, action) => {
                if (action.scene) {
                    GA_TRACKER.trackScreenView(action.scene.sceneKey);
                }
                return defaultReducer(state, action);
            };
        };

        const backAndroidHandler = () => {
            const {drawerOpen, dispatch, region, routes} = this.props;
            if (drawerOpen) {
                dispatch({type: 'DRAWER_CHANGED', payload: false});
            } else if (!region && routes.scene.sceneKey == 'countryChoice') {
                // close app at initialize screen, when region is not set yet
                return false;
            } else {
                try {
                    Actions.pop();
                    return true;
                } catch (err) {
                    return false;
                }
            }
            return true;
        };

        const statusBar = this.renderStatusBar();
        return (
            <View style={{flex: 1}}>
                {statusBar}
                <RouterWithRedux
                    backAndroidHandler={backAndroidHandler}
                    createReducer={reducerCreate}
                    navBar={Toolbar}
                    scenes={scenes}
                />
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        drawerOpen: state.drawerOpen,
        region: state.region,
        routes: state.routes,
        ...state
    };
};

export default connect(mapStateToProps)(App);

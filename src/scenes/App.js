import {
    View,
    StatusBar,
    Platform
} from 'react-native';
import React, {Component} from 'react';
import {Toolbar} from '../components';
import {connect} from 'react-redux';
import scenes from '../routes';
import {Router} from 'react-native-router-flux';

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
        const statusBar = this.renderStatusBar();
        return (
            <View style={{flex: 1}}>
                {statusBar}
                <RouterWithRedux
                    navBar={Toolbar}
                    scenes={scenes}
                />
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return {...state};
};

export default connect(mapStateToProps)(App);

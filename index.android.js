import Navigate from './src/utils/Navigate';
import { Toolbar } from './src/components';
import Navigation from './src/scenes/Navigation';
import React, { Component } from 'react';
import {
    AppRegistry,
    Navigator,
    DrawerLayoutAndroid,
    View
} from 'react-native';
import {Provider} from 'react-redux';
import store from './src/store';
import styles from './src/styles';
import { fetchRegionFromStorage } from './src/actions/region';

store.dispatch(fetchRegionFromStorage());

class RefugeeInfoApp extends Component {

    static childContextTypes = {
        drawer: React.PropTypes.object,
        navigator: React.PropTypes.object
    };

    constructor(props) {
        super(props);
        this.state = {
            drawer: null,
            navigator: null
        };
    }

    getChildContext = () => {
        return {
            drawer: this.state.drawer,
            navigator: this.state.navigator
        };
    };

    setDrawer = (drawer) => {
        this.setState({
            drawer
        });
    };

    setNavigator = (navigator) => {
        this.setState({
            navigator: new Navigate(navigator, store)
        });
    };

    render() {
        const { drawer, navigator } = this.state;
        const navView = React.createElement(Navigation);


        return (
            <Provider store={store}>
                <DrawerLayoutAndroid
                    drawerPosition={DrawerLayoutAndroid.positions.Left}
                    drawerWidth={300}
                    ref={(drawer) => { !this.state.drawer ? this.setDrawer(drawer) : null; }}
                    renderNavigationView={() => {
                        if (drawer && navigator) {
                            return navView;
                        }
                        return null;
                    }}
                >
                    {drawer &&
                    <Navigator
                        configureScene={() => {
                            return Navigator.SceneConfigs.FadeAndroid;
                        }}
                        initialRoute={Navigate.getInitialRoute()}
                        navigationBar={<Toolbar onIconPress={drawer.openDrawer} />}
                        ref={(navigator) => { !this.state.navigator ? this.setNavigator(navigator) : null; }}
                        renderScene={(route) => {
                            if (this.state.navigator && route.component) {
                                return (
                                    <View
                                        showsVerticalScrollIndicator={false}
                                        style={styles.scene}
                                    >
                                        <route.component
                                            path={route.path}
                                            title={route.title}
                                            {...route.props}
                                        />
                                    </View>
                                );
                            }
                        }}
                    />
                    }
                </DrawerLayoutAndroid>
            </Provider>
        );

    }
}

AppRegistry.registerComponent('RefugeeInfoApp', () => RefugeeInfoApp);

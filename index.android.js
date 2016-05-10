/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import Navigate from './src/utils/Navigate';
import { Toolbar } from './src/components';
import Navigation from './src/scenes/Navigation';

import React, { Component } from 'react';
import {
    AppRegistry,
    Navigator,
    DrawerLayoutAndroid,
    StyleSheet,
    View
} from 'react-native';

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
            navigator: new Navigate(navigator)
        });
    };

    render() {
        const { drawer, navigator } = this.state;
        const navView = React.createElement(Navigation);


        return (
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
        );

    }
}

const styles = StyleSheet.create({
    scene: {
        flex: 1,
        marginTop: 56
    }
});

AppRegistry.registerComponent('RefugeeInfoApp', () => RefugeeInfoApp);

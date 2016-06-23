import {
    AppRegistry,
    Text,
    View,
    Navigator,
    StatusBar
} from 'react-native';
import React, {Component, PropTypes} from 'react';
import Navigation from './src/scenes/Navigation';
import Navigate from './src/utils/Navigate';
import { Toolbar } from './src/components';
import Drawer from 'react-native-drawer'
import {Provider} from 'react-redux';
import store from './src/store';
import { fetchRegionFromStorage } from './src/actions/region';
import styles from './src/styles';

store.dispatch(fetchRegionFromStorage());

class RefugeeInfoApp extends Component {

    static childContextTypes = {
        drawer: React.PropTypes.object,
        navigator: React.PropTypes.object,
        theme: React.PropTypes.oneOf(['light', 'dark'])
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

    closeDrawer = () => {
        this.drawer.close()
    };
    openDrawer = () => {
        this.drawer.open()
    };

    setNavigator = (navigator) => {
        this.setState({
            navigator: new Navigate(navigator, store)
        });
    };

    render() {
        const { drawer, navigator } = this.state;
        return (
        <Provider store={store}>
            <Drawer
                ref={(drawer) =>{
                    this.drawer = drawer;
                }}
                type="overlay"
                acceptTap={true}
                content={
                    <Navigation />
                }
                tapToClose={true}
                styles={{
                main: {
                    paddingLeft: 3,
                    backgroundColor: '#F5F5F5'
                },
                drawer: {
                    backgroundColor: '#ffffff',
                    shadowOpacity: 0.8,
                    shadowRadius: 3
                }}}
                onOpen={() => {
                    this.setState({drawerOpen: true})
                }}
                onClose={() => {
                    this.setState({drawerOpen: false})
                }}
                captureGestures={false}
                tweenDuration={100}
                panThreshold={0.08}
                openDrawerOffset={0.2}
                closedDrawerOffset={() => -3}
                panOpenMask={0.02}
            >
                <StatusBar
                    barStyle={'light-content'}
                />
                {!drawer &&
                <Navigator
                    configureScene={() => {
                        return Navigator.SceneConfigs.FloatFromBottom;
                    }}
                    initialRoute={Navigate.getInitialRoute()}
                    navigationBar={<Toolbar onIconPress={this.openDrawer} />}
                    ref={(navigator) => { !this.state.navigator ? this.setNavigator(navigator) : null; }}
                    renderScene={(route) => {
                        if (this.state.navigator && route.component) {
                            return (
                                <View
                                    showsVerticalScrollIndicator={true}
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
            </Drawer>
        </Provider>
        )
    }
}

AppRegistry.registerComponent('RefugeeInfoApp', () => RefugeeInfoApp);

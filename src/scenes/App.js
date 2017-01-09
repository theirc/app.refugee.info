import {
    View,
    Navigator,
    StatusBar,
    Platform,
    BackAndroid
} from 'react-native';
import React, {Component} from 'react';
import Navigation from './Navigation';
import Navigate from '../utils/Navigate';
import {Toolbar} from '../components';
import Drawer from 'react-native-drawer';
import store from '../store';
import {connect} from 'react-redux';

import styles, {themes} from '../styles';

export class App extends Component {

    static childContextTypes = {
        drawer: React.PropTypes.object,
        navigator: React.PropTypes.object
    };

    constructor(props) {
        super(props);
        this.state = Object.assign({}, store.getState(), {
            drawer: null,
            navigator: null,
            drawerBackgroundColor: null,
            drawerBorderColor: null
        });
        BackAndroid.addEventListener('hardwareBackPress', this._hardwareBackPress);
    }

    getChildContext = () => {
        return {
            drawer: this.state.drawer,
            navigator: this.state.navigator
        };
    };
    toggleDrawer = () => {
        if (!this.state.drawerOpen) {
            this.drawer.open();
        } else {
            this.drawer.close();
        }
    };

    _hardwareBackPress = () => {
        if (this.state.drawerOpen) {
            this.drawer.close();
            return true;
        } else {
            return this.state.navigator._hardwareBackPress();
        }
    };

    setNavigator = (navigator) => {
        this.setState({
            navigator: new Navigate(navigator, store)
        });
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
        const {navigator} = this.state;
        const {dispatch} = this.props;

        const statusBar = this.renderStatusBar();
        return (
            <Drawer
                acceptTap
                captureGestures={true}
                closedDrawerOffset={0}
                content={
                    <Navigation />
                }
                onClose={() => {
                    this.setState({drawerOpen: false});
                    dispatch({type: 'DRAWER_CHANGED', payload: false});
                }}
                onOpen={() => {
                    this.setState({drawerOpen: true});
                    dispatch({type: 'DRAWER_CHANGED', payload: true});
                }}
                openDrawerOffset={0.2}
                panOpenMask={0.02}
                panThreshold={0.08}
                ref={(drawer) => {this.drawer = drawer}}
                side="left"
                styles={drawerStyles}
                tapToClose
                tweenDuration={100}
                type="displace"
            >
                {statusBar}
                <Navigator
                    configureScene={() => {
                        let sceneConfig = null;
                        if (Platform.OS == 'ios') {
                            sceneConfig = {...Navigator.SceneConfigs.FloatFromRight};
                            sceneConfig.gestures = {...sceneConfig.gestures};
                            sceneConfig.gestures.pop = {...sceneConfig.gestures.pop};

                            if (!navigator || !navigator.isChild) {
                                sceneConfig.gestures.pop = null;
                            }
                        } else {
                            sceneConfig = Navigator.SceneConfigs.FadeAndroid;
                        }
                        return sceneConfig;
                    }}
                    initialRoute={Navigate.getInitialRoute()}
                    navigationBar={
                        <Toolbar
                            drawerOpen={this.state.drawerOpen}
                            onMenuIconPress={this.toggleDrawer}
                        />
                    }
                    ref={(navigator) => {
                        !this.state.navigator ? this.setNavigator(navigator) : null;
                    }}
                    renderScene={(route) => {
                        if (this.state.navigator && route.component) {
                            if (navigator) {
                                navigator.updateIsChild();
                            }
                            let instance = (
                                <route.component
                                    path={route.path}
                                    title={route.title}
                                    {...route.props}
                                />);

                            return (
                                <View
                                    pointerEvents={this.state.drawerOpen ? 'none' : 'auto'}
                                    showsVerticalScrollIndicator
                                    style={[
                                        styles.scene,
                                        (navigator && navigator.currentRoute && navigator.currentRoute.component.smallHeader) &&
                                        {paddingTop: (Platform.Version >= 21 || Platform.OS == 'ios') ? 80 : 55},
                                        (navigator && navigator.currentRoute && navigator.currentRoute.component.noHeader) && {paddingTop: 0}
                                    ]}
                                >
                                    {instance}
                                </View>
                            );
                        }
                    }}
                />
            </Drawer>
        );
    }
}

const drawerStyles = {
    main: {
        backgroundColor: themes.light.backgroundColor
    },
    drawer: {
        borderRightWidth: 1,
        borderLeftWidth: 1,
        borderLeftColor: themes.light.dividerColor,
        backgroundColor: themes.light.backgroundColor,
        shadowOpacity: 0.8,
        shadowRadius: 3
    }
};

const mapStateToProps = (state) => {
    return {
        direction: state.direction
    };
};

export default connect(mapStateToProps)(App);

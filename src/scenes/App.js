import {
    AppRegistry,
    Text,
    View,
    Navigator,
    StatusBar,
    TouchableOpacity,
    Platform
} from 'react-native';
import React, {Component, PropTypes} from 'react';
import Navigation from './Navigation';
import Navigate from '../utils/Navigate';
import {Toolbar} from '../components';
import Drawer from 'react-native-drawer'
import store from '../store';
import {connect} from 'react-redux';

import styles, {generateTextStyles, themes} from '../styles'

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
            drawerBorderColor: null,
        });
    }

    async componentWillMount() {

    }

    componentWillReceiveProps(props) {
        /*
         HERE BE DRAGONS
         The only way to update the backgroundColor of the drawer and the main panel
         was to use its internal api, which may change without notice.
         */
        const {theme} = props;

        let backgroundColor = theme == 'light' ? themes.light.backgroundColor : themes.dark.backgroundColor;
        let drawerBackgroundColor = theme == 'light' ? themes.light.menuBackgroundColor : themes.dark.toolbarColor;
        let drawerBorderColor = theme == 'light' ? themes.light.dividerColor : themes.dark.darkerDividerColor;

        if (this.drawer) {
            this.drawer.drawer.setNativeProps({
                style: {
                    backgroundColor: drawerBackgroundColor,
                    borderLeftColor: drawerBorderColor
                }
            });
            this.drawer.main.setNativeProps({
                style: {
                    backgroundColor: backgroundColor,
                }
            });
        }
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
    toggleDrawer = () => {
        if (!this.state.drawerOpen) {
            this.drawer.open()
        } else {
            this.drawer.close();
        }
    };

    setNavigator = (navigator) => {
        this.setState({
            navigator: new Navigate(navigator, store)
        });
    };

    render() {
        const {drawer, navigator} = this.state;
        let {direction, theme} = this.props;
        const {country, dispatch} = this.props;


        let drawerStyles = {
            main: {
                paddingLeft: direction == 'rtl' ? 3 : 0,
                backgroundColor: themes.light.backgroundColor
            },
            drawer: {
                borderLeftWidth: 1,
                borderLeftColor: themes.light.dividerColor,
                backgroundColor: themes.light.backgroundColor,
                shadowOpacity: 0.8,
                shadowRadius: 3
            }
        };

        return (
            <Drawer
                ref={(drawer) => {
                    this.drawer = drawer;
                } }
                type="displace"
                acceptTap={true}
                content={
                    <Navigation  />
                }
                tapToClose={true}
                styles={drawerStyles}
                onOpen={() => {
                    this.setState({ drawerOpen: true });
                    dispatch({ type: "DRAWER_CHANGED", payload: true });
                } }
                onClose={() => {
                    this.setState({ drawerOpen: false });
                    dispatch({ type: "DRAWER_CHANGED", payload: false });
                } }
                captureGestures={true}
                tweenDuration={100}
                panThreshold={0.08}
                openDrawerOffset={0.2}
                closedDrawerOffset={() => 0}
                panOpenMask={0.02}
                side={'right'}
            >
                <StatusBar
                    barStyle={theme == 'light' ? "default" : 'light-content'}
                />
                {!drawer &&
                <Navigator
                    configureScene={() => {
                            let sceneConfig = direction != 'rtl' ? {...Navigator.SceneConfigs.FloatFromLeft }  : {...Navigator.SceneConfigs.FloatFromRight } ;
                            sceneConfig.gestures = {...sceneConfig.gestures};
                            sceneConfig.gestures.pop ={...sceneConfig.gestures.pop};

                            if(!navigator || !navigator.isChild ) {
                                sceneConfig.gestures.pop = null;
                            }
                            
                            return sceneConfig;
                        } }
                    initialRoute={Navigate.getInitialRoute() }
                    navigationBar={
                            <Toolbar
                                theme={theme}
                                drawerOpen={this.state.drawerOpen}
                                onMenuIconPress={this.toggleDrawer}
                            />
                        }
                    ref={(navigator) => { !this.state.navigator ? this.setNavigator(navigator) : null; } }
                    onDidFocus={() => {
                        }}
                    renderScene={(route) => {
                            if (this.state.navigator && route.component) {
                                if(navigator) { 
                                    navigator.updateIsChild(); 
                                }; 

                                let instance =
                                    <route.component
                                        path={route.path}
                                        title={route.title}
                                        {...route.props}
                                        />;

                                return (
                                    <View
                                        pointerEvents={this.state.drawerOpen ? 'none' : 'auto'}
                                        showsVerticalScrollIndicator={true}
                                        style={[styles.scene,
                                            theme=='dark' && {backgroundColor: themes.dark.backgroundColor}
                                        ]}
                                        >
                                        {instance}
                                    </View>
                                );
                            }
                        } }
                />
                }
            </Drawer>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        primary: state.theme.primary,
        theme: state.theme.theme,
        direction: state.direction,
        country: state.country
    };
};

export default connect(mapStateToProps)(App);

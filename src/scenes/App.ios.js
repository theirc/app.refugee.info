import {
    AppRegistry,
    Text,
    View,
    Navigator,
    StatusBar,
    TouchableOpacity
} from 'react-native';
import React, {Component, PropTypes} from 'react';
import Navigation from './Navigation';
import Navigate from '../utils/Navigate';
import {Toolbar} from '../components';
import Drawer from 'react-native-drawer'
import {Provider} from 'react-redux';
import store from '../store';
import {connect} from 'react-redux';

import {fetchRegionFromStorage} from '../actions/region';
import {fetchDirectionFromStorage} from '../actions/direction';
import {fetchLanguageFromStorage} from '../actions/language';
import {fetchCountryFromStorage} from '../actions/country';
import {fetchThemeFromStorage} from '../actions/theme'
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

    async componentDidMount() {
        const {dispatch} = this.props;

        await dispatch(fetchRegionFromStorage());
        await dispatch(fetchDirectionFromStorage());
        await dispatch(fetchLanguageFromStorage());
        await dispatch(fetchCountryFromStorage());
        await dispatch(fetchThemeFromStorage());
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

    
    componentWillReceiveProps(props) {
        const {direction, theme} = this.props;
        if (theme) {
        
        let drawerBackgroundColor = theme == 'light' ? themes.light.backgroundColor : themes.dark.backgroundColor;
        let drawerBorderColor = theme == 'light' ? themes.light.dividerColor : themes.dark.dividerColor;

        
            this.setState({ drawerBackgroundColor:drawerBackgroundColor, drawerBorderColor:drawerBorderColor });
        }
    }

    render() {
        const {drawer, navigator} = this.state;
        let {direction, theme} = this.props;
        let sceneConfig = {...Navigator.SceneConfigs.FloatFromBottom };
        const { country, dispatch } = this.props;

        // Removing the pop gesture
        delete sceneConfig.gestures.pop;
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
                styles={{
                    main: {
                        paddingLeft: direction == 'rtl' ? 3 : 0,
                        backgroundColor: '#F5F5F5'
                    },
                    drawer: {
                        borderRightWidth: 1,
                        borderRightColor: this.state.drawerBorderColor,
                        backgroundColor: this.state.drawerBackgroundColor,
                        shadowOpacity: 0.8,
                        shadowRadius: 3
                    }
                }}
                onOpen={() => {
                    this.setState({ drawerOpen: true });
                    dispatch({ type: "DRAWER_CHANGED", payload: true });
                } }
                onClose={() => {
                    this.setState({ drawerOpen: false });
                    dispatch({ type: "DRAWER_CHANGED", payload: false });
                } }
                captureGestures={false}
                tweenDuration={100}
                panThreshold={0.08}
                openDrawerOffset={0.2}
                closedDrawerOffset={() => 0}
                panOpenMask={0.02}
                side={'right'}
                >
                <StatusBar
                    barStyle={'default'}
                    />
                {!drawer &&
                    <Navigator
                        configureScene={() => {
                            return sceneConfig;
                        } }
                        initialRoute={Navigate.getInitialRoute() }
                        navigationBar={
                            <Toolbar
                                theme={theme}
                                onMenuIconPress={this.openDrawer}
                                />
                        }
                        ref={(navigator) => { !this.state.navigator ? this.setNavigator(navigator) : null; } }
                        renderScene={(route) => {
                            if (this.state.navigator && route.component) {

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
                                        style={styles.scene}
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

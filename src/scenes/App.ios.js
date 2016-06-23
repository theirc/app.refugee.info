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
import styles from '../styles';
import {connect} from 'react-redux';

import {fetchRegionFromStorage} from '../actions/region';
import {fetchDirectionFromStorage} from '../actions/direction';
import {fetchLanguageFromStorage} from '../actions/language';
import {fetchCountryFromStorage} from '../actions/country';


export class App extends Component {

    static childContextTypes = {
        drawer: React.PropTypes.object,
        navigator: React.PropTypes.object,
        theme: React.PropTypes.oneOf(['light', 'dark'])
    };

    constructor(props) {
        super(props);
        this.state = Object.assign({}, store.getState(), {
            drawer: null,
            navigator: null
        });
    }

    async componentDidMount() {
        const {dispatch} = this.props;

        await dispatch(fetchRegionFromStorage());
        await dispatch(fetchDirectionFromStorage());
        await dispatch(fetchLanguageFromStorage());
        await dispatch(fetchCountryFromStorage());
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
        const {drawer, navigator} = this.state;
        let sceneConfig = {...Navigator.SceneConfigs.FloatFromBottom};

        // Removing the pop gesture
        delete sceneConfig.gestures.pop;

        return (
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
                      return sceneConfig;
                  }}
                    initialRoute={Navigate.getInitialRoute()}
                    navigationBar={<Toolbar onIconPress={this.openDrawer} />}
                    ref={(navigator) => { !this.state.navigator ? this.setNavigator(navigator) : null; }}
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
                  }}
                />
                }
            </Drawer>
        )
    }
}

export default connect()(App);

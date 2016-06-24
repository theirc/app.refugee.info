import Navigate from '../utils/Navigate';
import { Toolbar } from '../components';
import Navigation from './Navigation';
import React, { Component } from 'react';
import {
    AppRegistry,
    Navigator,
    DrawerLayoutAndroid,
    View
} from 'react-native';
import {Provider} from 'react-redux';
import store from '../store';
import styles from '../styles';
import { fetchRegionFromStorage } from '../actions/region';
import { fetchDirectionFromStorage } from '../actions/direction';
import { fetchLanguageFromStorage } from '../actions/language';
import { fetchCountryFromStorage } from '../actions/country';
import {connect} from 'react-redux';

export default class App extends Component {

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
        let direction = this.props.direction;

        return (
              <DrawerLayoutAndroid
                  drawerPosition={direction=='ltr'? DrawerLayoutAndroid.positions.Left : DrawerLayoutAndroid.positions.Right}
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

const mapStateToProps = (state) => {
    return {
        primary: state.theme.primary,
        theme: state.theme.theme,
        direction: state.direction
    };
};

export default connect(mapStateToProps)(App);

import React, {Component, PropTypes} from 'react';
import {AsyncStorage, Image, StyleSheet, View, Text, Dimensions} from 'react-native';
import {connect} from 'react-redux';
import DrawerCommons from '../utils/DrawerCommons';
import styles from '../styles';
import I18n from '../constants/Messages'

export default class Welcome extends Component {
    static propTypes = {
       firstLoad: React.PropTypes.bool,
       finished: React.PropTypes.func
    };

    componentDidMount() {
      setTimeout(
        () => {
          if(this.props.firstLoad) {
            setTimeout(()=>this.props.finished(), 1000);
          }
          else if(this.props.finished) {
            this.props.finished();
          }
        },
        1000
      );
    }

    render() {
      const logo = require('../assets/logo.png');
       return <View style={localStyles.screen}>
                <View>
                  <Image source={logo}
                      resizeMode={Image.resizeMode.contain} style={localStyles.logo} />
                </View>
              </View>

    }
}


const localStyles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent:'center',
    backgroundColor: '#000000'
  },
  logo: {
    width: Dimensions.get('window').width
  }
});

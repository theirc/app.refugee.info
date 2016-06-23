import React, { Component, PropTypes } from 'react';
import { Text, Image, View } from 'react-native';
import { connect } from 'react-redux';
import { Avatar, Drawer, Divider, COLOR, TYPO } from 'react-native-material-design';

import { typography } from 'react-native-material-design-styles';

import I18n from '../constants/Messages';
import {capitalize} from '../utils/helpers';
import ApiClient from '../utils/ApiClient';
import DrawerCommons from '../utils/DrawerCommons';
import { Header, Section, DirectionalText } from '../components'
import CountryHeaders from '../constants/CountryHeaders'

class Navigation extends Component {

    static contextTypes = {
        drawer: PropTypes.object.isRequired,
        navigator: PropTypes.object
    };

    constructor(props) {
        super(props);
        this.drawerCommons = new DrawerCommons(this);
    }

    _getImportantInformation() {
      const region = this.props.region;
      console.log(region);

      if(!region || !region.important_information) {
        return <View />;
      }

      return <Section
        items={region.important_information.map((i) => {
          return {
            value: i.metadata.page_title,
            active: false,
            onPress: () => false,
            onLongPress: () => false
          }
        })}
      />
    }

    render() {
        const {theme, route, region, country} = this.props;
        const { navigator } = this.context;

        if (!this.props.region) {
            return <Text>Choose location first</Text>;
        }

        let navigateTo = region.content.length == 1 ?
          () => this.drawerCommons.changeScene('infoDetails', region.content[0].title, {section: region.content[0].section}) :
          () => this.drawerCommons.changeScene('info');

        let title = require('../assets/RI-logo.png');
        let headerInformation = CountryHeaders.rs;

        if(country) {
          const countryCode = country.code.toLowerCase();
          if(CountryHeaders.hasOwnProperty(countryCode)) {
            headerInformation = CountryHeaders[countryCode];
          }
        }

        return (
            <Drawer theme={theme}>
                <Header backgroundColor={headerInformation.backgroundColor } height={75}>
                    <View style={{paddingBottom: 10, flexDirection: 'row', flex: 1, alignItems: 'flex-end'}}>
                          <DirectionalText direction={this.props.direction}
                          style={[{color: headerInformation.color}, typography.paperFontTitle]}>{region.pageTitle}</DirectionalText>
                    </View>
                </Header>
                <Section
                    items={[
                      {
                          icon: 'info',
                          value: I18n.t('GENERAL_INFO'),
                          active: route === 'info',
                          onPress: navigateTo,
                          onLongPress: navigateTo
                      },
                      {
                        icon: 'list',
                        value: I18n.t('SERVICE_LIST'),
                        active: route === 'services',
                        onPress: () => this.drawerCommons.changeScene('services'),
                        onLongPress: () => this.drawerCommons.changeScene('services')
                    }, {
                        icon: 'map',
                        value: I18n.t('EXPLORE_MAP'),
                        active: route === 'map',
                        onPress: () => this.drawerCommons.changeScene('map'),
                        onLongPress: () => this.drawerCommons.changeScene('map')
                    }
                    ]}
                />
                <Divider />
                {this._getImportantInformation()}
                <Divider />
                <Section
                    items={
                    [{
                        icon: 'public',
                        value: I18n.t('CHANGE_COUNTRY'),
                        active: !route || route === 'countryChoice',
                        onPress: () => this.drawerCommons.changeScene('countryChoice'),
                        onLongPress: () => this.drawerCommons.changeScene('countryChoice')
                    },{
                        icon: 'settings',
                        value: I18n.t('SETTINGS'),
                        active: !route || route === 'settings',
                        onPress: () => this.drawerCommons.changeScene('settings'),
                        onLongPress: () => this.drawerCommons.changeScene('settings')
                    }
                    ]}
                />
                <Divider />
            </Drawer>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        route: state.navigation,
        region: state.region,
        country: state.country,
        language: state.language,
        direction: state.direction,
        theme: state.theme.theme
    };
};

export default connect(mapStateToProps)(Navigation);

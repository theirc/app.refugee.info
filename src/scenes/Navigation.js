import React, { Component, PropTypes } from 'react';
import { Text, Image, View } from 'react-native';
import { connect } from 'react-redux';
import { Avatar, Drawer, Divider, COLOR, TYPO } from 'react-native-material-design';

import I18n from '../constants/Messages';
import {capitalize} from '../utils/helpers';
import DrawerCommons from '../utils/DrawerCommons';
import { Header, Section } from '../components/DrawerOverrides'

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
        let {theme, route, region} = this.props;
        const { navigator } = this.context;
        console.log("Language:"+ I18n.currentLocale());
        if (!this.props.region) {
            return <Text>Choose location first</Text>;
        }
        let countryId = (region) ? region.country.id : null;
        let pageTitle = region.metadata.page_title.replace('\u060c', ',').split(',')[0];

        let navigateTo = region.content.length == 1 ?
          () => this.drawerCommons.changeScene('infoDetails', region.content[0].title, {section: region.content[0].section}) :
          () => this.drawerCommons.changeScene('info', pageTitle);

        let title = require('../assets/RI-logo.png');

        return (
            <Drawer theme={theme}>
                <Header>
                    <View style={{paddingTop: 40}}>
                        <Text style={[{}, COLOR.paperGrey50, TYPO.paperFontSubhead]}>{pageTitle}</Text>
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
                        onPress: () => this.drawerCommons.changeScene('countryChoice', null, {countryId}),
                        onLongPress: () => this.drawerCommons.changeScene('countryChoice', null, {countryId})
                    },{
                        icon: 'settings',
                        value: I18n.t('SETTINGS'),
                        active: !route || route === 'countryChoice',
                        onPress: () => this.drawerCommons.changeScene('countryChoice', null, {countryId}),
                        onLongPress: () => this.drawerCommons.changeScene('countryChoice', null, {countryId})
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
        code: state.language,
        theme: state.theme.theme
    };
};

export default connect(mapStateToProps)(Navigation);

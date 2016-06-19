import React, { Component, PropTypes } from 'react';
import { Text, Image, View } from 'react-native';
import { connect } from 'react-redux';
import { Drawer,Divider } from 'react-native-material-design';
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
        let {theme, route} = this.props;
        if (!this.props.region) {
            return <Text>Choose location first</Text>;
        }
        let countryId = (this.props.region) ? this.props.region.country.id : null;

        let title = require('../assets/RI-logo.png');
        return (
            <Drawer theme={theme}>
                <Header>
                </Header>
                <Section
                    items={[
                      {
                          icon: 'info',
                          value: I18n.t('GENERAL_INFO'),
                          active: route === 'info',
                          onPress: () => this.drawerCommons.changeScene('info'),
                          onLongPress: () => this.drawerCommons.changeScene('info')
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

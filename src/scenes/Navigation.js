import React, { Component, PropTypes } from 'react';
import { Text } from 'react-native';
import { connect } from 'react-redux';
import { Drawer } from 'react-native-material-design';
import I18n from '../constants/Messages';
import {capitalize} from '../utils/helpers';
import DrawerCommons from '../utils/DrawerCommons';

class Navigation extends Component {

    static contextTypes = {
        drawer: PropTypes.object.isRequired,
        navigator: PropTypes.object
    };

    constructor(props) {
        super(props);
        this.drawerCommons = new DrawerCommons(this);
    }

    render() {
        let {theme, route} = this.props;
        if (!this.props.region) {
            return <Text>Choose location first</Text>;
        }
        let countryId = (this.props.region) ? this.props.region.country.id : null;
        return (
            <Drawer theme={theme}>
                <Drawer.Section
                    items={
                    [{
                        icon: 'public',
                        value: I18n.t('CHANGE_COUNTRY'),
                        active: !route || route === 'countryChoice',
                        onPress: () => this.drawerCommons.changeScene('countryChoice', null, {countryId}),
                        onLongPress: () => this.drawerCommons.changeScene('countryChoice', null, {countryId})
                    },{
                        icon: 'location-city',
                        value: I18n.t('CHANGE_CITY'),
                        active: !route || route === 'cityChoice',
                        onPress: () => this.drawerCommons.changeScene('cityChoice', null, {countryId}),
                        onLongPress: () => this.drawerCommons.changeScene('cityChoice', null, {countryId})
                    }
                    ]}
                    title={this.props.region && `${capitalize(this.props.region.country.name)}, ${capitalize(this.props.region.name)}`}
                />

                <Drawer.Section
                    items={[{
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
                    }, {
                        icon: 'info',
                        value: I18n.t('GENERAL_INFO'),
                        active: route === 'info',
                        onPress: () => this.drawerCommons.changeScene('info'),
                        onLongPress: () => this.drawerCommons.changeScene('info')
                    }
                    ]}
                    title={I18n.t('REFUGEE_INFO')}
                />

                {this.drawerCommons.renderLanguageSection()}
                {this.drawerCommons.renderThemeSection()}
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

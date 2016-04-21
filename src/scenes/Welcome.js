import React, { AsyncStorage, Component, PropTypes, View, Picker } from 'react-native';

import RegionDrillDown from '../components/RegionDrillDown';

export default class Welcome extends Component {

    static contextTypes = {
        navigator: PropTypes.object.isRequired
    };

    _onPress(region) {
        AsyncStorage.setItem('region', JSON.stringify(region));
        this.context.navigator.to('info');
    }

    render() {
        return (
            <View>
                <RegionDrillDown onPress={this._onPress.bind(this)} />
            </View>
        );
    }

}

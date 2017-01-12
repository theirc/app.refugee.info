import React, {Component, PropTypes} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Icon} from '../components';
import {getElevation, themes} from '../styles';

export class SearchFilterButton extends Component {

    static propTypes = {
        active: PropTypes.bool,
        floating: PropTypes.bool,
        onPressAction: PropTypes.func
    };

    render() {
        const {onPressAction, active, floating} = this.props;
        return (
            <View
                style={[
                    componentStyles.searchFilterButtonContainer,
                    !floating && componentStyles.searchFilterButtonContainerLight
                ]}
            >
                <View
                    onPress={onPressAction}
                    style={[
                        getElevation(),
                        componentStyles.searchFilterButton,
                        (active) ? componentStyles.searchFilterButtonLightActive : componentStyles.searchFilterButtonLight
                    ]}
                >
                    <TouchableOpacity
                        activeOpacity={0.6}
                        onPress={onPressAction}
                    >
                        <Icon
                            name="md-funnel"
                            style={[componentStyles.searchFilterIcon, componentStyles.searchFilterIconLight]}
                        />
                    </TouchableOpacity>

                </View>
            </View>
        );
    }
}

const componentStyles = StyleSheet.create({
    searchFilterButtonContainer: {
        width: 49,
        paddingLeft: 5,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center'
    },
    searchFilterButtonContainerLight: {
        backgroundColor: themes.light.lighterDividerColor
    },
    searchFilterButton: {
        height: 44,
        width: 44,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 2
    },
    searchFilterButtonLight: {
        backgroundColor: themes.light.backgroundColor
    },
    searchFilterButtonLightActive: {
        backgroundColor: themes.light.lighterDividerColor
    },
    searchFilterIcon: {
        fontSize: 26
    },
    searchFilterIconLight: {
        color: themes.light.textColor
    }
});

export default SearchFilterButton;

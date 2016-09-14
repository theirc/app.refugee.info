import React, {Component, PropTypes} from 'react';
import {View, Text, TextInput, StyleSheet, TouchableOpacity} from 'react-native';
import {Icon} from '../components';
import {connect} from 'react-redux';
import {getUnderlayColor, getElevation, themes} from '../styles';

export class SearchFilterButton extends Component {

    static propTypes = {
        theme: PropTypes.oneOf(['light', 'dark']),
        active: PropTypes.bool,
        onPressAction: PropTypes.func,
        floating: PropTypes.bool
    };

    render() {
        const {theme, onPressAction, active, floating} = this.props;
        return (
            <View
                style={[
                    componentStyles.searchFilterButtonContainer,
                    floating
                        ? {}
                        : theme == 'dark' ? componentStyles.searchFilterButtonContainerDark : componentStyles.searchFilterButtonContainerLight
                ]}
            >
                <View
                    onPress={onPressAction}
                    style={[
                        getElevation(),
                        componentStyles.searchFilterButton,
                        theme == 'dark'
                            ? (active)
                            ? componentStyles.searchFilterButtonDarkActive
                            : componentStyles.searchFilterButtonDark
                            : (active)
                            ? componentStyles.searchFilterButtonLightActive
                            : componentStyles.searchFilterButtonLight
                    ]}
                >
                    <TouchableOpacity
                        onPress={onPressAction}
                        activeOpacity={0.6}
                    >
                        <Icon
                            name={"md-funnel"}
                            style={[
                                componentStyles.searchFilterIcon,
                                theme == 'dark' ? componentStyles.searchFilterIconDark : componentStyles.searchFilterIconLight
                            ]}
                        />
                    </TouchableOpacity>

                </View>
            </View>
        )
    }
};

const mapStateToProps = (state) => {
    return {
        region: state.region,
        direction: state.direction,
        language: state.language
    };
};

const componentStyles = StyleSheet.create({
    searchFilterButtonContainer: {
        width: 60,
        height: 60,
        paddingTop: 5,
        paddingRight: 5,
        paddingBottom: 7,
        paddingLeft: 2
    },
    searchFilterButtonContainerLight: {
        backgroundColor: themes.light.dividerColor
    },
    searchFilterButtonContainerDark: {
        backgroundColor: themes.dark.menuBackgroundColor
    },
    searchFilterButton: {
        flex: 1,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 2
    },
    searchFilterButtonLight: {
        backgroundColor: themes.light.backgroundColor
    },
    searchFilterButtonDark: {
        backgroundColor: themes.dark.toolbarColor
    },
    searchFilterButtonLightActive: {
        backgroundColor: themes.light.lighterDividerColor
    },
    searchFilterButtonDarkActive: {
        backgroundColor: themes.dark.backgroundColor
    },
    searchFilterIcon: {
        fontSize: 28
    },
    searchFilterIconDark: {
        color: themes.dark.textColor
    },
    searchFilterIconLight: {
        color: themes.light.textColor
    }
});

export default connect(mapStateToProps)(SearchFilterButton);

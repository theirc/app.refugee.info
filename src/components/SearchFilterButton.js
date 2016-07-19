import React, {Component, PropTypes} from 'react';
import {View, Text, TextInput, StyleSheet, TouchableHighlight} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {connect} from 'react-redux';
import {getUnderlayColor, themes} from '../styles';

export default class SearchFilterButton extends Component {

    static propTypes = {
        theme: PropTypes.oneOf(['light', 'dark']),
        active: PropTypes.bool,
        onPressAction: PropTypes.func
    };

    render() {
        const {theme, onPressAction, active} = this.props;
        return (
            <View
                style={[
                    componentStyles.searchFilterButtonContainer,
                    theme == 'dark' ? componentStyles.searchFilterButtonContainerDark : componentStyles.searchFilterButtonContainerLight
                ]}
            >
                <TouchableHighlight
                    onPress={onPressAction}
                    underlayColor={getUnderlayColor(theme)}
                >
                    <View
                        style={[
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
                        <Icon
                            name={active ? "md-funnel" : "ios-options"}
                            style={[
                                componentStyles.searchFilterIcon,
                                theme == 'dark' ? componentStyles.searchFilterIconDark : componentStyles.searchFilterIconLight
                            ]}
                        />
                    </View>
                </TouchableHighlight>
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
        width: 46,
        height: 46,
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
        shadowColor: 'black',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.4,
        shadowRadius: 1,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center'
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

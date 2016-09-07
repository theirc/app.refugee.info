import React, {Component, PropTypes} from 'react';
import {View, Text, TextInput, StyleSheet, Platform} from 'react-native';
import {Icon} from '../components';
import I18n from '../constants/Messages';
import {connect} from 'react-redux';
import {getFontFamily, getElevation, themes} from '../styles';

export class SearchBar extends Component {

    static propTypes = {
        theme: PropTypes.oneOf(['light', 'dark']),
        searchFunction: PropTypes.func,
        floating: PropTypes.bool,
        initialSearchText: PropTypes.string
    };

    render() {
        const {theme, searchFunction, language, floating} = this.props;
        return (
            <View style={[
                    componentStyles.searchBarContainer,
                    floating
                        ? {}
                        : theme=='dark' ? componentStyles.searchBarContainerDark : componentStyles.searchBarContainerLight
                ]}
            >
                <View
                    style={[
                        getElevation(),
                        componentStyles.searchBar,
                        theme=='dark' ? componentStyles.searchBarDark : componentStyles.searchBarLight
                    ]}
                >
                    <View style={componentStyles.searchBarIconContainer}>
                        <Icon
                            name="ios-search"
                            style={[
                                componentStyles.searchBarIcon,
                                theme=='dark' ? componentStyles.searchBarIconDark : componentStyles.searchBarIconLight
                            ]}
                        />
                    </View>
                    <TextInput
                        style={[
                            componentStyles.searchBarInput,
                            getFontFamily(language),
                            theme=='dark' ? componentStyles.searchBarIconDark : componentStyles.searchBarIconLight
                        ]}
                        placeholder={I18n.t('SEARCH')}
                        returnKeyType={'search'}
                        autoCapitalize="none"
                        autoCorrect={false}
                        onEndEditing={searchFunction}
                        placeholderTextColor={
                            theme=='dark' ? themes.dark.lighterDividerColor : themes.light.darkerDividerColor
                        }
                        underlineColorAndroid='transparent'
                        defaultValue={this.props.initialSearchText}
                        clearButtonMode="always"
                    />
                </View>
            </View>
        )
    }
};

const mapStateToProps = (state) => {
    return {
        primary: state.theme.primary,
        region: state.region,
        direction: state.direction,
        language: state.language
    };
};

const componentStyles = StyleSheet.create({
    searchBarContainer: {
        flex: 1,
        padding: 5,
        height: 46
    },
    searchBarContainerLight: {
        backgroundColor: themes.light.dividerColor
    },
    searchBarContainerDark: {
        backgroundColor: themes.dark.menuBackgroundColor
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 36,
        borderRadius: 2
    },
    searchBarLight: {
        backgroundColor: themes.light.backgroundColor
    },
    searchBarDark: {
        backgroundColor: themes.dark.toolbarColor
    },
    searchBarIconContainer: {
        height: 36,
        width: 36,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    searchBarIcon: {
        fontSize: 22
    },
    searchBarIconLight: {
        color: themes.light.darkerDividerColor
    },
    searchBarIconDark: {
        color: themes.dark.lighterDividerColor
    },
    searchBarInput: {
        flex: 1,
        fontSize: 13
    }
});

export default connect(mapStateToProps)(SearchBar);

import React, {Component, PropTypes} from 'react';
import {View, TouchableOpacity, TextInput, StyleSheet} from 'react-native';
import {Icon} from '../components';
import I18n from '../constants/Messages';
import {getElevation, themes} from '../styles';

export class SearchBar extends Component {

    static propTypes = {
        buttonActive: PropTypes.bool,
        buttonOnPressAction: PropTypes.func,
        drawerButton: PropTypes.bool,
        floating: PropTypes.bool,
        initialSearchText: PropTypes.string,
        searchFunction: PropTypes.func
    };

    static contextTypes = {
        drawer: PropTypes.object.isRequired
    };

    render() {
        const {searchFunction, floating, buttonOnPressAction, drawerButton} = this.props;
        return (
            <View style={[
                componentStyles.searchBarContainer,
                !floating && componentStyles.searchBarContainerLight
            ]}
            >
                <View
                    style={[
                        getElevation(),
                        componentStyles.searchBar,
                        componentStyles.searchBarLight
                    ]}
                >
                    <View style={componentStyles.searchBarIconContainer}>
                        <Icon
                            name="ios-search"
                            style={[componentStyles.searchBarIcon, componentStyles.searchBarIconLight]}
                        />
                    </View>
                    <TextInput
                        autoCapitalize="none"
                        autoCorrect={false}
                        clearButtonMode="always"
                        defaultValue={this.props.initialSearchText}
                        onEndEditing={searchFunction}
                        placeholder={I18n.t('SEARCH')}
                        placeholderTextColor={themes.light.darkerDividerColor}
                        returnKeyType={'search'}
                        style={[componentStyles.searchBarInput, componentStyles.searchBarIconLight]}
                        underlineColorAndroid="transparent"
                    />

                    {buttonOnPressAction &&
                    <TouchableOpacity
                        activeOpacity={0.6}
                        onPress={buttonOnPressAction}
                        style={{height: 48, width: 48, alignItems: 'center', justifyContent: 'center'}}
                    >
                        <Icon
                            name={'md-funnel'}
                            style={{fontSize: 24}}
                        />
                    </TouchableOpacity>}

                    {buttonOnPressAction && drawerButton &&
                    <View style={componentStyles.divider}/>}

                    {drawerButton &&
                    <TouchableOpacity
                        activeOpacity={0.6}
                        onPress={() => this.context.drawer.open()}
                        style={{height: 48, width: 48, alignItems: 'center', justifyContent: 'center'}}
                    >
                        <Icon
                            style={{fontSize: 24}}
                            name={'ios-menu'}
                        />
                    </TouchableOpacity>}
                </View>
            </View>
        );
    }
}


const componentStyles = StyleSheet.create({
    searchBarContainer: {
        flex: 1,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center'
    },
    searchBarContainerLight: {
        backgroundColor: themes.light.lighterDividerColor
    },
    searchBarContainerDark: {
        backgroundColor: themes.dark.menuBackgroundColor
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 44,
        borderRadius: 2
    },
    searchBarLight: {
        backgroundColor: themes.light.backgroundColor
    },
    searchBarDark: {
        backgroundColor: themes.dark.toolbarColor
    },
    searchBarIconContainer: {
        height: 44,
        width: 44,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    searchBarIcon: {
        fontSize: 24
    },
    searchBarIconLight: {
        color: themes.light.darkerDividerColor
    },
    searchBarIconDark: {
        color: themes.dark.lighterDividerColor
    },
    searchBarInput: {
        flex: 1,
        fontSize: 14
    },
    divider: {
        width: 2,
        height: 32,
        marginVertical: 8,
        marginHorizontal: 4,
        backgroundColor: themes.light.dividerColor
    }
});

export default SearchBar;

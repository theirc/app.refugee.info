import React, {Component, PropTypes} from 'react';
import {View, Text, TextInput, StyleSheet, Platform} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import I18n from '../constants/Messages';
import {connect} from 'react-redux';
import {generateTextStyles, themes} from '../styles';

export default class SearchBar extends Component {

    static propTypes = {
        theme: PropTypes.oneOf(['light', 'dark']),
        searchFunction: PropTypes.func
    };

    render() {
        const {theme, searchFunction, language} = this.props;
        return (
            <View style={[
                    componentStyles.searchBarContainer,
                    theme=='dark' ? componentStyles.searchBarContainerDark : componentStyles.searchBarContainerLight
                ]}
            >
                <View
                    style={[
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
                            generateTextStyles(language),
                            theme=='dark' ? componentStyles.searchBarIconDark : componentStyles.searchBarIconLight
                        ]}
                        placeholder={I18n.t('SEARCH')}
                        returnKeyType={'search'}
                        autoCapitalize="none"
                        autoCorrect={false}
                        onChangeText={searchFunction}
                        placeholderTextColor={
                            theme=='dark' ? themes.dark.lighterDividerColor : themes.light.darkerDividerColor
                        }
                        underlineColorAndroid='transparent'
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
        shadowColor: 'black',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.4,
        shadowRadius: 1,
        flexDirection: 'row',
        paddingTop: (Platform.OS==='ios') ? 5 : 0,
        paddingBottom: (Platform.OS==='ios') ? 6 : 0,
        paddingLeft: 10,
        paddingRight: 10,
        height: 36
    },
    searchBarLight: {
        backgroundColor: themes.light.backgroundColor
    },
    searchBarDark: {
        backgroundColor: themes.dark.toolbarColor
    },
    searchBarIconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    searchBarIcon: {
        marginLeft: 5,
        marginRight: 10,
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

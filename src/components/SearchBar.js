import React, {Component, PropTypes} from 'react';
import {View, TouchableOpacity, TextInput, StyleSheet} from 'react-native';
import {Icon} from '../components';
import I18n from '../constants/Messages';
import {connect} from 'react-redux';
import {getElevation, themes} from '../styles';

export class SearchBar extends Component {

    static propTypes = {
        drawerButton: PropTypes.bool,
        floating: PropTypes.bool,
        initialSearchText: PropTypes.string,
        language: PropTypes.string,
        searchFunction: PropTypes.func
    };

    static contextTypes = {
        drawer: PropTypes.object.isRequired
    };

    render() {
        const {searchFunction, floating, drawerButton, language} = this.props;
        const isRTL = ['ar', 'fa'].indexOf(language) > -1;
        return (
            <View style={[
                componentStyles.searchBarContainer,
                !floating && componentStyles.searchBarContainerLight]}
            >
                <View
                    style={[
                        getElevation(),
                        componentStyles.searchBar,
                        componentStyles.searchBarLight
                    ]}
                >
                    {drawerButton &&
                    <TouchableOpacity
                        activeOpacity={0.6}
                        onPress={() => this.context.drawer.open()}
                        style={{height: 48, width: 48, alignItems: 'center', justifyContent: 'center'}}
                    >
                        <Icon
                            name={'ios-menu'}
                            style={{fontSize: 27}}
                        />
                    </TouchableOpacity>}

                    {!drawerButton &&
                    <View style={componentStyles.searchBarIconContainer}>
                        <Icon
                            name="ios-search"
                            style={[componentStyles.searchBarIcon, componentStyles.searchBarIconLight]}
                        />
                    </View>}

                    <TextInput
                        autoCapitalize="none"
                        autoCorrect={false}
                        blurOnSubmit
                        clearButtonMode="always"
                        defaultValue={this.props.initialSearchText}
                        onSubmitEditing={searchFunction}
                        placeholder={I18n.t('SEARCH')}
                        placeholderTextColor={themes.light.darkerDividerColor}
                        returnKeyType={'search'}
                        style={[componentStyles.searchBarInput, componentStyles.searchBarIconLight, isRTL && {textAlign: 'right'}]}
                        underlineColorAndroid="transparent"
                    />
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
    searchBarInput: {
        flex: 1,
        fontSize: 14
    }
});


const mapStateToProps = (state) => {
    return {
        language: state.language
    };
};

export default connect(mapStateToProps)(SearchBar);


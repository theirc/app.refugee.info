import React, {Component, PropTypes} from 'react';
import {View, Text, TextInput} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import I18n from '../constants/Messages';
import {connect} from 'react-redux';
import styles from '../styles';

export default class SearchBar extends Component {

    static propTypes = {
        theme: PropTypes.oneOf(['light', 'dark']),
        searchFunction: PropTypes.func
    };

    render() {
        const {theme, searchFunction} = this.props;
        return (
            <View style={[
                    styles.searchBarContainer,
                    theme=='dark' ? styles.viewHeaderContainerDark : styles.viewHeaderContainerLight
                ]}
            >
                <View
                    style={[
                        styles.searchBar,
                        theme=='dark' ? styles.searchBarDark : styles.searchBarLight
                    ]}
                >
                    <View style={styles.searchBarIconContainer}>
                        <Icon
                            name="ios-search"
                            style={[
                            styles.searchBarIcon,
                            theme=='dark' ? styles.searchBarIconDark : styles.searchBarIconLight
                        ]}
                        />
                    </View>
                    <TextInput
                        style={[
                            styles.searchBarInput,
                            theme=='dark' ? styles.searchBarIconDark : styles.searchBarIconLight
                        ]}
                        placeholder={I18n.t('SEARCH')}
                        returnKeyType={'search'}
                        autoCapitalize="none"
                        autoCorrect={false}
                        onChangeText={searchFunction}
                    />
                </View>
            </View>
        )
    }
};

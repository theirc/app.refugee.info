import React, {Component, PropTypes} from 'react';
import {View, Text} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import I18n from '../constants/Messages';
import {connect} from 'react-redux';
import styles from '../styles';

export default class SearchBar extends Component {

    static propTypes = {
        theme: PropTypes.oneOf(['light', 'dark'])
    };

    render() {
        const {theme} = this.props;
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
                    
                </View>
            </View>
        )
    }
};

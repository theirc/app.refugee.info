
import React, {Component, PropTypes} from 'react';
import {
    View,
    Text,
    AsyncStorage,
    StyleSheet,
    ListView,
    TouchableHighlight,
    TextInput,
    ScrollView,
    RefreshControl
} from 'react-native';
import I18n from '../constants/Messages';
import {MapButton, OfflineView, DirectionalText, SearchBar} from '../components';
import {connect} from 'react-redux';
import ApiClient from '../utils/ApiClient';
import styles from '../styles';
import store from '../store';
import {Icon} from '../components';

const GOOGLE_API_PREFIX = 'https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=-1&q=';

export default class News extends Component {
    constructor(language = 'en') {
        super();
        this.language = language;
    }

    async downloadNews() {
        const NEWS_THAT_MOVES = `https://newsthatmoves.org/${this.language}/feed/`;
        let feed = await fetch(GOOGLE_API_PREFIX + NEWS_THAT_MOVES);
        let json = await feed.json();

        return json.responseData;
    }
}
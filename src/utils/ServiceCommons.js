import React from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import I18n from '../constants/Messages';
import styles, {themes} from '../styles';

export default class ServiceCommons {

    renderStars(rating) {
        return ([...new Array(5)].map((x, i) => (
            <Icon
                key={i}
                name={(rating >= i + 1) ? 'star' : 'star-o'}
                style={[
                    styles.ratingIcon,
                    (rating >= i + 1) ? null: {color: themes.light.dividerColor}
                ]}
            />
          )));
    }
}

import React from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet
} from 'react-native';
import { default as Icon } from 'react-native-vector-icons/FontAwesome';
import I18n from '../constants/Messages';
import styles from '../styles';

export default class ServiceCommons {

    renderStars(rating, direction) {
        if (direction=='rtl') return ([...new Array(5)].map((x, i) => (
            <Icon
                key={i}
                name={(Math.abs(rating-5) < i + 1) ? 'star' : 'star-o'}
                size={12}
            />
        )));
        return ([...new Array(5)].map((x, i) => (
            <Icon
                key={i}
                name={(rating >= i + 1) ? 'star' : 'star-o'}
                size={12}
            />
          )));
    }

    renderRowContent(service, serviceType, location, direction) {
        let locationName = (location) ? location.name : '';
        let stars = this.renderStars(service.rating, direction);
        if (direction=='rtl') return (
            <View style={styles.rowContainer}>
                <View style={styles.rowTextContainerRTL}>
                    <Text>{service.name}</Text>
                    <Text>{stars} {I18n.t('RATING')}</Text>
                    <Text>{locationName}</Text>
                </View>
                <View style={styles.iconContainer}>
                    <Image
                        source={{uri: serviceType.icon_url}}
                        style={styles.mapIcon}
                    />
                </View>
            </View>
        );
        return (
            <View style={styles.rowContainer}>
                <View style={styles.iconContainer}>
                    <Image
                        source={{uri: serviceType.icon_url}}
                        style={styles.mapIcon}
                    />
                </View>
                <View>
                    <Text>{service.name}</Text>
                    <Text>{I18n.t('RATING')} {stars}</Text>
                    <Text>{locationName}</Text>
                </View>
            </View>
        );
    }
}

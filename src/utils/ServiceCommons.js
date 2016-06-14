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

    renderStars(rating) {
        return ([...new Array(5)].map((x, i) => (
            <Icon
                key={i}
                name={(rating >= i + 1) ? 'star' : 'star-o'}
                size={12}
            />
          )));
    }

    renderRowContent(service, serviceType, location) {
        let locationName = (location) ? location.name : '';
        let stars = this.renderStars(service.rating);

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
                    <Text>{I18n.t('RATING')}: {stars}</Text>
                    <Text>{locationName}</Text>
                </View>
            </View>
        );
    }
}

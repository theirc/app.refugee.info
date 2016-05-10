import React from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet
} from 'react-native';
import { default as Icon } from 'react-native-vector-icons/FontAwesome';

import I18n from '../constants/Messages';

const styles = StyleSheet.create({
    icon: {
        width: 32,
        height: 32
    },
    container: {
        flex: 1,
        flexDirection: 'row'
    },
    iconContainer: {
        width: 32,
        marginRight: 10,
        flexDirection: 'row',
        alignItems: 'center'
    },
    detailsContainer: {
        flexDirection: 'column'
    }
});

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
            <View style={styles.container}>
                <View style={styles.iconContainer}>
                    <Image
                        source={{uri: serviceType.icon_url}}
                        style={styles.icon}
                    />
                </View>
                <View style={styles.detailsContainer}>
                    <Text>{service.name}</Text>
                    <Text>{I18n.t('RATING')}: {stars}</Text>
                    <Text>{locationName}</Text>
                </View>
            </View>
        );
    }
}

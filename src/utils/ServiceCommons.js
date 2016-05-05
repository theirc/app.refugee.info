import React from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet
} from 'react-native';
import { default as Icon } from 'react-native-vector-icons/FontAwesome';

import Messages from '../constants/Messages';

const styles = StyleSheet.create();

export default class ServiceCommons {

    renderRowContent(service, serviceType, location) {
        let locationName = (location) ? location.name : '';
        let stars = [...new Array(5)].map((x, i) => (
            <Icon
                color={(service.rating >= i + 1) ? 'black' : 'white'}
                key={i}
                name="star"
                size={12}
            />
          ));
        return (
            <View>
                <Image
                    source={{uri: serviceType.icon_url}}
                    style={styles.icon}
                />
                <Text>{service.name}</Text>
                <Text>{Messages.RATING}: {stars}</Text>
                <Text>{locationName}</Text>
            </View>
        );
    }
}

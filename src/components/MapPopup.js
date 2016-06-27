import React, {Component, PropTypes} from 'react';
import {Text, View, Image} from 'react-native';
import ServiceCommons from '../utils/ServiceCommons';
import styles from '../styles';

export default class MapPopup extends Component {

    static propTypes = {
        direction: PropTypes.oneOf(['rtl', 'ltr']),
        marker: PropTypes.object
    };

    constructor(props) {
        super(props);
        if (!props.direction) {
            this.props.direction = 'ltr';
        }
        this.serviceCommons = new ServiceCommons();
    }

    render() {
        let {direction, marker} = this.props;
        if (direction == 'rtl') return (
            <View style={styles.horizontalContainer}>
                <View style={[styles.rowContainer, styles.itemsToEnd]}>
                    <View style={styles.rowTextContainerRTL}>
                        <Text style={styles.mapPopupTitle}>{marker.title}</Text>
                        <Text style={styles.mapPopupProvider}>{marker.service.provider.name}</Text>
                        <Text>{this.serviceCommons.renderStars(marker.service.rating, direction)}</Text>
                    </View>
                    <View style={[styles.iconContainer, {marginRight: 0, alignSelf: 'center'}]}>
                        <Image
                            source={{uri: marker.icon_url}}
                            style={styles.mapIcon}
                        />
                    </View>
                </View>
                <View>
                    <Text style={[styles.mapPopupDescription, styles.alignRight]}>{marker.description}</Text>
                </View>
            </View>
        );
        return (
            <View style={styles.horizontalContainer}>
                <View style={styles.rowContainer}>
                    <View style={styles.iconContainer}>
                        <Image
                            source={{uri: marker.icon_url}}
                            style={styles.mapIcon}
                        />
                    </View>
                    <View style={styles.horizontalContainer}>
                        <Text style={styles.mapPopupTitle}>{marker.title}</Text>
                        <Text style={styles.mapPopupProvider}>{marker.service.provider.name}</Text>
                        <Text>{this.serviceCommons.renderStars(marker.service.rating, direction)}</Text>
                    </View>
                </View>
                <View>
                    <Text style={styles.mapPopupDescription}>{marker.description}</Text>
                </View>
            </View>
        )
    }
}

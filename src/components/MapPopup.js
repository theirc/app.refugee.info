import React, {Component, PropTypes} from 'react';
import {Text, View, Image, Dimensions, StyleSheet} from 'react-native';
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
        const containerStyle = {
            backgroundColor: '#ffffff',
            padding: 10,
        }
        let {direction, marker} = this.props;
        if (direction == 'rtl') return (
            <View style={[styles.container, containerStyle]}>
                <View style={[styles.rowContainer, styles.itemsToEnd]}>
                    <View style={[styles.container, { marginRight: 20, alignItems: 'flex-end' }]}>
                        <Text style={componentStyles.mapPopupTitle}>{marker.title}</Text>
                        <Text style={componentStyles.mapPopupProvider}>{marker.service.provider.name}</Text>
                        <Text>{this.serviceCommons.renderStars(marker.service.rating, direction) }</Text>
                    </View>
                    <View style={[styles.iconContainer, { marginRight: 0, alignSelf: 'center' }]}>
                        <Image
                            source={{ uri: marker.icon_url }}
                            style={styles.mapIcon}
                            />
                    </View>
                </View>
                <View>
                    <Text style={[componentStyles.mapPopupDescription, styles.alignRight]}>{marker.description}</Text>
                </View>
            </View>
        );

        return (
            <View style={[styles.container, containerStyle]}>
                <View style={styles.rowContainer}>
                    <View style={styles.iconContainer}>
                        <Image
                            source={{ uri: marker.icon_url }}
                            style={styles.mapIcon}
                            />
                    </View>
                    <View style={styles.container}>
                        <Text style={componentStyles.mapPopupTitle}>{marker.title}</Text>
                        <Text style={componentStyles.mapPopupProvider}>{marker.service.provider.name}</Text>
                        <Text>{this.serviceCommons.renderStars(marker.service.rating, direction) }</Text>
                    </View>
                </View>
                <View>
                    <Text style={[componentStyles.mapPopupDescription, { width: width - 80 }]}>{marker.description}</Text>
                </View>
            </View>
        )
    }
};

const {width} = Dimensions.get('window');

const componentStyles = StyleSheet.create({
    mapPopupTitle: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    mapPopupProvider: {
        fontSize: 14,
        marginBottom: 5
    },
    mapPopupDescription: {
        marginTop: 5,
        fontSize: 12,
    }
});

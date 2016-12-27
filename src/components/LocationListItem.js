import React, {Component, PropTypes} from 'react';
import {
    View,
    TouchableHighlight,
    StyleSheet,
    Image
} from 'react-native';
import styles from '../styles';
import {DirectionalText} from '../components';

export class LocationListItem extends Component {

    static propTypes = {
        image: PropTypes.number,
        onPress: PropTypes.func,
        text: PropTypes.string
    };

    render() {
        const {onPress, text, image} = this.props;

        const imageElement = (image &&
        <Image
            source={image}
            style={componentStyles.listItemImageAbsolute}
        />);

        const imageDivider = (image && (
            <View
                style={[
                    componentStyles.dividerAbsolute,
                    styles.dividerLight
                ]}
            />));

        return (
            <TouchableHighlight
                onPress={onPress}
                style={componentStyles.listItemContainer}
                underlayColor="rgba(0, 0, 0, 0.2)"
            >
                <View style={styles.containerLight}>
                    { imageElement }
                    { imageDivider }
                    <View style={[componentStyles.listItemTextContainer, styles.bottomDividerLight]}>
                        <DirectionalText
                            style={[
                                componentStyles.listItemText,
                                styles.textLight
                            ]}
                        >
                            {text}
                        </DirectionalText>
                    </View>
                </View>
            </TouchableHighlight>
        );
    }
}


const componentStyles = StyleSheet.create({
    listItemContainer: {
        flexGrow: 1,
        height: 50
    },
    listItemTextContainer: {
        flexGrow: 1,
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        borderBottomWidth: 1
    },
    listItemText: {
        fontSize: 15
    },
    listItemImageAbsolute: {
        position: 'absolute',
        left: 15,
        top: 9,
        width: 32,
        height: 32
    },
    dividerAbsolute: {
        position: 'absolute',
        top: 13,
        width: 1,
        height: 24,
        left: 63
    }

});

export default LocationListItem;

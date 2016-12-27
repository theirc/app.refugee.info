import React, {Component, PropTypes} from 'react';
import {
    View,
    Text,
    TouchableHighlight,
    StyleSheet,
    Image,
    Platform
} from 'react-native';
import {connect} from 'react-redux';
import styles, {
    getFontFamily,
    getUnderlayColor,
    getRowOrdering,
    getAlignItems,
    getTextColor,
    getContainerColor,
    getBottomDividerColor,
    getDividerColor,
    themes
} from '../styles';
import Icon from './Icon';

export class LocationListItem extends Component {

    static propTypes = {
        image: PropTypes.number,
        onPress: PropTypes.func,
        text: PropTypes.string,
    };

    render() {
        const {onPress, text, language, direction, image} = this.props;

        const imageElement = (image &&
        <Image
            source={image}
            style={[
                (direction == 'rtl')
                    ? componentStyles.listItemImageAbsolute
                    : componentStyles.listItemImageAbsolute
            ]}
        />);

        const imageDivider = (image && (
            <View
                style={[
                    componentStyles.dividerAbsolute,
                    getDividerColor('light')
                ]}
            />));

        return (
            <TouchableHighlight
                onPress={onPress}
                underlayColor={getUnderlayColor('light')}
                style={[componentStyles.listItemContainer]}
            >
                <View style={[getRowOrdering(direction), getContainerColor('light')]}>
                    { imageElement }
                    { imageDivider }
                    <View style={[componentStyles.listItemTextContainer, styles.bottomDividerLight]}>
                        <Text
                            style={[
                                componentStyles.listItemText,
                                getFontFamily(language),
                                getTextColor('light')
                            ]}
                        >
                            {text}
                        </Text>
                    </View>
                </View>
            </TouchableHighlight>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        direction: state.direction,
        language: state.language
    };
};

const componentStyles = StyleSheet.create({
    listItemContainer: {
        flexGrow: 1,
        flexBasis: 50,
        height: 50
    },
    listItemTextContainer: {
        flex: 1,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 20,
        paddingRight: 20,
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

export default connect(mapStateToProps)(LocationListItem);

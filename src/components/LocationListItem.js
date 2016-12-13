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
        onPress: PropTypes.func,
        text: PropTypes.string,
        image: PropTypes.number,
    };

    render() {
        const {theme, onPress, text, language, direction, image} = this.props;

        const imageElement = (image &&
        <Image
            source={image}
            style={[
                (direction == 'rtl')
                    ? componentStyles.listItemImageAbsoluteRTL
                    : componentStyles.listItemImageAbsolute
            ]}
        />);

        const imageDivider = (image && (
            <View
                style={[
                    componentStyles.dividerAbsolute,
                    getDividerColor(theme)
                ]}
            />));

        return (
            <TouchableHighlight
                onPress={onPress}
                underlayColor={getUnderlayColor(theme)}
                style={[componentStyles.listItemContainer]}
            >
                <View style={[getRowOrdering(direction), getContainerColor(theme)]}>
                    { imageElement }
                    { imageDivider }
                    <View style={[componentStyles.listItemTextContainer, styles.bottomDividerLight]}>
                        <Text
                            style={[
                                componentStyles.listItemText,
                                getFontFamily(language),
                                getTextColor(theme)
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
        theme: state.theme,
        direction: state.direction,
        language: state.language
    };
};

const componentStyles = StyleSheet.create({
    listItemContainer: {
        flexGrow: 1,
        flexBasis: 50,
        height: 50,
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
    listItemImageAbsoluteRTL: {
        position: 'absolute',
        right: 15,
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

import React, {Component, PropTypes} from 'react';
import {
    View,
    TouchableHighlight,
    StyleSheet
} from 'react-native';
import styles, {
    themes
} from '../styles';
import {Icon, DirectionalText} from '../components';

export class ListItem extends Component {

    static propTypes = {
        fontSize: PropTypes.number,
        icon: PropTypes.string,
        iconColor: PropTypes.string,
        iconSize: PropTypes.number,
        onPress: PropTypes.func,
        text: PropTypes.string
    };

    renderIcon(icon, color, size) {
        if (!icon) {
            return;
        }
        return (
            <View style={componentStyles.listItemIconContainer}>
                <Icon
                    name={icon}
                    style={[
                        componentStyles.listItemIcon,
                        {fontSize: size || 24},
                        color && {color}]}
                />
            </View>);
    }

    render() {
        const {onPress, text, icon, iconColor, fontSize, iconSize} = this.props;
        const iconElement = this.renderIcon(icon, iconColor, iconSize);

        return (
            <TouchableHighlight
                onPress={onPress}
                underlayColor="rgba(0, 0, 0, 0.2)"
            >
                <View
                    style={[
                        componentStyles.listItemContainer,
                        styles.containerLight
                    ]}
                >
                    {iconElement}
                    <View style={[
                        componentStyles.dividerInline,
                        styles.dividerLight]}
                    />
                    <View style={[
                        componentStyles.listItemTextContainer,
                        styles.bottomDividerLight
                    ]}
                    >
                        <DirectionalText style={[
                            componentStyles.listItemText,
                            styles.textLight,
                            {fontSize} && {fontSize}]}
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
        height: 50,
        flexDirection: 'row'
    },
    listItemTextContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        borderBottomWidth: 1
    },
    listItemText: {
        fontSize: 15
    },
    listItemIconContainer: {
        width: 50,
        height: 50,
        marginHorizontal: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    listItemIcon: {
        color: themes.light.greenAccentColor
    },
    dividerInline: {
        marginVertical: 13,
        width: 1
    }

});

export default ListItem;

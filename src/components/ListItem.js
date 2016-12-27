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

    constructor(props) {
        super(props);
    }

    render() {
        const {onPress, text, iconColor, fontSize, iconSize} = this.props;
        let iconName = (this.props.icon || '').trim();

        const iconElement = (iconName &&
        <View
            style={componentStyles.listItemIconContainer}
        >
            <Icon
                name={iconName}
                style={[
                    componentStyles.listItemIcon,
                    {fontSize: iconSize || 24},
                    iconColor && {color: iconColor}
                ]}
            />
        </View>);

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
                        styles.dividerLight
                    ]}
                    />
                    <View style={[
                        componentStyles.listItemTextContainer,
                        styles.bottomDividerLight,
                        {borderBottomWidth: 1}
                    ]}
                    >
                        <DirectionalText style={[
                            componentStyles.listItemText,
                            styles.textLight,
                            {fontSize} && {fontSize}
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
        height: 50,
        flexDirection: 'row'
    },
    listItemTextContainer: {
        flexGrow: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20
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

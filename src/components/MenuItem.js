import React, {Component, PropTypes} from 'react';
import {
    Image,
    View,
    StyleSheet,
    TouchableHighlight
} from 'react-native';
import DirectionalText from './DirectionalText';
import {
    themes
} from '../styles';
import {Icon} from '../components';


class MenuItem extends Component {

    static propTypes = {
        active: PropTypes.bool,
        badge: PropTypes.number,
        icon: PropTypes.string,
        image: PropTypes.number,
        onPress: PropTypes.func
    };

    renderWidget() {
        const item = this.props;
        if (item.icon) {
            return (
                <Icon
                    color={themes.light.textColor}
                    name={item.icon}
                    size={22}
                    style={componentStyles.icon}
                />);
        } else if (item.image) {
            return (
                <Image
                    source={item.image}
                    style={[componentStyles.image]}
                />);
        }
    }

    renderBadge() {
        const {badge} = this.props;
        if (badge) {
            return (
                <View style={componentStyles.badge}>
                    <DirectionalText style={{color: themes.dark.textColor, fontWeight: 'bold'}}>
                        {badge}
                    </DirectionalText>
                </View>
            );
        }
    }

    render() {
        const item = this.props;

        let press = (comp, ...args) => {
            if (item.onPress) {
                requestAnimationFrame(() => item.onPress(...args));
            }
            return true;
        };

        let widget = this.renderWidget();
        let badge = this.renderBadge();

        return (
            <TouchableHighlight
                onPress={() => press()}
                underlayColor="rgba(0, 0, 0, 0.2)"
            >
                <View style={[
                    componentStyles.itemLine,
                    item.active && componentStyles.itemActive]}
                >
                    <View style={componentStyles.item}>
                        {widget}
                        <View style={[
                            widget && {paddingHorizontal: 10},
                            componentStyles.label]}
                        >
                            <DirectionalText>
                                {item.children}
                            </DirectionalText>
                        </View>
                        {badge}
                    </View>
                </View>
            </TouchableHighlight>
        );
    }
}


const componentStyles = StyleSheet.create({
    item: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        paddingHorizontal: 15,
        flexDirection: 'row'
    },
    label: {
        flexGrow: 1
    },
    image: {
        height: 17,
        width: 21,
        marginRight: 5,
        marginLeft: 5
    },
    icon: {
        width: 35,
        textAlign: 'center',
        fontSize: 20
    },
    badge: {
        marginHorizontal: 10,
        width: 26,
        height: 26,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 13,
        backgroundColor: themes.light.textColor
    },
    itemActive: {
        backgroundColor: '#f1f1f1',
        borderBottomColor: themes.light.dividerColor,
        borderBottomWidth: 1
    },
    itemLine: {
        borderBottomColor: themes.light.dividerColor,
        borderBottomWidth: 1
    }
});

export default MenuItem;

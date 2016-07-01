import React, { Component, PropTypes } from 'react';
import { Text, Image, View, StyleSheet, Platform } from 'react-native';
import { Avatar, Drawer, Divider, COLOR, TYPO, TouchableNativeFeedback } from 'react-native-material-design';

import { typography } from 'react-native-material-design-styles';

import { I18n, CountryHeaders } from '../constants';
import {capitalize} from '../utils/helpers';
import DrawerCommons from '../utils/DrawerCommons';
import DirectionalText from './DirectionalText'
import {connect} from 'react-redux';
import {Ripple, Icon} from 'react-native-material-design';

export function isCompatible(feature) {
    const version = Platform.Version;

    switch (feature) {
        case 'TouchableNativeFeedback':
            return version >= 21;
            break;
        case 'elevation':
            return version >= 21;
            break;
        default:
            return true;
            break;
    }
}

class MenuItem extends Component {
    static propTypes = {
        icon: PropTypes.string,
        active: PropTypes.bool,
        direction: PropTypes.oneOf(['rtl', 'ltr']),
        onPress: PropTypes.func,
        onLongPress: PropTypes.func,
        ...Text.propTypes
    };

    componentWillMount() {
        let defaultProps = {...this.props };
        if (!defaultProps.direction) {
            defaultProps.direction = 'ltr';
        }
        if (!defaultProps.styles) {
            defaultProps.styles = {};
        }

        // Allowing us to add multiple styles to the items
        // If it is an array of styles, combine them all into oneOf
        // If null use default
        // If not null, override the defaults with whatever we pass to it
        if (Array.isArray(defaultProps.styles)) {
            defaultProps.styles = Object.assign.apply(Object, defaultProps.styles);
        }

        defaultProps.styles = Object.assign(defaultStyles, defaultProps.styles);

        this.setState({
            styles: defaultProps.styles,
            direction: this.props.direction || 'ltr'
        });
    }


    render() {
        const {styles, direction} = this.state;
        const item = this.props;

        let rtlChild = <View style={itemStyles.item}>
            <View style={itemStyles.valueRTL}>
                <Text style={[TYPO.paperFontBody2, {}, { textAlign: 'right' }]}>
                    {item.children}
                </Text>
            </View>
            {item.icon &&
                <Icon
                    name={item.icon}
                    size={22}
                    style={itemStyles.iconRTL}
                    />
            }
        </View>

        let ltrChild = <View style={itemStyles.item}>
            {item.icon &&
                <Icon
                    name={item.icon}
                    size={22}
                    style={itemStyles.icon}
                    />
            }
            <View style={itemStyles.value}>
                <Text style={[TYPO.paperFontBody2, {},]}>
                    {item.children}
                </Text>
            </View>
        </View>

        if (item.active) {
            return <View style={[item.active ? { backgroundColor: '#f0f0f0' } : {}, styles.itemLine]}>
                {direction === 'ltr' ? ltrChild : rtlChild}
            </View>;
        }
        let press = (comp, ...args) => {
            if (item.onPress !== undefined) {
                return item.onPress(...args);
            }
            return true;
        };
        let longPress = (comp, ...args) => {
            let f = item.onLongPress || item.onPress;
            if (f !== undefined) {
                return f(...args);
            }
            
            return true;
        };
        if (!isCompatible('TouchableNativeFeedback')) {
            return (
                <Ripple
                    rippleColor="rgba(73,176,80,.4)"
                    ref="ripple"
                    onPress={() => press() }
                    onLongPress={() => longPress() }
                    style={{
                        flex: 1,
                        flexDirection: 'column',
                    }}
                    >
                    <View style={styles.itemLine}>
                        {direction === 'ltr' ? ltrChild : rtlChild}
                    </View>
                </Ripple>
            );
        }

        return (
            <TouchableNativeFeedback
                background={TouchableNativeFeedback.Ripple('rgba(73,176,80,.4)') }
                    ref="ripple"
                onPress={() => press() }
                onLongPress={() => longPress() }
                >
                <View style={styles.itemLine}>
                    {direction === 'ltr' ? ltrChild : rtlChild}
                </View>
            </TouchableNativeFeedback>
        );
    }
}

class MenuSection extends Component {

    static propTypes = {
        title: PropTypes.string,
        direction: PropTypes.oneOf(['rtl', 'ltr']),
        styles: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
        ...Text.propTypes
    };


    componentWillMount() {
        let defaultProps = {...this.props };
        if (!defaultProps.styles) {
            defaultProps.styles = {};
        }

        // Allowing us to add multiple styles to the items
        // If it is an array of styles, combine them all into oneOf
        // If null use default
        // If not null, override the defaults with whatever we pass to it
        if (Array.isArray(defaultProps.styles)) {
            defaultProps.styles = Object.assign.apply(Object, defaultProps.styles);
        }

        defaultProps.styles = Object.assign(defaultStyles, defaultProps.styles);

        this.setState({
            styles: defaultProps.styles,
            direction: this.props.direction || 'ltr',
        });
    }

    render() {
        const {styles, direction} = this.state;
        const {title, children} = this.props;
        return (
            <View style={styles.headerWrapper}>
                {title && <View style={styles.header}>
                    <DirectionalText {...this.props} style={styles.text} direction={direction}>{title}</DirectionalText>
                </View>}
                {children}
            </View>
        );
    }
}

const defaultStyles = StyleSheet.create({
    header: {
        borderBottomColor: "#000000",
        borderBottomWidth: 1,
        paddingBottom: 15
    },
    headerWrapper: {
        paddingBottom: 30
    },
    itemLine: {
        borderBottomColor: "#b2b2b2",
        borderBottomWidth: 1
    },
    text: {
        color: "#49b050",
        fontWeight: "bold",
        paddingRight: 5,
    },
});

const itemStyles = {
    header: {
        paddingHorizontal: 16,
        marginBottom: 0
    },
    section: {
        flex: 1,
        marginTop: 0
    },
    item: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        height: 48,
        paddingLeft: 16
    },
    subheader: {
        flex: 1
    },
    icon: {
        position: 'absolute',
        top: 13,
        left: 5
    },
    iconRTL: {
        position: 'absolute',
        top: 13,
        right: 5
    },
    value: {
        flex: 1,
        paddingLeft: 26,
        paddingRight: 5,
        top: (Platform.OS === 'ios') ? -5 : 2
    },
    valueRTL: {
        flex: 1,
        paddingRight: 36,
        top: (Platform.OS === 'ios') ? -5 : 2,
        paddingLeft: 5,
        alignItems: 'flex-end'
    },
    label: {
        paddingRight: 16,
        top: 2
    }
};



const mapStateToProps = (state) => {
    return {
        language: state.language,
        direction: state.direction,
        theme: state.theme.theme,
    };
};

module.exports = {
    MenuItem: connect(mapStateToProps)(MenuItem),
    MenuSection: connect(mapStateToProps)(MenuSection),
}; 

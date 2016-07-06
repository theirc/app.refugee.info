import React, {Component, PropTypes} from 'react';
import {
    Text,
    Image,
    View,
    StyleSheet,
    Platform,
    TouchableHighlight
} from 'react-native';
import DirectionalText from './DirectionalText'
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import {generateTextStyles, getUnderlayColor, themes} from '../styles'


class MenuItem extends Component {
    static propTypes = {
        icon: PropTypes.string,
        image: PropTypes.number,
        active: PropTypes.bool,
        direction: PropTypes.oneOf(['rtl', 'ltr']),
        onPress: PropTypes.func,
        onLongPress: PropTypes.func,
        ...Text.propTypes
    };

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillReceiveProps(props) {
        if (props.theme) {
            let defaultProps = {...props};
            if (!defaultProps.direction) {
                defaultProps.direction = 'ltr';
            }

            let styleDefaults;


            if (defaultProps.theme == 'dark') {
                styleDefaults = darkStyleDefaults;
            } else {
                styleDefaults = lightStyleDefaults;
            }

            // Allowing us to add multiple styles to the items
            // If it is an array of styles, combine them all into oneOf
            // If null use default
            // If not null, override the defaults with whatever we pass to it
            if (Array.isArray(defaultProps.styles)) {
                defaultProps.styles = Object.assign.apply(Object, defaultProps.styles);
            }

            defaultProps.styles = Object.assign(styleDefaults, defaultProps.styles);

            this.setState({
                styles: defaultProps.styles,
                direction: this.props.direction || 'ltr'
            });
        }
    }


    render() {
        if (!this.state.styles) {
            return <View />;
        }

        const {styles, direction, language, theme} = this.state;
        const item = this.props;
        const fontStyle = {...styles.itemText, ...generateTextStyles(language)};

        let rtlChild = <View style={[styles.item]}>
            <View style={styles.labelRTL}>
                <Text style={[fontStyle, { textAlign: 'right' }]}>
                    {item.children}
                </Text>
            </View>
            {item.icon &&
            <Icon
                name={item.icon}
                size={22}
                style={styles.iconRTL}
                color={styles.itemText.color || '#000000'}
            />
            }
            {item.image &&
            <Image
                source={item.image}
                style={styles.image}
            />
            }
        </View>;

        let ltrChild = <View style={[styles.item]}>
            {item.icon &&
            <Icon
                name={item.icon}
                size={22}
                style={styles.icon}
                color={styles.itemText.color || '#000000'}
            />
            }
            {item.image &&
            <Image
                source={item.image}
                style={styles.image}
            />
            }
            <View style={styles.label}>
                <Text style={fontStyle}>
                    {item.children}
                </Text>
            </View>
        </View>;

        let press = (comp, ...args) => {
            if (item.onPress) {
                return item.onPress(...args);
            }
            return true;
        };
        let longPress = (comp, ...args) => {
            let f = item.onLongPress || item.onPress;
            if (f) {
                return f(...args);
            }

            return true;
        };
        return (
            <TouchableHighlight
                underlayColor={getUnderlayColor(theme)}
                onPress={() => press() }
                onLongPress={() => longPress() }
                style={{
                    flex: 1,
                    flexDirection: 'column'
                }}
            >
                <View style={[item.active ? styles.itemActive : {},styles.itemLine]}>
                    {direction === 'ltr' ? ltrChild : rtlChild}
                </View>
            </TouchableHighlight>
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

    constructor(props) {
        super(props);
        this.state = {};
    }


    componentWillReceiveProps(props) {
        if (props.theme) {
            let defaultProps = {...props};
            if (!defaultProps.direction) {
                defaultProps.direction = 'ltr';
            }

            let styleDefaults;


            if (defaultProps.theme == 'dark') {
                styleDefaults = darkStyleDefaults;
            } else {
                styleDefaults = lightStyleDefaults;
            }

            // Allowing us to add multiple styles to the items
            // If it is an array of styles, combine them all into oneOf
            // If null use default
            // If not null, override the defaults with whatever we pass to it
            if (Array.isArray(defaultProps.styles)) {
                defaultProps.styles = Object.assign.apply(Object, defaultProps.styles);
            }

            defaultProps.styles = Object.assign(styleDefaults, defaultProps.styles);

            this.setState({
                styles: defaultProps.styles,
                direction: this.props.direction || 'ltr'
            });
        }
    }

    render() {
        if (!this.state.styles) {
            return <View />;
        }

        const {styles, direction, language} = this.state;
        const {title, children, theme} = this.props;
        const fontStyle = {...styles.text, ...generateTextStyles(language)};

        return (
            <View style={styles.headerWrapper}>
                {title && <View style={styles.header}>
                    <DirectionalText {...this.props} style={[fontStyle]} direction={direction}>{title}</DirectionalText>
                </View>}
                {children}
            </View>
        );
    }
}

const lightStyleDefaults = {
    header: {
        borderBottomColor: themes.light.darkerDividerColor,
        borderBottomWidth: 1,
        paddingBottom: 12,
        paddingTop: 12
    },
    headerWrapper: {
        paddingBottom: 30
    },
    item: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        height: 50
    },
    itemActive: {
        backgroundColor: '#fafafa',
        borderBottomColor: themes.light.dividerColor,
        borderBottomWidth: 1
    },
    itemLine: {
        borderBottomColor: themes.light.dividerColor,
        borderBottomWidth: 1
    },
    itemText: {
        fontSize: 14,
        lineHeight: 24,
        color: themes.light.textColor
    },
    text: {
        color: themes.light.greenAccentColor,
        fontWeight: "bold",
        paddingRight: 5
    },
    icon: {
        position: 'absolute',
        top: 13,
        left: 8
    },
    iconRTL: {
        position: 'absolute',
        top: 13,
        right: 11
    },
    label: {
        flex: 1,
        paddingRight: 5,
        top: (Platform.OS === 'ios') ? -5 : 2
    },
    labelRTL: {
        flex: 1,
        paddingRight: 15,
        top: (Platform.OS === 'ios') ? -2 : 2,
        paddingLeft: 5,
        alignItems: 'flex-end'
    },
    image: {
        height: 17,
        width: 21,
        marginRight: 15
    }
};


const darkStyleDefaults = {
    header: {
        borderBottomColor: themes.dark.darkerDividerColor,
        borderBottomWidth: 1,
        paddingBottom: 12,
        paddingTop: 12
    },
    headerWrapper: {
        paddingBottom: 30
    },
    item: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        height: 50
    },
    itemActive: {
        backgroundColor: '#202020',
        borderBottomColor: "#1c1c1c",
        borderBottomWidth: 1
    },
    itemLine: {
        borderBottomColor: "#1c1c1c",
        borderBottomWidth: 1
    },
    itemText: {
        fontSize: 14,
        lineHeight: 24,
        color: themes.dark.textColor
    },
    text: {
        color: themes.dark.greenAccentColor,
        fontWeight: "bold",
        paddingRight: 5,
        fontSize: 14,
        lineHeight: 24
    },
    icon: {
        position: 'absolute',
        top: 13,
        left: 8
    },
    iconRTL: {
        position: 'absolute',
        top: 13,
        right: 11
    },
    label: {
        flex: 1,
        paddingRight: 5,
        top: (Platform.OS === 'ios') ? -5 : 2
    },
    labelRTL: {
        flex: 1,
        paddingRight: 15,
        top: (Platform.OS === 'ios') ? -2 : 2,
        paddingLeft: 5,
        alignItems: 'flex-end'
    },
    image: {
        height: 17,
        width: 21,
        marginRight: 15
    }
};


const mapStateToProps = (state) => {
    return {
        language: state.language,
        direction: state.direction,
        theme: state.theme.theme
    };
};

module.exports = {
    MenuItem: connect(mapStateToProps)(MenuItem),
    MenuSection: connect(mapStateToProps)(MenuSection),
}; 

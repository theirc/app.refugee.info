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
import {getFontFamily, getUnderlayColor, themes} from '../styles'


class MenuItem extends Component {
    static propTypes = {
        icon: PropTypes.string,
        image: PropTypes.number,
        badge: PropTypes.number,
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
            let defaultProps = {...props };
            if (!defaultProps.direction) {
                defaultProps.direction = 'ltr';
            }

            let styleDefaults;


            if (defaultProps.theme == 'dark') {
                styleDefaults = {...sharedStyles, ...darkStyleDefaults };
            } else {
                styleDefaults = {...sharedStyles, ...lightStyleDefaults };
            }

            this.setState({
                styles: styleDefaults,
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
        let {badge} = this.props;
        if(!badge) {
            badge = false;
        }
        const fontStyle = {...styles.itemText, ...getFontFamily(language) };

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
                underlayColor={getUnderlayColor(theme) }
                onPress={() => press() }
                onLongPress={() => longPress() }
                style={{
                    flex: 1,
                    flexDirection: 'column'
                }}
                >
                <View style={[styles.itemLine]}>
                    <View style={[
                        styles.item,
                        { flexDirection: (direction == 'rtl') ? 'row-reverse' : 'row' }
                    ]}
                        >
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
                                style={[
                                    styles.image,
                                ]}
                                />
                        }
                        <View style={[
                            direction == 'rtl' ? styles.labelRTL : styles.label
                        ]}>
                            <Text style={fontStyle}>
                                {item.children}
                            </Text>
                        </View>
                        {badge &&
                            <View style={[sharedStyles.badge, { backgroundColor: styles.text.color, }]}>
                                <Text style={{ color: styles.itemText.color, fontWeight: 'bold' }}>{badge}</Text>
                            </View>
                        }
                    </View>
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
            let defaultProps = {...props };
            if (!defaultProps.direction) {
                defaultProps.direction = 'ltr';
            }

            let styleDefaults;

            if (defaultProps.theme == 'dark') {
                styleDefaults = {...sharedStyles, ...darkStyleDefaults };
            } else {
                styleDefaults = {...sharedStyles, ...lightStyleDefaults };
            }

            this.setState({
                styles: styleDefaults,
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
        const fontStyle = {...styles.text, ...getFontFamily(language) };

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

const sharedStyles = {
    header: {
        borderBottomWidth: 1,
        paddingHorizontal: 5,
        paddingVertical: 12,
    },
    headerWrapper: {
        paddingBottom: 30
    },
    item: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 50
    },
    label: {
        flex: 1
    },
    labelRTL: {
        flex: 1,
        paddingRight: 10,
        alignItems: 'flex-end'
    },
    image: {
        height: 17,
        width: 21,
        marginRight: 5,
        marginLeft: 5
    },
    icon: {
        width: 21,
        marginRight: 5,
        marginLeft: 5
    },
    badge: {
        marginHorizontal: 10,
        width: 26,
        height: 26,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 13,
    }
};

const lightStyleDefaults = {
    header: {
        borderBottomColor: themes.light.darkerDividerColor,
        ...sharedStyles.header
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
        color: themes.light.textColor,
            marginHorizontal: 10,
    },
text: {
    color: themes.light.greenAccentColor,
        fontWeight: "bold"
},
};


const darkStyleDefaults = {
    header: {
        borderBottomColor: themes.dark.darkerDividerColor,
        ...sharedStyles.header
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
        color: themes.dark.textColor,
        marginHorizontal: 10,
    },
    text: {
        color: themes.dark.greenAccentColor,
        fontWeight: "bold",
        fontSize: 14,
    },
};


const mapStateToProps = (state) => {
    return {
        language: state.language,
        direction: state.direction,
        theme: state.theme
    };
};

module.exports = {
    MenuItem: connect(mapStateToProps)(MenuItem),
    MenuSection: connect(mapStateToProps)(MenuSection),
}; 

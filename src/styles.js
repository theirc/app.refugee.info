import {Platform, StyleSheet} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import HumanitarianIcon from './components/HumanitarianIcon';

export const themes = {
    light: {
        logo: require('./assets/logo-light.png'),
        drawerLogo: require('./assets/logo-light-drawer.png'),
        backgroundColor: '#FFFFFF',
        menuBackgroundColor: '#FFFFFF',
        darkBackgroundColor: '#000000',
        dividerColor: '#E2E2E2',
        darkerDividerColor: '#BABABA',
        lighterDividerColor: '#EFEFEF',
        toolbarColor: '#FDF9F9',
        greenAccentColor: '#00BA50',
        yellowAccentColor: '#FFDF0C',
        textColor: '#515151'
    },
    dark: {
        logo: require('./assets/logo-dark.png'),
        drawerLogo: require('./assets/logo-dark-drawer.png'),
        backgroundColor: '#2d2d2d',
        menuBackgroundColor: '#000000',
        darkBackgroundColor: '#FFFFFF',
        dividerColor: '#6E6E6E',
        darkerDividerColor: '#373737',
        lighterDividerColor: '#BBBBBB',
        toolbarColor: '#181818',
        greenAccentColor: '#00BA50',
        yellowAccentColor: '#FFDF0C',
        textColor: '#FFFFFF'
    }
};

const styles = StyleSheet.create({

    // reusable view header

    viewHeaderContainer: {
        padding: 12
    },
    viewHeaderContainerLight: {
        backgroundColor: themes.light.lighterDividerColor
    },
    viewHeaderContainerDark: {
        backgroundColor: themes.dark.dividerColor
    },
    viewHeaderText: {
        fontSize: 13,
        textAlign: 'center'
    },
    viewHeaderTextLight: {
        color: themes.light.darkerDividerColor
    },
    viewHeaderTextDark: {
        color: themes.dark.lighterDividerColor
    },

    // list items

    listItemIconContainer: {
        width: 80,
        height: 80,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: themes.light.backgroundColor
    },
    dividerLongInline: {
        marginTop: 17,
        width: 1,
        height: 46
    },

    searchBarContainer: {
        padding: 5,
        paddingTop: 0,
        height: 52,
        flexDirection: 'row'
    },

    // generic background colors

    containerLight: {
        borderBottomColor: themes.light.lighterDividerColor,
        backgroundColor: themes.light.backgroundColor
    },
    containerDark: {
        borderBottomColor: themes.dark.darkerDividerColor,
        backgroundColor: themes.dark.backgroundColor
    },

    searchBarContainerLight: {
        backgroundColor: themes.light.lighterDividerColor
    },
    searchBarContainerDark: {
        backgroundColor: themes.dark.menuBackgroundColor
    },

    // generic divider colors

    dividerLight: {
        backgroundColor: themes.light.lighterDividerColor
    },
    dividerDark: {
        backgroundColor: themes.dark.darkerDividerColor
    },
    bottomDividerLight: {
        borderBottomColor: themes.light.lighterDividerColor
    },
    bottomDividerDark: {
        borderBottomColor: themes.dark.darkerDividerColor
    },
    borderLight: {
        borderColor: themes.light.darkerDividerColor
    },
    borderDark: {
        borderColor: themes.dark.lighterDividerColor
    },

    // generic text colors

    textLight: {
        color: themes.light.textColor
    },
    textDark: {
        color: themes.dark.textColor
    },
    textAccentYellow: {
        color: themes.light.yellowAccentColor
    },
    textAccentGreen: {
        color: themes.light.greenAccentColor
    },

    // other

    flex: {
        flex: 1
    },
    scene: {
        paddingTop: getToolbarHeight(),
        flex: 1
    },
    row: {
        flexDirection: 'row'
    },
    rowRTL: {
        flexDirection: 'row-reverse'
    },
    container: {
        marginTop: getToolbarHeight(),
        flexGrow: 1,
        flexDirection: 'column'
    },
    alignCenter: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    textInputMultiline: {
        height: 144,
        fontSize: 15
    },
    textInputModal: {
        height: 48,
        fontSize: 16
    },
    mapIcon: {
        width: 32,
        height: 32
    },
    iconContainer: {
        width: 32,
        marginRight: 10,
        flexDirection: 'row',
        alignItems: 'center'
    },
    detailsContainer: {
        padding: 10
    },
    title: {
        fontWeight: 'bold'
    },
    loading: {
        justifyContent: 'center',
        alignSelf: 'center',
        margin: 10
    },
    map: {
        flex: 1,
        height: 150
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.75)'
    },
    modalInnerContainer: {
        borderRadius: 2,
        padding: 20
    },
    modalInnerContainerLight: {
        backgroundColor: themes.light.backgroundColor
    },
    modalInnerContainerDark: {
        backgroundColor: themes.dark.toolbarColor
    },
    starContainer: {
        flex: 1,
        margin: 5,
        justifyContent: 'space-between'
    },
    ratingIcon: {
        color: themes.light.yellowAccentColor,
        fontSize: 15,
        paddingRight: 5
    },
    starIcon: {
        color: themes.light.yellowAccentColor,
        fontSize: 24
    },
    feedbackIcon: {
        fontSize: 16
    },
    modalButtonContainer: {
        flex: 1,
        marginLeft: 5,
        marginRight: 10,
        marginTop: 5,
        justifyContent: 'space-between'
    },
    modalButton: {
        width: 80,
        alignItems: 'center'
    },
    validationText: {
        color: '#a94442',
        fontSize: 12,
        marginTop: -5
    },
    alignRight: {
        textAlign: 'right'
    },
    sectionHeader: {
        fontSize: 18,
        marginBottom: 10,
        fontWeight: 'bold'
    },
    sectionContent: {
        fontSize: 13,
        color: themes.light.textColor
    },
    contactBorder: {
        marginTop: 5,
        marginBottom: 5,
        borderWidth: 0.5
    }
});

export function getFontFamily(language = 'en') {
    let style;
    if (['ar', 'fa'].indexOf(language) > -1) {
        style = {
            fontFamily: 'Montserrat'
        };
    } else if (['el'].indexOf(language) > -1) {
        style = {
            fontFamily: 'Roboto'
        };
    } else {
        style = {
            fontFamily: 'Montserrat'
        };
    }

    return style;
}

export function getTextDirection(language) {
    return {
        textAlign: (Platform.OS == 'ios') ? 'auto' : 'left',
        writingDirection: (['ar', 'fa'].indexOf(language) > -1) ? 'rtl' : 'ltr'
    };
}

export function getIconComponent(iconName = '') {
    if (iconName.indexOf('ion-') == 0) {
        return Ionicons;
    } else if (iconName.indexOf('fa-') == 0) {
        return FontAwesome;
    } else if (iconName.indexOf('hi-') == 0) {
        return HumanitarianIcon;
    } else {
        return Ionicons;
    }
}

export function getIconName(iconName = '') {
    if (iconName.indexOf('ion-') == 0) {
        return iconName.substring(4);
    } else if (iconName.indexOf('fa-') == 0) {
        return iconName.substring(3);
    } else if (iconName.indexOf('hi-') == 0) {
        return iconName.substring(3);
    } else {
        return iconName;
    }
}
export function getElevation(level = 3) {
    if (Platform.OS == 'ios') {
        return {
            shadowColor: 'black',
            shadowOffset: {width: 0, height: 1},
            shadowOpacity: 0.25,
            shadowRadius: level > 1 ? level - 1 : level
        };
    }
    else if (Platform.Version >= 21) {
        // Android Lollipop 5.0 and up supports elevation
        return {
            elevation: level
        };
    }
    else return {
            // Android KitKat and JellyBean polyfill
        borderBottomColor: 'rgba(0,0,0,0.3)',
        borderBottomWidth: 1
    };
}
export function isStatusBarTranslucent() {
    return (Platform.Version >= 21 || Platform.OS == 'ios');
}
export function getToolbarHeight(){
    // check if supports translucent status bar
    return isStatusBarTranslucent() ? 120 : 95;
}

export default styles;

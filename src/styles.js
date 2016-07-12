'use strict';

import {Platform, StyleSheet, Dimensions} from 'react-native';

export const themes = {
    light: {
        logo: require("./assets/logo-light.png"),
        drawerLogo: require("./assets/logo-light-drawer.png"),
        backgroundColor: '#FFFFFF',
        menuBackgroundColor: '#FFFFFF',
        darkBackgroundColor: '#000000',
        dividerColor: '#E2E2E2',
        darkerDividerColor: '#BABABA',
        lighterDividerColor: '#F2F2F2',
        toolbarColor: '#FDF9F9',
        greenAccentColor: '#00BA50',
        yellowAccentColor: '#FFDF0C',
        textColor: '#515151'
    },
    dark: {
        logo: require("./assets/logo-dark.png"),
        drawerLogo: require("./assets/logo-dark-drawer.png"),
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


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({

    // reusable view header

    viewHeaderContainer: {
        padding: 15
    },
    viewHeaderContainerLight: {
        backgroundColor: themes.light.dividerColor
    },
    viewHeaderContainerDark: {
        backgroundColor: themes.dark.dividerColor
    },
    viewHeaderText: {
        fontSize: 13,
        fontFamily: 'Montserrat',
        textAlign: 'center'
    },
    viewHeaderTextLight: {
        color: themes.light.darkerDividerColor
    },
    viewHeaderTextDark: {
        color: themes.dark.lighterDividerColor
    },

    // list items

    listItemContainer: {
        flex: 1,
        paddingTop: 5,
        paddingBottom: 5,
        borderBottomWidth: 1,
        height: 50
    },
    listItemIconContainer: {
        width: 50,
        height: 80,
        padding: 13,
        marginLeft: 5,
        marginRight: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    listItemContainerLight: {
        borderBottomColor: themes.light.lighterDividerColor,
        backgroundColor: themes.light.backgroundColor
    },
    listItemContainerDark: {
        borderBottomColor: themes.dark.darkerDividerColor,
        backgroundColor: themes.dark.backgroundColor
    },
    listItemTextContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 9,
        paddingBottom: 12
    },
    listItemText: {
        flex: 1,
        fontSize: 15
    },
    listItemIcon: {
        position: 'absolute',
        left: 15,
        top: 9,
        width: 32,
        height: 32
    },
    listItemIconRTL: {
        position: 'absolute',
        right: 15,
        top: 9,
        width: 32,
        height: 32
    },
    listItemIconInline: {
        marginTop: 8,
        marginLeft: 10,
        fontSize: 24,
        color: themes.light.greenAccentColor
    },
    dividerAbsolute: {
        position: 'absolute',
        left: 62,
        top: 13,
        width: 1,
        height: 22
    },
    dividerInline: {
        marginTop: 9,
        width: 1,
        height: 22,
        marginLeft: 20,
        marginRight: 20
    },
    dividerLongInline: {
        marginTop: 17,
        width: 1,
        height: 46
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
        paddingTop: windowHeight > 500 ? 140 : 110,
        flex: 1
    },
    row: {
        flexDirection: 'row'
    },
    rowRTL: {
        flexDirection: 'row-reverse'
    },
    container: {
        flex: 1,
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
        height: 200
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
        fontSize: 13
    },
    contactBorder: {
        marginTop: 5,
        marginBottom: 5,
        borderWidth: 0.5
    }
});

export function getFontFamily(language='en') {
    let style;
    if (['ar', 'fa'].indexOf(language) > -1) {
        style = {
            fontFamily: 'Montserrat'
        };
    } else if (['el',].indexOf(language) > -1) {
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

export function getUnderlayColor(theme = 'light') {
    if (theme == 'light')
        return 'rgba(0, 0, 0, 0.2)';
    else
        return 'rgba(255, 255, 255, 0.6)'
}

export function getRowOrdering(direction) {
    if (direction === 'rtl')
        return styles.rowRTL;
    else return styles.row;
}

export function getAlignItems(direction) {
    if (direction === 'rtl')
        return { alignItems: 'flex-end' };
    else return { alignItems: 'flex-start' };
}

export function getTextAlign(direction){
    if (direction==='rtl')
        return {textAlign: 'right'};
    else return {textAlign: 'auto'};
}

export default styles;

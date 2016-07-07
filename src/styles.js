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
        paddingLeft: 10,
        paddingRight: 10,
        borderBottomWidth: 1,
        height: 50,
        flexDirection: 'row'
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
        top: 8
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
        height: 46,
        marginLeft: 20
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
        paddingTop: 140,
        flex: 1
    },
    container: {
        flex: 1,
        flexDirection: 'column'
    },
    horizontalContainer: {
        flexDirection: 'row'
    },
    centeredContainer: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center'
    },
    centeredVerticalContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    alignCenter: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    error: {
        marginBottom: 5
    },
    
    header: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        padding: 15
    },
    headerText: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        fontWeight: 'bold',
        fontSize: 15,
        color: '#313131',
        textAlign: 'center'
    },
    buttonText: {
        fontWeight: 'bold',
        color: '#555556'
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'column',
        padding: 15,
        backgroundColor: '#ffffff'
    },
    icon: {
        justifyContent: 'flex-end'
    },
    textInput: {
        height: 48,
        marginTop: 5,
        marginBottom: 5,
        marginLeft: 10,
        marginRight: 10
    },
    textInputMultiline: {
        height: 144,
        fontSize: 16
    },
    textInputModal: {
        margin: 0,
        height: 48
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
    rowContainer: {
        flex: 1,
        flexDirection: 'row'
    },
    feedbackContainer: {
        marginTop: 10
    },
    detailsContainer: {
        padding: 10
    },
    textCenter: {
        textAlign: 'center',
        textAlignVertical: 'center'
    },
    textRight: {
        textAlign: 'right'
    },
    itemsToEnd: {
        alignItems: 'flex-end'
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
        flexDirection: 'row',
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
        fontSize: 16,
        marginRight: 6
    },
    modalButtonContainer: {
        flex: 1,
        flexDirection: 'row',
        marginLeft: 5,
        marginRight: 10,
        marginTop: 5,
        justifyContent: 'space-between'
    },
    modalButton: {
        width: 80,
        paddingTop: 10,
        paddingBottom: 10
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
    contactBorder:{
        marginTop: 5,
        marginBottom: 5,
        borderWidth: 0.5
    },
    borderLight: {
        borderColor: themes.light.darkerDividerColor
    },
    borderDark: {
        borderColor: themes.dark.lighterDividerColor

    }
});

export function generateTextStyles(language='en') {
    let style;
    if (['ar', 'fa'].indexOf(language) > -1) {
        style = {
            fontFamily: 'Montserrat'
        };
    } else if (['el', ].indexOf(language) > -1) {
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

export function getUnderlayColor(theme='light'){
    if (theme=='light') 
        return 'rgba(0, 0, 0, 0.2)';
    else 
        return 'rgba(255, 255, 255, 0.6)'
}

export default styles;

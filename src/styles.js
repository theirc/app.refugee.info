'use strict';

import {Platform, StyleSheet, Dimensions} from 'react-native';

let {height, width} = Dimensions.get('window');

export const themes = {
    light: {
        logo: require("./assets/logo.png"),
        rectangularLogo: require("./assets/logo-rect.png"),
        backgroundColor: '#FFFFFF',
        darkBackgroundColor: '#000000',
        dividerColor: '#E2E2E2',
        darkerDividerColor: '#BABABA',
        lighterDividerColor: '#F2F2F2',
        toolbarColor: '#FDF9F9',
        accentColor: '#39B05C',
        textColor: '#515151'
    },
    dark: {
        logo: require("./assets/logo.png"),
        rectangularLogo: require("./assets/logo-rect-dark.png"),
        backgroundColor: '#000000',
        darkBackgroundColor: '#FFFFFF',
        dividerColor: '#303030',
        darkerDividerColor: '#BABABA',
        lighterDividerColor: '#F2F2F2',
        toolbarColor: '#FDF9F9',
        accentColor: '#39B05C',
        textColor: '#ffffff'
    }
};

const styles = StyleSheet.create({

    // toolbar

    toolbarContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        paddingTop: 10,
        paddingBottom: 15,
        paddingRight: 15,
        paddingLeft: 15,
        flexDirection: 'column',
        height: 140,
        borderTopWidth: 20,
        borderBottomWidth: 2
    },
    toolbarContainerLight: {
        backgroundColor: themes.light.toolbarColor,
        borderTopColor: themes.light.darkBackgroundColor,
        borderBottomColor: themes.light.darkerDividerColor
    },
    toolbarContainerDark: {
        backgroundColor: themes.dark.toolbarColor,
        borderTopColor: themes.dark.darkBackgroundColor,
        borderBottomColor: themes.dark.darkerDividerColor
    },

    toolbarTop: {
        flexDirection: 'row',
        height: 50,
        justifyContent: 'space-between'
    },
    toolbarBottom: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-end'
    },
    brandImage: {
        height: 40,
        width: 120
    },
    menuIcon: {
        fontSize: 28,
        color: themes.light.darkerDividerColor
    },
    backIcon: {
        fontSize: 28,
        color: themes.light.accentColor
    },
    toolbarTitle: {
        fontSize: 20,
        fontFamily: 'Montserrat'
    },
    toolbarTitleLight: {
        color: themes.light.textColor
    },
    toolbarTitleDark: {
        color: themes.dark.textColor
    },

    // view header

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
        color: themes.dark.darkerDividerColor
    },

    // list items

    listItemContainer: {
        flex: 1,
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 10,
        paddingRight: 10,
        borderBottomWidth: 2,
        flexDirection: 'row'
    },
    listItemContainerLight: {
        borderBottomColor: themes.light.lighterDividerColor,
        backgroundColor: themes.light.backgroundColor
    },
    listItemContainerDark: {
        borderBottomColor: themes.dark.lighterDividerColor,
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
        fontSize: 15,
        fontFamily: 'Montserrat'
    },
    listItemTextLight: {
        color: themes.light.textColor
    },
    listItemTextDark: {
        color: themes.dark.textColor
    },
    listItemIcon: {
        position: 'absolute',
        left: 15,
        top: 6
    },
    listItemIconInline: {
        marginTop: 8,
        marginLeft: 10,
        fontSize: 24,
        color: themes.light.accentColor
    },
    listItemDivider: {
        position: 'absolute',
        left: 62,
        top: 12,
        width: 2,
        height: 21
    },
    listItemDividerInline: {
        marginTop: 9,
        width: 2,
        height: 22,
        marginLeft: 20,
        marginRight: 20
    },
    listItemDividerLight: {
        backgroundColor: themes.light.lighterDividerColor
    },
    listItemDividerDark: {
        backgroundColor: themes.dark.lighterDividerColor
    },

    // search bar

    searchBarContainer: {
        padding: 5,
        height: 46
    },
    searchBar: {
        flex: 1,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.4,
        shadowRadius: 1,
        flexDirection: 'row',
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 10,
        paddingRight: 10
    },
    searchBarLight: {
        backgroundColor: themes.light.backgroundColor
    },
    searchBarDark: {
        backgroundColor: themes.dark.backgroundColor
    },

    searchBarIconContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end'
    },
    searchBarIcon: {
        marginLeft: 5,
        marginRight: 10,
        fontSize: 22
    },
    searchBarIconLight: {
        color: themes.light.darkerDividerColor
    },
    searchBarIconDark: {
        color: themes.dark.darkerDividerColor
    },
    searchBarInput: {
        flex: 1,
        fontSize: 13,
        fontFamily: 'Montserrat'
    },
    
    // other

    flex: {
        flex: 1
    },
    scene: {
        paddingTop: 140,
        flex: 1,
        backgroundColor: 'white'
    },
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    horizontalContainer: {
        flex: 1,
        flexDirection: 'column'
    },
    centeredContainer: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center'
    },
    error: {
        marginBottom: 5
    },
    materialToolbar: {
        height: 76,
        paddingTop: 20,
        paddingRight: (Platform.OS === 'ios') ? 0 : 10
    },

    containerBelowLogo: {
        flex: 1,
        flexDirection: 'column'
    },
    logo: {
        flex: 0.33,
        height: null,
        width: null
    },
    listViewContainer: {
        flexDirection: 'column'
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
    buttonContainerSelected: {
        backgroundColor: '#E1E0E0'
    },
    buttonTextSelected: {
        color: '#313131'
    },
    icon: {
        justifyContent: 'flex-end'
    },
    rowWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    rowHeader: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
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
    stickyInput: {
        height: 40,
        marginTop: 5,
        marginBottom: 5,
        backgroundColor: '#ffffff',
        shadowColor: 'black',
        shadowOpacity: 0.8,
        shadowRadius: 2,
        paddingLeft: 10,
        paddingRight: 5
    },
    stickyInputContainer: {
        backgroundColor: '#F5F5F5'
    },

    floatingActionButton: {
        position: 'absolute',
        flex: 1,
        bottom: 20,
        borderWidth: 1,
        borderRadius: 50,
        opacity: 0.7
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
        margin: 10
    },
    textCenter: {
        textAlign: 'center',
        textAlignVertical: 'center'
    },
    textRight: {
        textAlign: 'right'
    },
    rowTextContainerRTL: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'flex-end',
        marginRight: 20
    },
    paddedListItem: {
        padding: 10
    },
    itemsToEnd: {
        alignItems: 'flex-end'
    },
    title: {
        fontWeight: 'bold'
    },
    commentBox: {
        flex: 1,
        marginBottom: 10
    },
    commentForm: {
        marginTop: 5,
        padding: 5
    },
    comment: {
        flex: 8
    },
    commentIcon: {
        margin: 15
    },
    loading: {
        justifyContent: 'center',
        alignSelf: 'center',
        margin: 10
    },
    map: {
        flex: 1,
        height: 120
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    modalInnerContainer: {
        borderRadius: 10,
        backgroundColor: '#fff',
        padding: 20
    },
    starContainer: {
        flex: 1,
        flexDirection: 'row',
        marginTop: 5,
        marginBottom: 5,
        marginLeft: 25,
        marginRight: 25
    },
    starIcon: {
        flex: 1,
        textAlign: 'center'
    },
    modalButtonContainer: {
        flex: 1,
        flexDirection: 'row',
        marginLeft: 5,
        marginRight: 10,
        marginTop: 5
    },
    validationText: {
        color: '#a94442',
        fontSize: 12,
        marginTop: -5
    },
    mapPopupContainer: {},
    mapPopupTitle: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    mapPopupProvider: {
        fontSize: 14,
        marginBottom: 5
    },
    mapPopupDescription: {
        marginTop: 5,
        fontSize: 12,
        width: width - 40
    },
    offlineModeContainer: {
        padding: 15,
        paddingBottom: 0,
        flexDirection: 'column'
    },
    offlineModeTextContainer: {
        marginLeft: 50
    },
    offlineModeText: {
        textAlign: 'center'
    },
    OfflineModeLastSync: {
        marginTop: 10,
        textAlign: 'center',
        fontSize: 12,
        color: '#333333'
    },
    offlineModeIcon: {
        position: 'absolute',
        top: 25,
        left: 25,
        color: '#FFD700',
        fontSize: 36
    },
    offlineModeButtonContainer: {
        width: 180,
        alignSelf: 'center',
        marginRight: -15
    },
    generalInfoItem: {
        padding: 10
    },
    generalInfoText: {
        fontSize: 16
    },
    locationListItem: {
        padding: 3
    },
    alignRight: {
        textAlign: 'right'
    },
});

export function generateTextStyles(language='en') {
    let style;
    if (['ar', 'fa'].indexOf(language) > -1) {
        style = {
            fontFamily: 'Montserrat-Regular',
        };
    } else if (['el', ].indexOf(language) > -1) {
        style = {
            fontFamily: 'Roboto',
        };
    } else {
        style = {
            fontFamily: 'Montserrat-Regular',
        };
    }

    return style;
};

export default styles;

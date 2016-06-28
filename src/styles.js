'use strict';

import { Platform, StyleSheet, Dimensions } from 'react-native';

let {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({

    flex: {
        flex: 1
    },
    scene: {
        paddingTop: 76,
        flex: 1
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#F5F5F5'
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
    countryFlag: {
        marginLeft: 10,
        marginRight: 10,
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
    mapPopupContainer: {
    },
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
    }

});

export default styles;

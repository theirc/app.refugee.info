'use strict';

var React = require('react-native');

import { Platform } from 'react-native';

var styles = React.StyleSheet.create({
    
    flex: {
        flex: 1
    },
    scene: {
        paddingTop: (Platform.OS === 'ios') ? 76 : 56,
        flex: 1
    },
    container: {
        flex: 1,
        flexDirection: 'column'
    },
    materialToolbar: {
        height: (Platform.OS === 'ios') ? 76 : 56,
        paddingTop: (Platform.OS === 'ios') ? 20 : 0
    },
    containerBelowLogo: {
        flex: 0.67,
        flexDirection: 'column'
    },
    logo: {
        flex: 0.33,
        height: null,
        width: null
    },
    listViewContainer: {
        flex: 0.85,
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
        backgroundColor: '#F5F5F5'
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
        height: 144
    },
    countryFlag: {
        marginRight: 10
    },
    floatingActionButton: {
        position: 'absolute',
        flex: 1,
        right: 20,
        bottom: 20,
        borderWidth: 1,
        borderRadius: 50,
        opacity: 0.7
    },
    mapIcon: {
        width: 32,
        height: 32
    },
    //
    feedbackContainer: {
        marginTop: 10
    },
    detailsContainer: {
        margin: 5
    },
    textCenter: {
        textAlign: 'center',
        textAlignVertical: 'center'
    },
    textRight: {
        textAlign: 'right'
    },
    title: {
        fontWeight: 'bold'
    },
    commentBox: {
        flexDirection: 'row',
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
        flex: 1,
        alignSelf: 'center',
        marginLeft: 15
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
        margin: 5,
        marginLeft: 25
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
    }
});

module.exports = styles;

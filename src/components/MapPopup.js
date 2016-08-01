import React, {Component, PropTypes} from 'react';
import {Text, View, Image, Dimensions, StyleSheet, ScrollView} from 'react-native';
import ServiceCommons from '../utils/ServiceCommons';
import {connect} from 'react-redux';
import styles, {
    getFontFamily,
    getRowOrdering,
    getTextColor,
    getContainerColor,
    getAlignItems,
    getTextAlign
} from '../styles';
import {I18n} from '../constants';
import {Button} from '../components'

const MAX_SERVICES_IN_CLUSTER_POPUP = 5;

export default class MapPopup extends Component {

    static propTypes = {
        marker: PropTypes.object
    };

    constructor(props) {
        super(props);
        this.serviceCommons = new ServiceCommons();
    }

    getClusterView(cluster) {
        const {direction, theme, language} = this.props;
        let clusteredServices = cluster.neighbours.map((marker, i) =>
            (i + 1 < MAX_SERVICES_IN_CLUSTER_POPUP) &&
            <View style={getRowOrdering(direction)} key={i}>
                <View style={[
                    styles.iconContainer,
                    direction == 'rtl' ? {marginLeft: 10, marginRight: 0} : {}
                ]}>
                    {marker.widget}
                </View>
                <View style={[
                    styles.container,
                    getAlignItems(direction),
                    {justifyContent: 'center'}
                ]}>
                    <Text style={[
                        {fontSize: 12, fontWeight: 'bold'},
                        getTextColor(theme),
                        getFontFamily(language)
                    ]}>
                        {marker.title}
                    </Text>
                    <Text style={[
                        {fontSize: 10},
                        getTextColor(theme),
                        getFontFamily(language)
                    ]}>
                        {marker.service.provider.name}
                    </Text>
                </View>
            </View>
        );

        return (
            <View>
                <Text style={[
                    {fontSize: 13, fontWeight: 'bold', marginBottom: 5,},
                    getTextColor(theme),
                    getFontFamily(language)
                ]}>
                    {I18n.t('CLUSTERED_SERVICE_TITLE').replace('{0}', cluster.neighbourCount + 1).replace('{1}', (cluster.neighbourCount + 1 >= MAX_SERVICES_IN_CLUSTER_POPUP)
                        ? MAX_SERVICES_IN_CLUSTER_POPUP
                        : cluster.neighbourCount + 1
                    )}
                </Text>
                <View style={getRowOrdering(direction)} key={i}>
                    <View style={[
                        styles.iconContainer,
                        direction == 'rtl' ? {marginLeft: 10, marginRight: 0} : {}
                    ]}>
                        {cluster.widget}
                    </View>
                    <View style={[
                        styles.container,
                        getAlignItems(direction),
                        {justifyContent: 'center'}
                    ]}>
                        <Text style={[
                            {fontSize: 12, fontWeight: 'bold'},
                            getTextColor(theme),
                            getFontFamily(language)
                        ]}>
                            {cluster.title}
                        </Text>
                        <Text style={[
                            {fontSize: 10},
                            getTextColor(theme),
                            getFontFamily(language)
                        ]}>
                            {cluster.service.provider.name}
                        </Text>
                    </View>
                </View>
                {clusteredServices}
                {(cluster.neighbourCount + 1) > MAX_SERVICES_IN_CLUSTER_POPUP && (
                    <View style={{width: 120, alignSelf: 'center'}}>
                        <Button
                            text={I18n.t('SHOW_MORE').toUpperCase()}
                            buttonStyle={{height: 30, marginBottom: 5}}
                            textStyle={{fontSize: 12}}
                            color="green"
                        />
                    </View>)
                }
            </View>
        )
    }

    render() {
        let {direction, marker, theme, language} = this.props;

        if (marker.neighbourCount) {
            let clusterRows = this.getClusterView(marker);
            return (
                <View style={[
                    styles.container,
                    getContainerColor(theme),
                    {padding: 5}
                ]}>
                    {clusterRows}
                </View>
            );
        }
        return (
            <View style={[
                styles.container,
                getContainerColor(theme),
                {padding: 10}
            ]}>
                <View style={getRowOrdering(direction)}>
                    <View style={[
                        styles.iconContainer,
                        direction == 'rtl' ? {marginLeft: 10, marginRight: 0} : {}
                    ]}>
                        {marker.widget}
                    </View>
                    <View style={[
                        styles.container,
                        getAlignItems(direction)
                    ]}>
                        <Text style={[
                            componentStyles.mapPopupTitle,
                            getTextColor(theme),
                            getFontFamily(language)
                        ]}>
                            {marker.title}
                        </Text>
                        <Text style={[
                            componentStyles.mapPopupProvider,
                            getTextColor(theme),
                            getFontFamily(language)
                        ]}>
                            {marker.service.provider.name}
                        </Text>
                    </View>
                </View>
                <View>
                    <Text style={[
                        componentStyles.mapPopupDescription,
                        getTextColor(theme),
                        getFontFamily(language),
                        getTextAlign(direction)
                    ]}>
                        {marker.description}
                    </Text>
                </View>
            </View>
        )
    }
};

const componentStyles = StyleSheet.create({
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
        fontSize: 12
    }
});

const mapStateToProps = (state) => {
    return {
        direction: state.direction,
        language: state.language,
        theme: state.theme
    };
};

export default connect(mapStateToProps)(MapPopup);

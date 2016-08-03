import React, {Component, PropTypes} from 'react';
import {Text, View, Image, Dimensions, StyleSheet, ScrollView, TouchableHighlight} from 'react-native';
import ServiceCommons from '../utils/ServiceCommons';
import {connect} from 'react-redux';
import styles, {
    getFontFamily,
    getRowOrdering,
    getTextColor,
    getContainerColor,
    getAlignItems,
    getTextAlign,
    getUnderlayColor,
    themes
} from '../styles';
import {Icon} from '../components';
import I18n from '../constants/Messages';

export default class MapPopup extends Component {

    static propTypes = {
        marker: PropTypes.object
    };

    static contextTypes = {
        navigator: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.serviceCommons = new ServiceCommons();
    }

    navigateToService(marker) {
        const service = marker.service;
        const {region} = this.props;
        const {navigator} = this.context;
        requestAnimationFrame(() => navigator.forward(null, null, {service, region, location: region}, this.state));
    }

    renderWidget(marker) {
        const {theme} = this.props;
        return (
            <View
                style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 36,
                    height: 36,
                    backgroundColor: themes.light.greenAccentColor,
                    borderColor: themes[theme].backgroundColor,
                    borderRadius: 10,
                    borderWidth: 1
                }}
            >
                {marker.serviceType && (
                    <Icon
                        name={(marker.serviceType.vector_icon || '').trim()}
                        style={{
                            fontSize: 22,
                            width: 24,
                            height: 24,
                            color: themes.dark.textColor,
                            textAlign: 'center'
                        }}
                    />
                )}
            </View>
        )
    }

    getClusterView(cluster) {
        const {direction, theme, language} = this.props;
        let clusteredServices = cluster.neighbours.map((marker, i) =>
            <TouchableHighlight
                underlayColor={getUnderlayColor(theme)}
                onPress={(() => this.navigateToService(marker))}
                key={i}
            >
                <View style={[
                    getRowOrdering(direction),
                    {paddingLeft: 10, paddingRight: 10}
                ]}>
                    <View style={[
                        {justifyContent: 'center', height: 50},
                        styles.iconContainer,
                        direction == 'rtl' ? {marginLeft: 10, marginRight: 0} : {}
                    ]}>
                        {this.renderWidget(marker)}
                    </View>
                    <View style={[
                        styles.container,
                        getAlignItems(direction),
                        {justifyContent: 'center'}
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
            </TouchableHighlight>
        );

        return (
            <View>
                <Text style={[
                    getTextAlign(direction),
                    getFontFamily(language),
                    getTextColor(theme),
                    {flex: 1, fontSize: 14, margin: 10},
                ]}
                >
                    {I18n.t('CLUSTER_POPUP_TITLE').replace('{0}', cluster.neighbourCount + 1)}
                </Text>
                <TouchableHighlight
                    underlayColor={getUnderlayColor(theme)}
                    onPress={(() => this.navigateToService(cluster))}
                >
                    <View style={[
                        getRowOrdering(direction),
                        {paddingLeft: 10, paddingRight: 10}]}
                    >
                        <View style={[
                            styles.iconContainer,
                            {justifyContent: 'center', height: 50},
                            direction == 'rtl' ? {marginLeft: 10, marginRight: 0} : {}
                        ]}>
                            {this.renderWidget(cluster)}
                        </View>
                        <View style={[
                            styles.container,
                            getAlignItems(direction),
                            {justifyContent: 'center'}
                        ]}>
                            <Text style={[
                                componentStyles.mapPopupTitle,
                                getTextColor(theme),
                                getFontFamily(language)
                            ]}>
                                {cluster.title}
                            </Text>
                            <Text style={[
                                componentStyles.mapPopupProvider,
                                getTextColor(theme),
                                getFontFamily(language)
                            ]}>
                                {cluster.service.provider.name}
                            </Text>
                        </View>
                    </View>
                </TouchableHighlight>
                {clusteredServices}
            </View>
        )
    }

    render() {
        const {direction, marker, theme, language} = this.props;
        if (marker.neighbourCount) {
            let clusterRows = this.getClusterView(marker);
            return (
                <View style={[
                    styles.container,
                    getContainerColor(theme)
                ]}>
                    {clusterRows}
                </View>
            );
        }
        return (
            <View
                style={[
                    getContainerColor(theme),
                ]}
            >
                <TouchableHighlight
                    underlayColor={getUnderlayColor(theme)}
                    onPress={(() => this.navigateToService(marker))}
                >
                    <View style={[
                        getRowOrdering(direction),
                        {padding: 10}
                    ]}>
                        <View style={[
                            styles.iconContainer,
                            {justifyContent: 'center', height: 48},
                            direction == 'rtl' ? {marginLeft: 10, marginRight: 0} : {}
                        ]}>
                            {this.renderWidget(marker)}
                        </View>
                        <View style={[
                            styles.container,
                            {justifyContent: 'center'},
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
                </TouchableHighlight>
                <View style={{paddingLeft: 10, paddingRight: 10}}>
                    <Text style={[
                        componentStyles.mapPopupDescription,
                        getTextColor(theme),
                        getFontFamily(language),
                        getTextAlign(direction),
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
        fontSize: 13,
        fontWeight: 'bold'
    },
    mapPopupProvider: {
        fontSize: 12,
    },
    mapPopupDescription: {
        marginTop: 5,
        fontSize: 11
    }
});

const mapStateToProps = (state) => {
    return {
        direction: state.direction,
        language: state.language,
        theme: state.theme,
        region: state.region
    };
};

export default connect(mapStateToProps)(MapPopup);

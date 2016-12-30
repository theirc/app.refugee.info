import React, {Component, PropTypes} from 'react';
import {View, StyleSheet, TouchableHighlight} from 'react-native';
import ServiceCommons from '../utils/ServiceCommons';
import {connect} from 'react-redux';
import styles, {
    themes
} from '../styles';
import {Icon, DirectionalText} from '../components';
import I18n from '../constants/Messages';

export class MapPopup extends Component {

    static propTypes = {
        marker: PropTypes.object,
        region: PropTypes.object
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
        return (
            <View
                style={componentStyles.mapWidgetContainer}
            >
                {marker.serviceType && (
                    <Icon
                        name={(marker.serviceType.vector_icon || '').trim()}
                        style={componentStyles.mapWidgetIcon}
                    />
                )}
            </View>
        );
    }

    getClusterView(cluster) {
        let clusteredServices = cluster.neighbours.map((marker, i) =>
            <TouchableHighlight
                key={i}
                onPress={(() => this.navigateToService(marker))}
                underlayColor="rgba(0, 0, 0, 0.2)"
            >
                <View style={[
                    styles.row,
                    {paddingLeft: 10, paddingRight: 10}
                ]}
                >
                    <View style={[
                        {justifyContent: 'center', height: 50},
                        styles.iconContainer
                    ]}
                    >
                        {this.renderWidget(marker)}
                    </View>
                    <View style={[
                        styles.container,
                        {justifyContent: 'center'}
                    ]}
                    >
                        <DirectionalText style={[componentStyles.mapPopupTitle, styles.textLight]}>
                            {marker.title}
                        </DirectionalText>
                        <DirectionalText style={[componentStyles.mapPopupProvider, styles.textLight]}>
                            {marker.service.provider.name}
                        </DirectionalText>
                    </View>
                </View>
            </TouchableHighlight>
        );

        return (
            <View>
                <DirectionalText style={[
                    styles.textLight,
                    {flex: 1, fontSize: 14, margin: 10}
                ]}
                >
                    {I18n.t('CLUSTER_POPUP_TITLE').replace('{0}', cluster.neighbourCount + 1)}
                </DirectionalText>
                <TouchableHighlight
                    onPress={(() => this.navigateToService(cluster))}
                    underlayColor="rgba(0, 0, 0, 0.2)"
                >
                    <View style={[
                        styles.row,
                        {paddingLeft: 10, paddingRight: 10}]}
                    >
                        <View style={[
                            styles.iconContainer,
                            {justifyContent: 'center', height: 50},
                        ]}
                        >
                            {this.renderWidget(cluster)}
                        </View>
                        <View style={[
                            styles.container,
                            {justifyContent: 'center'}
                        ]}
                        >
                            <DirectionalText style={[componentStyles.mapPopupTitle, styles.textLight]}>
                                {cluster.title}
                            </DirectionalText>
                            <DirectionalText style={[componentStyles.mapPopupProvider, styles.textLight]}>
                                {cluster.service.provider.name}
                            </DirectionalText>
                        </View>
                    </View>
                </TouchableHighlight>
                {clusteredServices}
            </View>
        );
    }

    render() {
        const {marker} = this.props;
        if (marker.neighbourCount) {
            let clusterRows = this.getClusterView(marker);
            return (
                <View style={[styles.container, styles.containerLight]}>
                    {clusterRows}
                </View>
            );
        }
        return (
            <View style={[styles.containerLight]}>
                <TouchableHighlight
                    onPress={(() => this.navigateToService(marker))}
                    underlayColor="rgba(0, 0, 0, 0.2)"
                >
                    <View style={[styles.row, {padding: 10}]}>
                        <View style={[styles.iconContainer, {justifyContent: 'center', height: 48},]}>
                            {this.renderWidget(marker)}
                        </View>
                        <View style={[styles.container, {justifyContent: 'center'}]}>
                            <DirectionalText style={[componentStyles.mapPopupTitle, styles.textLight]}>
                                {marker.title}
                            </DirectionalText>
                            <DirectionalText style={[componentStyles.mapPopupProvider, styles.textLight]}>
                                {marker.service.provider.name}
                            </DirectionalText>
                        </View>
                    </View>
                </TouchableHighlight>
                <View style={{paddingLeft: 10, paddingRight: 10}}>
                    <DirectionalText style={[componentStyles.mapPopupDescription, styles.textLight]}>
                        {marker.description}
                    </DirectionalText>
                </View>
            </View>
        );
    }
}


const componentStyles = StyleSheet.create({
    mapPopupTitle: {
        fontSize: 13,
        fontWeight: 'bold'
    },
    mapPopupProvider: {
        fontSize: 12
    },
    mapPopupDescription: {
        marginTop: 5,
        fontSize: 11
    },
    mapWidgetContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: 36,
        height: 36,
        backgroundColor: themes.light.greenAccentColor,
        borderColor: themes.light.backgroundColor,
        borderRadius: 10,
        borderWidth: 1
    },
    mapWidgetIcon: {
        fontSize: 22,
        width: 24,
        height: 24,
        color: themes.dark.textColor,
        textAlign: 'center'
    }
});

const mapStateToProps = (state) => {
    return {
        language: state.language,
        region: state.region
    };
};

export default connect(mapStateToProps)(MapPopup);

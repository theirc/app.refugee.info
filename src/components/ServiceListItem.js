import React, {Component, PropTypes} from 'react';
import {
    View,
    StyleSheet,
    TouchableHighlight
} from 'react-native';
import {DirectionalText, Icon} from '../components';
import styles, {
    themes
} from '../styles';

export class ServiceListItem extends Component {

    static propTypes = {
        service: PropTypes.object
    };

    renderWidget() {
        const {service} = this.props;
        const iconName = (service.type.vector_icon || '').trim();
        return (
            <View
                style={componentStyles.widgetContainer}
            >
                <Icon
                    name={iconName}
                    style={componentStyles.widgetIcon}
                />
            </View>
        );
    }

    render() {
        const {service} = this.props;
        const widget = this.renderWidget();

        return (
            <TouchableHighlight
                onPress={service.onPress}
                underlayColor="rgba(0, 0, 0, 0.2)"
            >
                <View
                    style={[
                        styles.containerLight,
                        componentStyles.serviceListItemContainer
                    ]}
                >
                    <View style={[styles.row, styles.flex]}>
                        <View style={styles.listItemIconContainer}>
                            {widget}
                        </View>
                        <View style={[styles.dividerLongInline, styles.dividerLight]}/>
                        <View style={[
                            styles.containerLight,
                            {borderBottomWidth: 1, justifyContent: 'center', flex: 1}
                        ]}
                        >
                            <View style={{marginHorizontal: 10}}>
                                <View style={componentStyles.serviceNameWrapper}>
                                <DirectionalText
                                    style={[styles.textLight, componentStyles.serviceName]}
                                >
                                    {service.name}
                                </DirectionalText>
                                </View>
                                <View style={[styles.row, {paddingBottom: 2}]}>
                                    <Icon
                                        name="ios-pin"
                                        style={componentStyles.servicePinIcon}
                                    />
                                    <DirectionalText style={componentStyles.serviceLocationName}>
                                        {service.locationName}
                                    </DirectionalText>
                                </View>
                                <DirectionalText
                                    style={[styles.textLight, componentStyles.serviceProviderName]}
                                >
                                    {service.provider.name.substr(0, 40)}
                                </DirectionalText>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableHighlight>
        );
    }
}

const componentStyles = StyleSheet.create({
    widgetContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: 48,
        height: 48,
        backgroundColor: themes.light.greenAccentColor,
        borderColor: themes.light.backgroundColor,
        borderRadius: 12,
        borderWidth: 1
    },
    widgetIcon: {
        fontSize: 24,
        color: themes.dark.textColor,
        textAlign: 'center'
    },
    serviceListItemContainer: {
        height: 80,
        borderBottomWidth: 0,
        paddingVertical: 0,
        flexGrow: 1
    },
    serviceNameWrapper: {
        flexGrow: 1
    },
    serviceName: {
        fontSize: 15,
        paddingBottom: 2,
        fontWeight: '500'
    },
    serviceLocationName: {
        color: themes.light.textColor,
        fontSize: 12
    },
    serviceProviderName: {
        fontSize: 11,
        paddingBottom: 2,
        fontWeight: '500'
    },
    servicePinIcon: {
        fontSize: 13,
        marginHorizontal: 4,
        color: themes.light.textColor
    }
});

export default ServiceListItem;

import React, {Component, PropTypes} from 'react';
import {
    StyleSheet,
    ListView,
    RefreshControl,
    View,
    Linking,
    Platform,
    Dimensions
} from 'react-native';
import {Icon, ParallaxView, DirectionalText} from '../components';
import MapView from 'react-native-maps';
import I18n from '../constants/Messages';
import ApiClient from '../utils/ApiClient';
import {connect} from 'react-redux';
import Share from 'react-native-share';
import {OfflineView, Divider, Button} from '../components';
import styles, {themes} from '../styles';
import {WEB_PATH} from '../constants';
import {MAPBOX_TOKEN} from '../constants';
import {checkPlayServices} from '../utils/GooglePlayServices';

let Mapbox;
if (Platform.OS === 'android') {
    Mapbox = require('react-native-mapbox-gl');
    Mapbox.setAccessToken(MAPBOX_TOKEN);
}

const screen = Dimensions.get('window');
const RADIUS = 0.01;
const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const SHOW_SHARE_BUTTON = true;


export class ServiceDetails extends Component {
    static backButton = true;

    static propTypes = {
        location: PropTypes.shape({
            id: PropTypes.number,
            name: PropTypes.string.isRequired
        }),
        region: PropTypes.object,
        service: PropTypes.shape({
            id: PropTypes.number,
            provider_fetch_url: PropTypes.string.isRequired
        }),
        serviceType: PropTypes.shape({
            icon_url: PropTypes.string
        })
    };

    constructor(props) {
        super(props);
        this.state = {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2
            }),
            loaded: false,
            modalVisible: false,
            refreshing: false,
            service: this.props.service,
            offline: false,
            name: '',
            comment: ''
        };
        this.onRefresh = this.onRefresh.bind(this);
        this.call = this.call.bind(this);
    }

    componentWillMount() {
        this.apiClient = new ApiClient(this.context, this.props);
        if (!this.state.loaded) {
            checkPlayServices().then((available) => {
                let nativeAvailable = (Platform.OS === 'ios' || available);
                this.setState({nativeAvailable});
                this.fetchData().done();
            });
        }
    }

    async fetchData(update) {
        let service = this.props.service;
        try {
            if (update) {
                let services = await this.apiClient.getService(service.id, true);
                if (services.length > 0) {
                    service = services[0];
                }
            }
            let provider = service.provider;

            this.setState({
                loaded: true,
                provider,
                service,
                offline: false
            });
        }
        catch (e) {
            this.setState({
                offline: true
            });
        }
    }

    onRefresh() {
        this.setState({refreshing: true});
        this.fetchData(true).then(() => {
            this.setState({refreshing: false});
        });
    }

    getDirections(lat, long) {
        if (this.state.loaded) {
            requestAnimationFrame(() => {
                let location = `${lat},${long}`;
                if (Platform.OS === 'ios') {
                    return Linking.openURL(`http://maps.apple.com/?daddr=${lat},${long}&dirflg=w&t=m`);
                }
                return Linking.openURL(`geo:${location}?q=${location}`);
            });
        }
    }

    call() {
        if (this.state.loaded) {
            requestAnimationFrame(() => {
                const {provider, service} = this.state;
                Linking.openURL(`tel:${service.phone_number || provider.phone_number}`);
            });
        }
    }

    onShareClick() {
        if (this.state.loaded) {
            const {provider, service} = this.state;
            const {region} = this.props;
            let address = service.address || provider.address;
            let phoneNumber = service.phone_number || provider.phone_number || '';
            let text = `${service.name}\n${provider.name}\n${address}\n${phoneNumber}`;
            requestAnimationFrame(() => {
                Share.open({
                    message: text,
                    url: `${WEB_PATH}/${region.slug}/services/${service.id}`,
                    title: service.name,
                    subject: service.name
                }).catch();
            });
        }
    }

    renderOpeningHoursRow(day) {
        const {service} = this.props;
        let open = service[`${day}_open`];
        let close = service[`${day}_close`];
        if ((!open && !close) || open == close) {
            return (
                <View style={[styles.row, styles.flex]}>
                    <DirectionalText style={[
                        styles.flex,
                        styles.sectionContent,
                        styles.textLight,
                        {textAlign: 'center'}
                    ]}
                    >
                        {I18n.t('CLOSED').toUpperCase() }
                    </DirectionalText>
                </View>
            );
        }
        return (
            <View style={[styles.row, styles.flex]}>
                <DirectionalText style={[
                    styles.flex,
                    styles.sectionContent,
                    {textAlign: 'right'}]}
                >
                    {service[`${day}_open`] &&
                    service[`${day}_open`].substr(0, service[`${day}_open`].lastIndexOf(':')) }
                </DirectionalText>

                <DirectionalText style={[styles.sectionContent, {textAlign: 'center', flex: 0.5}]}>-</DirectionalText>

                <DirectionalText style={[
                    styles.flex,
                    styles.sectionContent,
                    {textAlign: 'left'}]}
                >
                    {service[`${day}_close`] &&
                    service[`${day}_close`].substr(0, service[`${day}_close`].lastIndexOf(':')) }
                </DirectionalText>
            </View>
        );
    }

    renderOpeningHours() {
        const {service} = this.props;
        let opened_days_count = 0;
        for (let i = 0; i <= days.length; i++) {
            if (service[`${days[i]}_open`] || service[`${days[i]}_close`])
                opened_days_count += 1;
        }
        if (opened_days_count === 0) {
            return;
        }
        const weekDay = days[new Date().getDay()];

        return (
            <View style={[styles.detailsContainer]}>
                <View style={styles.row}>
                    <View style={[componentStyles.sectionIconContainer]}>
                        <Icon
                            name="md-time"
                            style={componentStyles.sectionIcon}
                        />
                    </View>
                    <View style={styles.flex}>
                        <DirectionalText style={componentStyles.sectionHeader}>
                            {I18n.t('OPENING_HOURS') }
                        </DirectionalText>
                        {days.map((day) => (
                            <View
                                key={day}
                                style={[
                                    styles.row,
                                    styles.bottomDividerLight,
                                    {borderBottomWidth: 1, paddingVertical: 5},
                                    (day === weekDay)
                                        ? styles.dividerLight
                                        : null
                                ]}
                            >
                                <DirectionalText style={[
                                    {flex: 0.5},
                                    styles.sectionContent
                                ]}
                                >
                                    {I18n.t(day.toUpperCase()) }
                                </DirectionalText>
                                {this.renderOpeningHoursRow(day)}
                            </View>
                        )) }
                    </View>
                </View>
            </View>
        );
    }

    renderMapView(nativeAvailable) {
        const {service} = this.props;
        let {loaded} = this.state;

        if (!loaded) {
            return <View style={styles.map}/>;
        }

        const lat = parseFloat(service.location.coordinates[1]),
            long = parseFloat(service.location.coordinates[0]),
            initialRegion = {
                latitude: lat,
                longitude: long,
                latitudeDelta: RADIUS,
                longitudeDelta: RADIUS
            },
            coordinate = {
                latitude: lat,
                longitude: long
            };

        if (nativeAvailable) {
            return (
                <MapView
                    cacheEnabled
                    initialRegion={initialRegion}
                    scrollEnabled={false}
                    style={styles.map}
                >
                    <MapView.Marker coordinate={coordinate}/>
                </MapView>
            );
        }

        let latitudeMultiplier = lat > 0 ? 1 : -1;
        let longitudeMultiplier = long > 0 ? 1 : -1;

        let latSW = lat - (RADIUS * latitudeMultiplier);// - latSW == 0;
        let longSW = long - (RADIUS * longitudeMultiplier);

        let latNE = lat + (RADIUS * latitudeMultiplier);
        let longNE = long + (RADIUS * longitudeMultiplier);


        let annotations = [{
            coordinates: [lat, long],
            type: 'point',
            id: `marker_${service.id}`
        }];

        return (
            <Mapbox.MapView
                annotations={annotations}
                initialCenterCoordinate={coordinate}
                onFinishLoadingMap={() => {
                    this._mapBoxLoaded = true;
                    this._mapBox.setVisibleCoordinateBounds(latSW, longSW, latNE, longNE);
                }}
                ref={map => {
                    this._mapBox = map;
                }}
                rotateEnabled={false}
                scrollEnabled={false}
                showsUserLocation
                style={styles.map}
                zoomEnabled={false}
            />
        );

    }

    renderHeader() {
        const {service} = this.props;
        const textStyle = !service.image ? {color: themes.light.textColor} : componentStyles.text;
        const fontSize = service.name.length > 35 ? (service.name.length > 45 ? 12 : 20) : 24;

        return (
            <View style={[componentStyles.headerView, styles.row]}>
                <DirectionalText style={[textStyle, {fontSize}]}>
                    {service.name}
                </DirectionalText>
            </View>
        );
    }

    renderServiceDescription() {
        const {service} = this.props;
        if (!service.description) {
            return <View />;
        }
        return (
            <View style={[styles.detailsContainer]}>
                <View style={styles.row}>
                    <View style={[componentStyles.sectionIconContainer]}>
                        <Icon
                            name="fa-info"
                            style={componentStyles.sectionIcon}
                        />
                    </View>
                    <View style={styles.flex}>
                        <DirectionalText style={[componentStyles.sectionHeader, styles.textLight]}>
                            {I18n.t('DESCRIPTION') }
                        </DirectionalText>
                        <DirectionalText style={[styles.sectionContent, styles.textLight]}>
                            {service.description}
                        </DirectionalText>
                    </View>
                </View>
            </View>
        );
    }

    renderServiceAddress() {
        const {service} = this.props;
        if (!service.address && !service.provider.address) {
            return <View />;
        }
        return (
            <View style={[styles.detailsContainer]}>
                <View style={styles.row}>
                    <View style={[componentStyles.sectionIconContainer]}>
                        <Icon
                            name="ios-pin"
                            style={componentStyles.sectionIcon}
                        />
                    </View>
                    <View style={styles.flex}>
                        <DirectionalText style={[componentStyles.sectionHeader, styles.textLight]}>
                            {I18n.t('ADDRESS') }
                        </DirectionalText>
                        <DirectionalText style={[styles.sectionContent, styles.textLight]}>
                            {(service.address || service.provider.address) }
                        </DirectionalText>
                    </View>
                </View>
            </View>
        );
    }

    render() {
        const {service, location} = this.props,
            {nativeAvailable, loaded} = this.state,
            locationName = (location) ? location.pageTitle || location.name : '',
            hasPhoneNumber = loaded && !!this.state.provider.phone_number,

            lat = parseFloat(service.location.coordinates[1]),
            long = parseFloat(service.location.coordinates[0]),

            backgroundImage = service.image ? {uri: service.image} : require('../assets/service-placeholder-light.png'),
            imageAspectRatio = Math.sqrt(5),

            mapView = this.renderMapView(nativeAvailable),
            openingHoursView = this.renderOpeningHours(),
            serviceDescriptionView = this.renderServiceDescription(),
            serviceAddressView = this.renderServiceAddress();

        return (
            <ParallaxView
                backgroundSource={backgroundImage}
                header={this.renderHeader()}
                refreshControl={
                    <RefreshControl
                        onRefresh={this.onRefresh}
                        refreshing={this.state.refreshing}
                    />
                }
                scrollableViewStyle={[componentStyles.containerView]}
                style={styles.container}
                windowHeight={service.image ? screen.width / imageAspectRatio : 60}
            >
                <OfflineView
                    offline={this.state.offline}
                    onRefresh={this.onRefresh}
                />

                {mapView}

                <View style={styles.detailsContainer}>
                    <View style={[styles.row, {paddingBottom: 5}]}>
                        <Icon
                            name="ios-pin"
                            style={{marginHorizontal: 8, fontSize: 14, color: themes.light.textColor}}
                        />
                        <DirectionalText style={{color: themes.light.textColor, fontSize: 13}}>
                            {locationName}
                        </DirectionalText>
                    </View>
                    <View style={[styles.row, {paddingBottom: 5}]}>
                        <DirectionalText style={{color: themes.light.textColor, fontSize: 12}}>
                            {service.provider.name}
                        </DirectionalText>
                    </View>
                    <Divider />
                </View>

                {serviceDescriptionView}
                {serviceAddressView}
                {openingHoursView}

                <View style={styles.detailsContainer}>
                    <Button
                        buttonStyle={{marginBottom: 10}}
                        color="green"
                        onPress={() => this.getDirections(lat, long)}
                        text={I18n.t('GET_DIRECTIONS')}
                        textStyle={{fontSize: 15}}
                    />
                    {hasPhoneNumber &&
                    <Button
                        buttonStyle={{marginBottom: 10}}
                        color="black"
                        onPress={this.call}
                        text={I18n.t('CALL')}
                        textStyle={{fontSize: 15}}
                    />}
                    {SHOW_SHARE_BUTTON &&
                    <Button
                        buttonStyle={{marginBottom: 10}}
                        color="white"
                        onPress={() => this.onShareClick()}
                        text={I18n.t('SHARE')}
                        textStyle={{fontSize: 15}}
                    />}
                </View>
            </ParallaxView>
        );
    }
}
const componentStyles = StyleSheet.create({
    sectionIconContainer: {
        width: 50,
        alignItems: 'center'
    },
    sectionIcon: {
        fontSize: 28,
        color: themes.light.greenAccentColor
    },
    sectionHeader: {
        fontSize: 14,
        marginBottom: 2,
        fontWeight: 'bold',
        color: themes.light.textColor
    },
    headerView: {
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'flex-start',
        margin: 10
    },
    containerView: {
        flex: 1,
        backgroundColor: themes.light.backgroundColor
    },
    text: {
        color: themes.light.darkBackgroundColor,
        textShadowOffset: {width: -1, height: 1},
        textShadowRadius: 1,
        textShadowColor: themes.light.darkBackgroundColor
    }
});

const mapStateToProps = (state) => {
    return {
        theme: state.theme,
        direction: state.direction,
        region: state.region,
        language: state.language,
        toolbarTitleIcon: state.toolbarTitleIcon,
        toolbarTitleImage: state.toolbarTitleImage
    };
};

export default connect(mapStateToProps)(ServiceDetails);

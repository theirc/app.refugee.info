import React, {Component, PropTypes} from 'react';
import {
    TouchableHighlight,
    StyleSheet,
    Text,
    ListView,
    RefreshControl,
    View,
    Linking,
    TextInput,
    Modal,
    Platform,
    Image,
    Dimensions
} from 'react-native';
import {Icon, ParallaxView} from '../components';
import {default as FontAwesomeIcon} from 'react-native-vector-icons/FontAwesome';
import MapView from 'react-native-maps';
import I18n from '../constants/Messages';
import ApiClient from '../utils/ApiClient';
import ServiceCommons from '../utils/ServiceCommons';
import {connect} from 'react-redux';
import Share from 'react-native-share';
import {OfflineView, Divider, Button} from '../components';
import styles, {
    themes,
    getFontFamily,
    getUnderlayColor,
    getRowOrdering,
    getAlignItems,
    getTextAlign,
    getTextColor,
    getBottomDividerColor,
    getDividerColor
} from '../styles';
import {WEB_PATH} from '../constants'

import {MAPBOX_TOKEN} from '../constants';
import {checkPlayServices} from '../utils/GooglePlayServices';
import Mapbox, { MapView as MapboxMapView } from 'react-native-mapbox-gl';
Mapbox.setAccessToken(MAPBOX_TOKEN);

let screen = Dimensions.get('window');

const RADIUS = 0.01;
const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const SHOW_SHARE_BUTTON = true;

export class ServiceDetails extends Component {
    static smallHeader = true;
    static contextTypes = {
        navigator: PropTypes.object.isRequired
    };

    static propTypes = {
        location: PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired
        }),
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
        this.serviceCommons = new ServiceCommons();
    }

    componentWillMount() {
        this.apiClient = new ApiClient(this.context, this.props);
        if (!this.state.loaded) {
            checkPlayServices().then((available) => {
                let nativeAvailable = (Platform.OS === 'ios' || available);
                this.setState({ nativeAvailable })

                this.fetchData().done();
            });
        }
    }

    _setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }

    _setRating(rating) {
        this.setState({ rating });
    }

    _setLoaded(loaded) {
        this.setState({ loaded });
    }


    async fetchData(update) {
        let service = this.props.service;
        try {
            if (update) {
                services = await this.apiClient.getService(service.id, true);
                if (services.length > 0) {
                    service = services[0];
                }
            }
            let feedbacks = await this.apiClient.getFeedbacks(service.id, true);
            let provider = service.provider;
            if (!feedbacks) {
                return;
            }

            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(feedbacks),
                loaded: true,
                provider,
                service,
                offline: false
            });
        }
        catch (e) {
            this.setState({
                offline: true
            })
        }
    }

    onRefresh() {
        this.setState({ refreshing: true });
        this.fetchData(update = true).then(() => {
            this.setState({ refreshing: false });
        });
    }

    getDirections(lat, long) {
        if (this.state.loaded) {
            requestAnimationFrame(() => {
                let location = `${lat},${long}`;
                if (Platform.OS === 'ios') {
                    return Linking.openURL(`http://maps.apple.com/?daddr=${lat},${long}&dirflg=w&t=m`)
                }
                return Linking.openURL(`geo:${location}?q=${location}`);
            })
        }
    }

    call() {
        requestAnimationFrame(() => {
            const {provider, service} = this.state;
            Linking.openURL(`tel:${service.phone_number || provider.phone_number}`);
        })
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
                }).catch(
                    error => console.log(error)
                );
            })
        }
    }

    postComment() {
        let {rating, service, name, comment} = this.state;
        this.apiClient.postFeedback(service, name, rating, comment).then(
            (response) => {
                this._setModalVisible(false);
                this._setLoaded(false);
                this.fetchData(update = true);
            }
        );
    }


    renderFeedback(row) {
        const {direction, theme, language} = this.props;
        let stars = this.serviceCommons.renderStars(row.quality);
        return (
            <View style={styles.detailsContainer}>
                <View style={getRowOrdering(direction) }>
                    <Icon
                        name="ios-person"
                        style={[
                            styles.feedbackIcon,
                            direction == 'rtl' ? { marginLeft: 6 } : { marginRight: 6 },
                            getTextColor(theme)
                        ]}
                        />
                    <Text style={[
                        getFontFamily(language),
                        getAlignItems(direction),
                        getTextColor(theme)
                    ]}>
                        {row.name}
                    </Text>
                </View>
                <Divider theme={theme} margin={2}/>
                <Text style={[
                    getTextAlign(direction),
                    getFontFamily(language),
                    getTextColor(theme),
                    { marginBottom: 8, fontSize: 12 }
                ]}>
                    {row.extra_comments}
                </Text>
                <View style={[getRowOrdering(direction)]}>
                    {stars}
                </View>
            </View>
        );
    }

    renderFeedbackContainer() {
        let {direction, theme, language} = this.props;
        let rateStars;
        rateStars = [...new Array(5)].map((x, i) => (
            <FontAwesomeIcon
                key={i}
                name={(this.state.rating >= i + 1) ? 'star' : 'star-o'}
                onPress={() => {
                    this._setModalVisible(true);
                    this._setRating(i + 1);
                } }
                style={[
                    styles.starIcon,
                    (this.state.rating >= i + 1) ? null : { color: themes.light.dividerColor }
                ]}
                />
        ));
        return (
            <View>
                <Modal
                    animationType={'fade'}
                    onRequestClose={() => this._setModalVisible(false) }
                    transparent={true}
                    visible={this.state.modalVisible}
                    >
                    <View style={[styles.modalContainer]}>
                        <View style={[
                            styles.modalInnerContainer,
                            theme == 'dark' ? styles.modalInnerContainerDark : styles.modalInnerContainerLight
                        ]}>
                            <Text style={[
                                getFontFamily(language),
                                { marginBottom: 10, textAlign: 'center' },
                                theme == 'dark' ? styles.textAccentYellow : styles.textLight
                            ]}>
                                {I18n.t('YOUR_RATING') }
                            </Text>
                            <View style={[
                                styles.starContainer,
                                getRowOrdering(direction)
                            ]}
                                >
                                {rateStars}
                            </View>
                            <Divider theme={theme} margin={4}/>
                            <TextInput
                                onChangeText={
                                    (text) => this.setState({ name: text })
                                }
                                placeholder={I18n.t('NAME') }
                                placeholderTextColor={
                                    theme == 'dark' ? themes.light.dividerColor : themes.light.darkerDividerColor
                                }
                                value={this.state.name}
                                style={[
                                    styles.textInputModal,
                                    getTextColor(theme),
                                    getTextAlign(direction)
                                ]}
                                underlineColorAndroid='transparent'
                                />
                            <TextInput
                                multiline
                                onChangeText={
                                    (text) => this.setState({ comment: text })
                                }
                                placeholder={I18n.t('COMMENT') }
                                placeholderTextColor={
                                    theme == 'dark' ? themes.light.dividerColor : themes.light.darkerDividerColor
                                }
                                value={this.state.comment}
                                style={[
                                    styles.textInputMultiline,
                                    getTextColor(theme),
                                    getTextAlign(direction)
                                ]}
                                underlineColorAndroid='transparent'
                                />
                            <Divider theme={theme} margin={4}/>
                            <View style={[styles.modalButtonContainer, getRowOrdering(direction)]}>
                                <TouchableHighlight
                                    onPress={() => {
                                        this._setModalVisible(false);
                                    } }
                                    underlayColor={getUnderlayColor(theme) }
                                    >
                                    <View style={styles.modalButton}>
                                        <Text style={[
                                            getFontFamily(language),
                                            theme == 'dark' ? styles.textAccentYellow : styles.textLight
                                        ]}>
                                            {I18n.t('CLOSE').toUpperCase() }
                                        </Text>
                                    </View>
                                </TouchableHighlight>
                                <TouchableHighlight
                                    onPress={() => this.postComment() }
                                    underlayColor={getUnderlayColor(theme) }
                                    >
                                    <View style={styles.modalButton}>
                                        <Text style={[
                                            getFontFamily(language),
                                            theme == 'dark' ? styles.textAccentYellow : styles.textLight
                                        ]}>
                                            {I18n.t('SUBMIT').toUpperCase() }
                                        </Text>
                                    </View>
                                </TouchableHighlight>
                            </View>
                        </View>
                    </View>
                </Modal>
                <View
                    style={styles.detailsContainer}
                    >
                    <Text style={[
                        styles.sectionHeader,
                        { marginBottom: 0 },
                        getTextAlign(direction),
                        getTextColor(theme)
                    ]}>
                        {I18n.t('RATE_THIS_SERVICE') }
                    </Text>
                    <Divider theme={theme}/>
                    <View style={[styles.starContainer, getRowOrdering(direction)]}>
                        {rateStars}
                    </View>
                </View>
                <ListView
                    dataSource={this.state.dataSource}
                    enableEmptySections
                    renderRow={(row) => this.renderFeedback(row) }
                    style={{ marginTop: 10 }}
                    direction={direction}
                    />
            </View>
        );
    }

    renderOpeningHoursRow(day) {
        const {service, language, direction, theme} = this.props;
        let open = service[`${day}_open`];
        let close = service[`${day}_close`];
        if ((!open && !close) || open == close) {
            return (
                <View style={[styles.row, styles.flex]}>
                    <Text style={[
                        styles.flex,
                        styles.sectionContent,
                        getFontFamily(language),
                        getTextColor(theme),
                        { textAlign: 'center' }
                    ]}>
                        {I18n.t('CLOSED').toUpperCase() }</Text>
                </View>
            )
        }
        return (
            <View style={[styles.row, styles.flex]}>
                <Text style={[
                    styles.flex,
                    styles.sectionContent,
                    getFontFamily(language),
                    getTextColor(theme),
                    { textAlign: 'right' }
                ]}>
                    {service[`${day}_open`] &&
                        service[`${day}_open`].substr(0, service[`${day}_open`].lastIndexOf(':')) }
                </Text>
                <Text style={[
                    { flex: 0.5 },
                    styles.sectionContent,
                    getFontFamily(language),
                    getTextColor(theme),
                    { textAlign: 'center' }
                ]}>-</Text>
                <Text style={[
                    styles.flex,
                    styles.sectionContent,
                    getFontFamily(language),
                    getTextColor(theme),
                    { textAlign: 'left' }
                ]}>
                    {service[`${day}_close`] &&
                        service[`${day}_close`].substr(0, service[`${day}_close`].lastIndexOf(':')) }
                </Text>
            </View>
        )
    };

    renderOpeningHours() {
        const {language, direction, service, theme} = this.props;
        let opened_days_count = 0;
        for (i = 0; i <= days.length; i++) {
            if (service[`${days[i]}_open`] || service[`${days[i]}_close`])
                opened_days_count += 1;
        }
        if (opened_days_count === 0) {
            return
        }
        let weekDay = days[new Date().getDay()];

        return (
            <View style={[styles.detailsContainer]}>
                <View style={[getRowOrdering(direction)]}>
                    <View style={[componentStyles.sectionIconContainer]}>
                        <Icon name="md-time" style={componentStyles.sectionIcon}/>
                    </View>
                    <View style={styles.flex}>
                        <Text
                            style={[
                                componentStyles.sectionHeader,
                                getTextAlign(direction),
                                getFontFamily(language),
                                getTextColor(theme)
                            ]}
                            >
                            {I18n.t('OPENING_HOURS') }
                        </Text>
                        {days.map((day, i) => (
                            <View
                                style={[
                                    getRowOrdering(direction),
                                    getBottomDividerColor(theme),
                                    { borderBottomWidth: 1, paddingVertical: 5 },
                                    (day === weekDay)
                                        ? getDividerColor(theme)
                                        : null
                                ]}
                                key={day}
                                >
                                <Text style={[
                                    { flex: 0.5 },
                                    styles.sectionContent,
                                    getTextAlign(direction),
                                    getFontFamily(language),
                                    getTextColor(theme)
                                ]}
                                    >
                                    {I18n.t(day.toUpperCase()) }
                                </Text>
                                {this.renderOpeningHoursRow(day) }
                            </View>
                        )) }
                    </View>
                </View>
            </View>
        )
    }

    getMapView(nativeAvailable) {
        const {service, serviceType, toolbarTitleIcon, toolbarTitleImage, location, theme, direction, language} = this.props;
        let {loaded} = this.state;

        if (!loaded) {
            return <View style={styles.map} />;
        }

        let lat = parseFloat(service.location.coordinates[1]),
            long = parseFloat(service.location.coordinates[0]);
        if (nativeAvailable) {
            return (<MapView
                cacheEnabled={true}
                scrollEnabled={false}
                initialRegion={{
                    latitude: lat,
                    longitude: long,
                    latitudeDelta: RADIUS,
                    longitudeDelta: RADIUS
                }}
                style={styles.map}
                >
                <MapView.Marker
                    coordinate={{
                        latitude: lat,
                        longitude: long
                    }}
                    />
            </MapView>);
        } else {
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

            return (<MapboxMapView
                style={styles.map}
                initialCenterCoordinate={{
                    latitude: lat,
                    longitude: long
                }}
                rotateEnabled={false}
                scrollEnabled={false}
                zoomEnabled={false}
                showsUserLocation={true}
                annotations={annotations}
                onFinishLoadingMap={() => {
                    this._mapBoxLoaded = true;
                    this._mapBox.setVisibleCoordinateBounds(latSW, longSW, latNE, longNE);
                } }
                ref={map => {
                    this._mapBox = map;
                } }
                />);
        }

    }

    render() {
        const {service, serviceType, toolbarTitleIcon, toolbarTitleImage, location, theme, direction, language} = this.props;
        let {nativeAvailable, loaded} = this.state;
        let locationName = (location) ? location.pageTitle || location.name : '';
        let providerName = (this.state.provider) ? this.state.provider.name : '';
        let hasPhoneNumber = this.state.loaded && !!this.state.provider.phone_number;
        let lat = parseFloat(service.location.coordinates[1]),
            long = parseFloat(service.location.coordinates[0]);

        let rating = this.serviceCommons.renderStars(service.rating);
        let openingHoursView = this.renderOpeningHours();
        let containerBackground = { backgroundColor: themes[theme || 'light'].backgroundColor };

        const windowWidth = screen.width;

        let iconName = (toolbarTitleIcon || '').trim();
        let titleIcon = null;

        let mapView = this.getMapView(nativeAvailable);

        if (iconName) {
            titleIcon = (<View
                style={[componentStyles.titleIcon, {
                    padding: 2,
                    backgroundColor: themes.light.greenAccentColor,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderColor: themes[theme].backgroundColor,
                    borderRadius: 7,
                },
                ]}>
                <Icon
                    name={iconName || defaultIcon }
                    style={[
                        {
                            fontSize: 18,
                            color: themes.dark.textColor,
                            textAlign: 'center',
                            alignItems: 'center',
                            justifyContent: 'center',
                        },
                    ]}
                    />
            </View>);
        } else if (toolbarTitleImage) {
            titleIcon = (<Image
                source={{ uri: toolbarTitleImage }}
                style={componentStyles.titleIcon}
                />);
        }

        const defaultServiceImage = {
            dark: require('../assets/service-placeholder-dark.png'),
            light: require('../assets/service-placeholder-light.png'),
        };

        const backgroundImage = service.image ? { uri: service.image } : defaultServiceImage[theme || 'light'];
        const textStyle = !service.image ? { color: themes[theme || 'light'].textColor } :
            {
                color: '#ffffff',
                textShadowOffset: { width: -1, height: 1 },
                textShadowRadius: service.image ? 0 : 1,
                textShadowColor: '#000000',
            };

        const imageAspectRatio = Math.sqrt(5);
        let fontSize = service.name.length > 35 ? (service.name.length > 45 ? 12 : 20) : 24;

        return (
            <ParallaxView
                backgroundSource={backgroundImage}
                windowHeight={service.image ? windowWidth / imageAspectRatio : 60}
                header={(
                    <View
                        style={[componentStyles.headerView, { flexDirection: direction == 'ltr' ? 'row' : 'row-reverse', }]}>
                        <Text style={[textStyle, {
                            fontSize
                        }]}>
                            {service.name}
                        </Text>
                    </View>
                ) }
                scrollableViewStyle={[styles.container, containerBackground]}
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this.onRefresh.bind(this) }
                        />
                }
                >
                <OfflineView
                    offline={this.state.offline}
                    onRefresh={this.onRefresh.bind(this) }
                    />
                {mapView}
                <View style={styles.detailsContainer}>
                    <View style={[
                        getRowOrdering(direction),
                        { paddingBottom: 5 }
                    ]}>
                        <Icon
                            name="ios-pin"
                            style={[
                                direction == 'rtl' ? { marginLeft: 8 } : { marginRight: 8 },
                                { fontSize: 14 },
                                { color: theme == 'dark' ? themes.dark.greenAccentColor : themes.light.textColor }
                            ]}
                            />
                        <Text style={[
                            getFontFamily(language),
                            {
                                color: theme == 'dark' ? themes.dark.greenAccentColor : themes.light.textColor,
                                fontSize: 13
                            }
                        ]}>
                            {locationName}
                        </Text>
                    </View>
                    <View style={[
                        getRowOrdering(direction),
                        { paddingBottom: 5 }
                    ]}>
                        <Text style={[
                            getFontFamily(language),
                            {
                                color: theme == 'dark' ? themes.dark.textColor : themes.light.textColor,
                                fontSize: 12
                            }
                        ]}>
                            {service.provider.name}
                        </Text>
                    </View>
                    <Divider theme={theme}/>
                </View>

                {!!service.description && <View style={[styles.detailsContainer]}>
                    <View style={[getRowOrdering(direction)]}>
                        <View style={[componentStyles.sectionIconContainer]}>
                            <Icon name="fa-info" style={componentStyles.sectionIcon}/>
                        </View>
                        <View style={styles.flex}>
                            <Text style={[
                                componentStyles.sectionHeader,
                                getTextAlign(direction),
                                getFontFamily(language),
                                getTextColor(theme)
                            ]}
                                >
                                {I18n.t('DESCRIPTION') }
                            </Text>
                            <Text style={[
                                styles.sectionContent,
                                getTextAlign(direction),
                                getFontFamily(language),
                                getTextColor(theme)
                            ]}>
                                {service.description}
                            </Text>
                        </View>
                    </View>
                </View>}

                {(!!service.address || !!service.provider.address) &&
                    <View style={[styles.detailsContainer]}>

                        <View style={[getRowOrdering(direction)]}>
                            <View style={[componentStyles.sectionIconContainer]}>
                                <Icon name="ios-pin" style={componentStyles.sectionIcon}/>
                            </View>
                            <View style={styles.flex}>
                                <Text style={[
                                    componentStyles.sectionHeader,
                                    getTextAlign(direction),
                                    getFontFamily(language),
                                    getTextColor(theme)
                                ]}
                                    >
                                    {I18n.t('ADDRESS') }
                                </Text>
                                <Text style={[
                                    styles.sectionContent,
                                    getTextAlign(direction),
                                    getFontFamily(language),
                                    getTextColor(theme)
                                ]}>
                                    {(service.address || service.provider.address) }
                                </Text>
                            </View>
                        </View>
                    </View>}

                {openingHoursView}
                <View style={styles.detailsContainer}>
                    <Button
                        color="green"
                        text={I18n.t('GET_DIRECTIONS') }
                        onPress={() => this.getDirections(lat, long) }
                        buttonStyle={{ marginBottom: 10 }}
                        textStyle={{ fontSize: 15 }}
                        />
                    {hasPhoneNumber && <Button
                        color="black"
                        text={I18n.t('CALL') }
                        onPress={hasPhoneNumber ? this.call.bind(this) : null}
                        buttonStyle={{ marginBottom: 10 }}
                        textStyle={{ fontSize: 15 }}
                        />}
                    {SHOW_SHARE_BUTTON &&
                        <Button
                            color="white"
                            text={I18n.t('SHARE') }
                            onPress={() => this.onShareClick() }
                            buttonStyle={{ marginBottom: 10 }}
                            textStyle={{ fontSize: 15 }}
                            />}
                </View>
            </ParallaxView>
        )
    }
}
const componentStyles = StyleSheet.create({
    titleIcon: {
        width: 26,
        height: 26,
        marginLeft: 5,
        marginRight: 5
    },
    sectionIconContainer: {
        width: 50,
        alignItems: 'center'
    },
    sectionIcon: {
        fontSize: 28,
        color: themes.light.greenAccentColor,
    },
    sectionHeader: {
        fontSize: 14,
        marginBottom: 2,
        fontWeight: 'bold'
    },
    headerView: {
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'flex-start',
        margin: 8
    },
});

const mapStateToProps = (state) => {
    return {
        theme: state.theme,
        direction: state.direction,
        region: state.region,
        language: state.language,
        toolbarTitleIcon: state.toolbarTitleIcon,
        toolbarTitleImage: state.toolbarTitleImage,
    };
};

export default connect(mapStateToProps)(ServiceDetails);

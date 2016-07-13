import React, {Component, PropTypes} from 'react';
import {
    ScrollView,
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
    AsyncStorage
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
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

const RADIUS = 0.01;
const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

export default class ServiceDetails extends Component {

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

    componentWillUnmount() {
        const {dispatch} = this.props;
        dispatch({type: 'TOOLBAR_TITLE_ICON_CHANGED', payload: null});
        dispatch({type: 'TOOLBAR_TITLE_CHANGED', payload: null});
    }

    componentWillMount() {
        this.apiClient = new ApiClient(this.context, this.props);
        if (!this.state.loaded) {
            this.fetchData().done();
        }
        const {dispatch, service, serviceType} = this.props;

        dispatch({type: 'TOOLBAR_TITLE_CHANGED', payload: service.name});
        dispatch({type: 'TOOLBAR_TITLE_ICON_CHANGED', payload: serviceType.icon_url});
    }

    _setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }

    _setRating(rating) {
        this.setState({rating});
    }

    _setLoaded(loaded) {
        this.setState({loaded});
    }


    async fetchData(update) {
        const {dispatch} = this.props;
        let service = this.props.service;
        try {
            if (update) {
                services = await this.apiClient.getService(service.id, true);
                if (services.length > 0) {
                    service = services[0];
                }
            }
            let feedbacks = await this.apiClient.getFeedbacks(service.id, true);
            let provider = await this.apiClient.fetch(service.provider_fetch_url, true);
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
            let lastSync = await AsyncStorage.getItem('lastServicesSync');
            this.setState({
                offline: true,
                lastSync: Math.ceil(Math.abs(new Date() - new Date(lastSync)) / 60000)
            })
        }
    }

    onRefresh() {
        this.setState({refreshing: true});
        this.fetchData(update = true).then(() => {
            this.setState({refreshing: false});
        });
    }

    getDirections(lat, long) {
        let location = `${lat},${long}`;
        if (Platform.OS === 'ios') {
            return Linking.openURL(`http://maps.apple.com/?daddr=${lat},${long}&dirflg=w&t=m`)
        }
        return Linking.openURL(`geo:${location}?q=${location}`);
    }

    call() {
        let provider = this.state.provider;
        Linking.openURL(`tel:${provider.phone_number}`);
    }

    onShareClick() {
        Share.open({
            share_text: "Refugee Info",
            share_URL: 'http://refugeeinfo.org',
            title: 'Refugee Info'
        }, (e) => {
            console.log(e);
        });
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
                                    }}
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
                        {marginBottom: 0},
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
                    renderRow={(row) => this.renderFeedback(row)}
                    style={{marginTop: 10}}
                    direction={direction}
                />
            </View>
        );
    }

    renderOpeningHoursRow(day) {
        const {service, language, direction, theme} = this.props;
        let open = service[`${day}_open`];
        let close = service[`${day}_close`];
        if (!open && !close) {
            return (
                <View style={[styles.row, styles.flex]}>
                    <Text style={[
                        styles.flex,
                        styles.sectionContent,
                        getFontFamily(language),
                        getTextColor(theme),
                        {textAlign: 'center'}
                    ]}>
                        {I18n.t('CLOSED').toUpperCase()}</Text>
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
                    {textAlign: 'right'}
                ]}>
                    {service[`${day}_open`] &&
                    service[`${day}_open`].substr(0, service[`${day}_open`].lastIndexOf(':'))}
                </Text>
                <Text style={[
                    {flex: 0.5},
                    styles.sectionContent,
                    getFontFamily(language),
                    getTextColor(theme),
                    {textAlign: 'center'}
                ]}>-</Text>
                <Text style={[
                    styles.flex,
                    styles.sectionContent,
                    getFontFamily(language),
                    getTextColor(theme),
                    {textAlign: 'left'}
                ]}>
                    {service[`${day}_close`] &&
                    service[`${day}_close`].substr(0, service[`${day}_close`].lastIndexOf(':'))}
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
            <View style={[styles.detailsContainer, {paddingTop: 0}]}>
                <Divider margin={4}/>
                <Text
                    style={[
                        styles.sectionHeader,
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
                            {borderBottomWidth: 1, paddingTop: 5, paddingBottom: 5},
                            (day===weekDay)
                                ? getDividerColor(theme)
                                : null
                        ]}
                        key={day}
                    >
                        <Text style={[
                            {flex: 0.5},
                            styles.sectionContent,
                            getTextAlign(direction),
                            getFontFamily(language),
                            getTextColor(theme)
                        ]}
                        >
                            {I18n.t(day.toUpperCase())}
                        </Text>
                        {this.renderOpeningHoursRow(day)}
                    </View>
                ))}
            </View>
        )
    }

    render() {
        const {service, serviceType, location, theme, direction, language} = this.props;

        let locationName = (location) ? location.pageTitle || location.name : '';
        let providerName = (this.state.provider) ? this.state.provider.name : '';
        let hasPhoneNumber = this.state.loaded && !!this.state.provider.phone_number;
        let lat = parseFloat(service.location.coordinates[1]),
            long = parseFloat(service.location.coordinates[0]);

        let rating = this.serviceCommons.renderStars(service.rating);
        let openingHoursView = this.renderOpeningHours();
        return (
            <ScrollView
                style={styles.container}
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
                    lastSync={this.state.lastSync}
                />
                <MapView
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
                </MapView>
                <View style={styles.detailsContainer}>
                    <View style={[
                        getRowOrdering(direction),
                        { paddingBottom: 5 }
                    ]}>
                        <Icon
                            name="ios-pin"
                            style={[
                                direction == 'rtl' ? { marginLeft: 8 } : { marginRight: 8 },
                                { fontSize: 13 },
                                { color: theme == 'dark' ? themes.dark.greenAccentColor : themes.light.textColor }
                            ]}
                        />
                        <Text style={[
                            getFontFamily(language),
                            {
                                color: theme == 'dark' ? themes.dark.greenAccentColor : themes.light.textColor,
                                fontSize: 12
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
                                color: theme == 'dark' ? themes.dark.greenAccentColor : themes.light.textColor,
                                fontSize: 12
                            }
                        ]}>
                            {providerName}
                        </Text>
                    </View>
                    <View style={getRowOrdering(direction) }>
                        <Text style={[
                            getFontFamily(language),
                            { color: themes.light.darkerDividerColor, fontSize: 12, marginRight: 5 }]
                        }>
                            {I18n.t('RATING').toUpperCase() }
                        </Text>
                        {rating}
                    </View>
                    <Divider theme={theme}/>
                    {!!service.description &&
                    <View>
                        <Text style={[
                                styles.sectionHeader,
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
                    }
                    {!!service.cost_of_service &&
                    <Text style={[
                            styles.sectionContent,
                            getTextAlign(direction),
                            getFontFamily(language),
                            getTextColor(theme)
                        ]}>
                        {I18n.t('COST_OF_SERVICE') }:
                        {`\n${service.cost_of_service}`}
                    </Text>
                    }
                    {service.selection_criteria.length > 0 &&
                    <Text style={[
                            styles.sectionContent,
                            getTextAlign(direction),
                            getFontFamily(language),
                            getTextColor(theme)
                        ]}>
                        {I18n.t('SELECTION_CRITERIA') }:
                        {service.selection_criteria.map((criteria, i) => (
                            `\n - ${criteria.text}`
                        )) }
                    </Text>
                    }
                </View>
                {openingHoursView}
                <View style={styles.detailsContainer}>
                    <Button
                        color="green"
                        text={I18n.t('GET_DIRECTIONS') }
                        onPress={() => this.getDirections(lat, long) }
                    />
                    <Button
                        color="black"
                        text={I18n.t('CALL') }
                        onPress={hasPhoneNumber ? this.call.bind(this) : null}
                    />
                    <Button
                        color="white"
                        text={I18n.t('SHARE') }
                        onPress={() => this.onShareClick() }
                    />
                </View>
                {this.state.offline ?
                    <Text style={[
                        styles.loading,
                        getTextColor(theme)
                    ]}>
                        {I18n.t('FEEDBACK_OFFLINE') }
                    </Text> :
                    this.state.loaded ?
                        this.renderFeedbackContainer()
                        :
                        <Text style={[
                            styles.loading,
                            getTextColor(theme)
                        ]}>
                            {I18n.t('LOADING') }
                        </Text>
                }
            </ScrollView>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        theme: state.theme,
        direction: state.direction,
        language: state.language
    };
};

export default connect(mapStateToProps)(ServiceDetails);

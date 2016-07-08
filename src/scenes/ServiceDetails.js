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
    generateTextStyles,
    getUnderlayColor,
    getRowOrdering,
    getAlignItems,
    getAlignText
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
            isFormDirty: false,
            offline: false
        };
        this.serviceCommons = new ServiceCommons();
    }

    componentDidMount() {
        this.apiClient = new ApiClient(this.context, this.props);
        if (!this.state.loaded) {
            this.fetchData().done();
        }
    }

    _setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }

    _setFormDirty(dirty) {
        this.setState({isFormDirty: dirty});
    }

    _setRating(rating) {
        this.setState({rating});
    }

    _setLoaded(loaded) {
        this.setState({loaded});
    }

    _isNameInvalid() {
        return this.state.isFormDirty && !this.state.name;
    }

    _isCommentInvalid() {
        return this.state.isFormDirty && !this.state.comment;
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
        this.setState({isFormDirty: true}, function () {
            let rating = this.state.rating;
            if (!this._isNameInvalid() && !this._isCommentInvalid() && !!rating) {
                this.apiClient.postFeedback(this.state.service, this.state.name, rating, this.state.comment).then(
                    (response) => {
                        this._setModalVisible(false);
                        this._setLoaded(false);
                        this.fetchData(update = true);
                    }
                );
            }
        });
    }

    renderFeedback(row) {
        const {direction, theme, language} = this.props;
        let stars = this.serviceCommons.renderStars(row.quality);
        return (
            <View style={styles.detailsContainer}>
                <View style={getRowOrdering(direction)}>
                    <Icon
                        name="ios-person"
                        style={[
                            styles.feedbackIcon,
                            direction=='rtl' ? {marginLeft: 6} : {marginRight: 6},
                            theme=='dark' ? styles.textDark : styles.textLight
                        ]}
                    />
                    <Text style={[
                        generateTextStyles(language),
                        getAlignItems(direction),
                        theme=='dark' ? styles.textDark : styles.textLight
                    ]}>
                        {row.name}
                    </Text>
                </View>
                <Divider theme={theme} margin={2}/>
                <Text style={[
                    getAlignText(direction),
                    generateTextStyles(language),
                    theme=='dark' ? styles.textDark : styles.textLight,
                    {marginBottom: 8, fontSize: 12}
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
                    this._setFormDirty(false);
                    this._setModalVisible(true);
                    this._setRating(i + 1);
                }}
                style={[
                    styles.starIcon,
                    (this.state.rating >= i + 1)  ? null: {color: themes.light.dividerColor}
                ]}
            />
        ));
        return (
            <View>
                <Modal
                    animationType={'fade'}
                    onRequestClose={() => this._setModalVisible(false)}
                    transparent={true}
                    visible={this.state.modalVisible}
                >
                    <View style={[styles.modalContainer]}>
                        <View style={[
                                styles.modalInnerContainer,
                                theme=='dark' ? styles.modalInnerContainerDark : styles.modalInnerContainerLight
                            ]}>
                            <Text style={[
                                generateTextStyles(language),
                                {marginBottom: 10, textAlign: 'center'},
                                theme=='dark' ? styles.textAccentYellow : styles.textLight
                            ]}>
                                {I18n.t('YOUR_RATING')}
                            </Text>
                            <View style={[styles.starContainer, getRowOrdering(direction)]}>
                                {rateStars}
                            </View>
                            <Divider theme={theme} margin={4}/>
                            <TextInput
                                onChangeText={
                                    (text) => this.setState({name: text})
                                }
                                placeholder={I18n.t('NAME')}
                                placeholderTextColor={
                                    this._isCommentInvalid() ? '#a94442' :
                                    theme=='dark' ? themes.light.dividerColor : themes.light.darkerDividerColor
                                }
                                value={this.state.name}
                                style={[
                                    styles.textInputModal,
                                    theme=='dark' ? styles.textDark : styles.textLight,
                                    direction=='rtl' ? styles.alignRight : null
                                ]}
                            />
                            {this._isNameInvalid() &&
                            <Text style={styles.validationText}>
                                {I18n.t('FIELD_REQUIRED')}
                            </Text>
                            }
                            <TextInput
                                multiline
                                onChangeText={
                                    (text) => this.setState({comment: text})
                                }
                                placeholder={I18n.t('COMMENT')}
                                placeholderTextColor={
                                    this._isCommentInvalid() ? '#a94442' :
                                    theme=='dark' ? themes.light.dividerColor : themes.light.darkerDividerColor
                                }
                                value={this.state.comment}
                                style={[
                                    styles.textInputMultiline,
                                    theme=='dark' ? styles.textDark : styles.textLight,
                                    direction=='rtl' ? styles.alignRight : null
                                ]}
                            />
                            {this._isCommentInvalid() &&
                            <Text style={styles.validationText}>
                                {I18n.t('FIELD_REQUIRED')}
                            </Text>
                            }
                            <Divider theme={theme} margin={4}/>
                            <View style={[styles.modalButtonContainer, getRowOrdering(direction)]}>
                                <TouchableHighlight
                                    onPress={() => {
                                        this._setModalVisible(false);
                                    }}
                                    underlayColor={getUnderlayColor(theme)}
                                >
                                    <View style={styles.modalButton}>
                                        <Text style={[
                                            generateTextStyles(language),
                                            theme=='dark' ? styles.textAccentYellow : styles.textLight

                                        ]}>
                                            {I18n.t('CLOSE').toUpperCase()}
                                        </Text>
                                    </View>
                                </TouchableHighlight>
                                <TouchableHighlight
                                    onPress={() => this.postComment()}
                                    underlayColor={getUnderlayColor(theme)}
                                >
                                    <View style={styles.modalButton}>
                                        <Text style={[
                                            generateTextStyles(language),
                                            theme=='dark' ? styles.textAccentYellow : styles.textLight
                                        ]}>
                                            {I18n.t('SUBMIT').toUpperCase()}
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
                            styles.sectionHeader, {marginBottom: 0},
                            getAlignText(direction),
                            theme=='dark' ? styles.textDark : styles.textLight
                        ]}>
                        {I18n.t('RATE_THIS_SERVICE')}
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

    render() {
        const {service, serviceType, location, theme, direction, language} = this.props;

        let locationName = (location) ? location.name : '';
        let hasPhoneNumber = this.state.loaded && !!this.state.provider.phone_number;

        let coordinates = service.location.match(/[\d\.]+/g);
        let lat = parseFloat(coordinates[2]),
            long = parseFloat(coordinates[1]);

        let weekDay = days[new Date().getDay()];
        let open = service[`${weekDay}_open`];
        let close = service[`${weekDay}_close`];
        let openingHours = (!!open && !!close) ?
            `${open.substr(0, open.lastIndexOf(':'))} - ${close.substr(0, close.lastIndexOf(':'))}` : null;
        let rating = this.serviceCommons.renderStars(service.rating);

        return (
            <ScrollView
                style={styles.container}
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this.onRefresh.bind(this)}
                    />
                }
            >
                <OfflineView
                    offline={this.state.offline}
                    onRefresh={this.onRefresh.bind(this)}
                    lastSync={this.state.lastSync}
                />
                <MapView
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
                        {paddingBottom: 5}
                        ]}>
                        <Icon
                            name="ios-pin"
                            style={[
                                direction=='rtl' ? {marginLeft: 8} : {marginRight: 8},
                                {fontSize: 13},
                                {color: theme=='dark' ? themes.dark.greenAccentColor : themes.light.textColor}
                            ]}
                        />
                        <Text style={[
                                generateTextStyles(language),
                                {color: theme=='dark' ? themes.dark.greenAccentColor : themes.light.textColor,
                                fontSize: 12}
                            ]}>
                            {locationName}
                        </Text>
                    </View>
                    <View style={getRowOrdering(direction)}>
                        <Text style={[
                                        generateTextStyles(language),
                                        {color: themes.light.darkerDividerColor, fontSize: 12, marginRight: 5}]
                                    }>
                            {I18n.t('RATING').toUpperCase()}
                        </Text>
                        {rating}
                    </View>
                    <Divider theme={theme}/>
                    {!!service.description &&
                    <View>
                        <Text style={[
                                styles.sectionHeader,
                                getAlignText(direction),
                                generateTextStyles(language),
                                theme=='dark' ? styles.textDark : styles.textLight
                            ]}
                        >
                            {I18n.t('DESCRIPTION')}
                        </Text>
                        <Text style={[
                            styles.sectionContent,
                            getAlignText(direction),
                            generateTextStyles(language),
                            theme=='dark' ? styles.textDark : styles.textLight
                        ]}>
                            {service.description}
                        </Text>
                    </View>
                    }
                    {!!openingHours &&
                    <Text style={[
                        styles.sectionContent,
                        getAlignText(direction),
                        generateTextStyles(language),
                        theme=='dark' ? styles.textDark : styles.textLight
                    ]}>
                        {I18n.t('OPENING_HOURS')}:
                        {`\n${openingHours}`}
                    </Text>
                    }
                    {!!service.cost_of_service &&
                    <Text style={[
                        styles.sectionContent,
                        getAlignText(direction),
                        generateTextStyles(language),
                        theme=='dark' ? styles.textDark : styles.textLight
                    ]}>
                        {I18n.t('COST_OF_SERVICE')}:
                        {`\n${service.cost_of_service}`}
                    </Text>
                    }
                    {service.selection_criteria.length > 0 &&
                    <Text style={[
                        styles.sectionContent,
                        getAlignText(direction),
                        generateTextStyles(language),
                        theme=='dark' ? styles.textDark : styles.textLight
                    ]}>
                        {I18n.t('SELECTION_CRITERIA')}:
                        {service.selection_criteria.map((criteria, i) => (
                            `\n - ${criteria.text}`
                        ))}
                    </Text>
                    }
                </View>
                <View style={styles.detailsContainer}>
                    <Button
                        color="green"
                        text={I18n.t('GET_DIRECTIONS')}
                        onPress={() => this.getDirections(lat, long)}
                    />
                    <Button
                        color="black"
                        text={I18n.t('CALL')}
                        onPress={hasPhoneNumber ? this.call.bind(this) : null}
                    />
                    <Button
                        color="white"
                        text={I18n.t('SHARE')}
                        onPress={() => this.onShareClick()}
                    />
                </View>
                {this.state.offline ?
                    <Text style={[
                        styles.loading,
                        theme=='dark' ? styles.textDark : styles.textLight
                    ]}>
                        {I18n.t('FEEDBACK_OFFLINE')}
                    </Text> :
                    this.state.loaded ?
                        this.renderFeedbackContainer()
                        :
                        <Text style={[
                            styles.loading,
                            theme=='dark' ? styles.textDark : styles.textLight
                        ]}>
                            {I18n.t('LOADING')}
                        </Text>

                }
            </ScrollView>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        theme: state.theme.theme,
        direction: state.direction,
        language: state.language
    };
};

export default connect(mapStateToProps)(ServiceDetails);

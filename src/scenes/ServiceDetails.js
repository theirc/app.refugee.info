import React, { Component } from 'react';
import {
    PropTypes,
    ScrollView,
    TouchableHighlight,
    StyleSheet,
    Text,
    ListView,
    View,
    Linking,
    TextInput,
    Modal
} from 'react-native';
import { default as Icon } from 'react-native-vector-icons/FontAwesome';
import MapView from 'react-native-maps';

import Messages from '../constants/Messages';
import ApiClient from '../utils/ApiClient';
import ServiceCommons from '../utils/ServiceCommons';

const RADIUS = 0.01;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column'
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'column',
        padding: 15,
        backgroundColor: '#EEE'
    },
    feedbackContainer: {
        marginTop: 10
    },
    detailsContainer: {
        margin: 5
    },
    button: {
        borderRadius: 5,
        borderColor: 'black',
        borderWidth: 2,
        margin: 5,
        marginBottom: 0
    },
    buttonInactive: {
        borderRadius: 5,
        borderColor: 'black',
        borderWidth: 2,
        margin: 5,
        marginBottom: 0,
        backgroundColor: '#EEE'
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
    flex: {
        flex: 1
    },
    modalButtonContainer: {
        flex: 1,
        flexDirection: 'row',
        marginLeft: 5,
        marginRight: 10
    }
});
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
            modalVisible: false
        };
        this.apiClient = new ApiClient();
        this.serviceCommons = new ServiceCommons();
    }

    componentDidMount() {
        if (!this.state.loaded) {
            this.fetchData().done();
        }
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

    async fetchData() {
        let service = this.props.service;
        let feedbacks = await this.apiClient.getFeedbacks(service.id);
        let provider = await this.apiClient.fetch(service.provider_fetch_url);
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(feedbacks),
            loaded: true,
            provider,
            service
        });
    }

    getDirections(lat, long) {
        let location = `${lat},${long}`;
        Linking.openURL(`geo:${location}?q=${location}`);
    }

    call() {
        let provider = this.state.provider;
        Linking.openURL(`tel:${provider.phone_number}`);
    }

    postComment() {
        let name = this.state.name;
        let rating = this.state.rating;
        let comment = this.state.comment;
        if (!!name && !!rating && !!comment) {
            this.apiClient.postFeedback(this.state.service, name, rating, comment).then(
                (response) => {
                    this._setModalVisible(false);
                    this._setLoaded(false);
                    this.fetchData();
                }
            );
        }
    }

    renderFeedback(row) {
        let stars = this.serviceCommons.renderStars(row.quality);
        return (
            <View style={styles.commentBox}>
                <Icon
                    color="black"
                    name="user"
                    size={32}
                    style={styles.commentIcon}
                />
                <View style={styles.comment}>
                    <Text style={styles.comment}>{row.extra_comments}</Text>
                    <Text style={styles.comment}>{Messages.RATING}: {stars}</Text>
                </View>
            </View>
        );
    }

    renderFeedbackContainer() {
        let rateStars = [...new Array(5)].map((x, i) => (
            <Icon
                key={i}
                name={(this.state.rating >= i + 1) ? 'star' : 'star-o'}
                onPress={() => {
                    this._setModalVisible(true);
                    this._setRating(i + 1);
                }}
                size={24}
                style={styles.flex}
            />
        ));
        return (
            <View>
                <Modal
                    animated={this.state.animated}
                    onRequestClose={() => this._setModalVisible(false)}
                    transparent={this.state.transparent}
                    visible={this.state.modalVisible}
                >
                    <View style={[styles.modalContainer]}>
                        <View style={[styles.modalInnerContainer]}>
                            <Text style={[styles.title, styles.textCenter]}>
                                {Messages.YOUR_RATING}
                            </Text>
                            <View style={styles.starContainer}>
                                {rateStars}
                            </View>
                            <TextInput
                                onChangeText={
                                    (text) => this.setState({name: text})
                                }
                                placeholder={Messages.NAME}
                                value={this.state.name}
                            />
                            <TextInput
                                multiline
                                onChangeText={
                                    (text) => this.setState({comment: text})
                                }
                                placeholder={Messages.COMMENT}
                                value={this.state.comment}
                            />
                            <View style={styles.modalButtonContainer}>
                                <TouchableHighlight
                                    onPress={() => {
                                        this._setModalVisible(false);
                                    }}
                                    style={styles.flex}
                                >
                                    <Text>
                                        {Messages.CLOSE}
                                    </Text>
                                </TouchableHighlight>
                                <TouchableHighlight
                                    onPress={() => this.postComment()}
                                    style={styles.flex}
                                >
                                    <Text style={styles.textRight}>
                                        {Messages.SUBMIT}
                                    </Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                    </View>
                </Modal>
                <ListView
                    dataSource={this.state.dataSource}
                    enableEmptySections
                    renderRow={(row) => this.renderFeedback(row)}
                    style={styles.feedbackContainer}
                />
                <View
                    style={styles.commentForm}
                >
                    <Text style={[styles.title, styles.textCenter]}>
                        {Messages.RATE_THIS_SERVICE}
                    </Text>
                    <View style={styles.starContainer}>
                        {rateStars}
                    </View>
                </View>
            </View>
        );
    }

    render() {
        let service = this.props.service;
        let hasPhoneNumber = this.state.loaded && !!this.state.provider.phone_number;

        let coordinates = service.location.match(/[\d\.]+/g);
        let lat = parseFloat(coordinates[1]),
            long = parseFloat(coordinates[0]);

        let weekDay = days[new Date().getDay()];
        let open = service[`${weekDay}_open`];
        let close = service[`${weekDay}_close`];
        let openingHours = (!!open && !!close) ?
            `${open.substr(0, open.lastIndexOf(':'))} - ${close.substr(0, close.lastIndexOf(':'))}` : null;

        let rowContent = this.serviceCommons.renderRowContent(
            service, this.props.serviceType, this.props.location
        );

        return (
            <ScrollView style={styles.container}>
                <TouchableHighlight
                    style={styles.buttonContainer}
                    underlayColor="white"
                >
                    <View>{rowContent}</View>
                </TouchableHighlight>
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
                    {!!service.description &&
                        <Text>
                            {Messages.DESCRIPTION}:
                            {`\n${service.description}`}
                        </Text>
                    }
                    {!!openingHours &&
                        <Text>
                            {Messages.OPENING_HOURS}:
                            {`\n${openingHours}`}
                        </Text>
                    }
                    {!!service.cost_of_service &&
                        <Text>
                            {Messages.COST_OF_SERVICE}:
                            {`\n${service.cost_of_service}`}
                        </Text>
                    }
                    {service.selection_criteria.length > 0 &&
                        <Text>
                            {Messages.SELECTION_CRITERIA}:
                            {service.selection_criteria.map((criteria, i) => (
                                `\n - ${criteria}`
                            ))}
                        </Text>
                    }
                </View>
                <TouchableHighlight
                    onPress={() => this.getDirections(lat, long)}
                    style={styles.button}
                    underlayColor="#EEE"
                >
                    <Text style={styles.textCenter}>{Messages.GET_DIRECTIONS}</Text>
                </TouchableHighlight>
                <TouchableHighlight
                    onPress={hasPhoneNumber ? this.call.bind(this) : null}
                    style={hasPhoneNumber ? styles.button : styles.buttonInactive}
                    underlayColor="#EEE"
                >
                    <Text style={styles.textCenter}>{Messages.CALL}</Text>
                </TouchableHighlight>
                {this.state.loaded ?
                    (this.renderFeedbackContainer()) :
                    <Text style={styles.loading}>
                        {Messages.LOADING}
                    </Text>
                }
            </ScrollView>
        );
    }
}

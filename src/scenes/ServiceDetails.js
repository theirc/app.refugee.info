import React, {
    Component,
    PropTypes,
    ScrollView,
    TouchableHighlight,
    StyleSheet,
    Text,
    ListView,
    View,
    Linking
} from 'react-native';
import { default as Icon } from 'react-native-vector-icons/FontAwesome';

import Messages from '../constants/Messages';
import ApiClient from '../utils/ApiClient';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column'
    },
    listViewContainer: {
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
    commentBox: {
        flexDirection: 'row',
        flex: 1
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
    }
});
const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

export default class ServiceDetails extends Component {

    static contextTypes = {
        navigator: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2
            }),
            loaded: false.valueOf(),
            props
        };
        this.apiClient = new ApiClient();
    }

    componentDidMount() {
        if (!this.state.loaded) {
            this.fetchData().done();
        }
    }

    async fetchData() {
        let service = this.state.props.row;
        let feedbacks = await this.apiClient.getFeedbacks(service.id);
        let provider = await this.apiClient.fetch(service.provider_fetch_url);
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(feedbacks),
            loaded: true,
            provider
        });
    }

    getDirections(service) {
        // TODO
    }

    call() {
        let provider = this.state.provider;
        Linking.openURL(`tel:${provider.phone_number}`);
    }

    renderFeedback(row) {
        let stars = [...new Array(5)].map((x, i) => (
            <Icon
                color={(row.quality >= i + 1) ? 'black' : 'white'}
                key={i}
                name="star"
                size={12}
            />
        ));
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
        )
    }

    render() {
        let service = this.state.props.row;
        let weekDay = days[new Date().getDay()];
        let open = service[`${weekDay}_open`];
        let close = service[`${weekDay}_close`];
        let openingHours = (!!open && !!close) ?
            `${open.substr(0, open.lastIndexOf(':'))} - ${close.substr(0, close.lastIndexOf(':'))}` : null;
        let hasPhoneNumber = this.state.loaded && !!this.state.provider.phone_number;

        return (
            <ScrollView style={styles.container}>
                <TouchableHighlight
                    style={styles.buttonContainer}
                    underlayColor="white"
                >
                    <View>{this.state.props.rowContent}</View>
                </TouchableHighlight>
                <View style={styles.detailsContainer}>
                    {service.description &&
                        <Text>
                            {Messages.DESCRIPTION}:
                            {`\n${service.description}`}
                        </Text>
                    }
                    {openingHours &&
                        <Text>
                            {Messages.OPENING_HOURS}:
                            {`\n${openingHours}`}
                        </Text>
                    }
                    {service.cost_of_service &&
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
                    onPress={this.getDirections.bind(this, service)}
                    style={styles.buttonInactive}
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
                    (<ListView
                        dataSource={this.state.dataSource}
                        enableEmptySections
                        renderRow={this.renderFeedback.bind(this)}
                        style={styles.feedbackContainer}
                     />) :
                    <Text style={styles.loading}>
                        {Messages.LOADING}
                    </Text>
                }
            </ScrollView>
        )
    }
}

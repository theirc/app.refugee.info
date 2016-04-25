import React, {
    Component,
    PropTypes,
    ScrollView,
    TouchableHighlight,
    StyleSheet,
    Text,
    ListView,
    View
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
    details: {
        margin: 5
    },
    button: {
        borderRadius: 5,
        borderColor: 'black',
        borderWidth: 2,
        margin: 5,
        marginBottom: 0
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
    }
});

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
        let feedbacks = await this.apiClient.getFeedbacks(this.state.props.row.id);
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(feedbacks),
            loaded: true
        });
    }

    getDirections(service) {
    }

    call(service) {
    }

    renderFeedback(row) {
        let stars = [...Array(5)].map((x, i) => (
            <Icon
                color={(row.quality >= i + 1) ? "black" : "white"}
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
        const { navigator } = this.context;
        let service = this.state.props.row;

        return (
            <ScrollView style={styles.container}>
                <TouchableHighlight
                    style={styles.buttonContainer}
                    underlayColor="white"
                >
                    <View>{this.state.props.rowContent}</View>
                </TouchableHighlight>
                {service.cost_of_service &&
                    <Text style={styles.details}>
                        {Messages.COST_OF_SERVICE}:
                        {'\n' + service.cost_of_service}
                    </Text>
                }
                {service.selection_criteria.length > 0 &&
                    <Text style={styles.details}>
                        {Messages.SELECTION_CRITERIA}:
                        {service.selection_criteria.map((criteria, i) => (
                            '\n - ' + criteria
                        ))}
                    </Text>
                }
                <TouchableHighlight
                    onPress={this.getDirections.bind(this, service)}
                    style={styles.button}
                    underlayColor="#EEE"
                >
                    <Text style={styles.textCenter}>{Messages.GET_DIRECTIONS}</Text>
                </TouchableHighlight>
                <TouchableHighlight
                    onPress={this.call.bind(this, service)}
                    style={styles.button}
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
                    <Text style={styles.feedbackContainer}>
                        {Messages.LOADING_COMMENTS}...
                    </Text>
                }
            </ScrollView>
        )
    }
}

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
        return (
            <Text>{row.extra_comments}</Text>
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
                        Cost of service:
                        {'\n' + service.cost_of_service}
                    </Text>
                }
                {service.selection_criteria.length > 0 &&
                    <Text style={styles.details}>
                        Selection Criteria:
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
                    <Text style={styles.textCenter}>Get directions</Text>
                </TouchableHighlight>
                <TouchableHighlight
                    onPress={this.call.bind(this, service)}
                    style={styles.button}
                    underlayColor="#EEE"
                >
                    <Text style={styles.textCenter}>Call</Text>
                </TouchableHighlight>
                {this.state.loaded ?
                    (<ListView
                        dataSource={this.state.dataSource}
                        enableEmptySections
                        renderRow={this.renderFeedback.bind(this)}
                        style={styles.feedbackContainer}
                    />) :
                    <Text>Loading comments...</Text>
                }
            </ScrollView>
        )
    }
}

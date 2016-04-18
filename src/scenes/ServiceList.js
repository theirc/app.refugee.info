import React, {
    Component,
    PropTypes,
    View,
    Text,
    ListView,
    StyleSheet,
    TouchableHighlight
} from 'react-native';

const REQUEST_URL = 'http://api.refugee.info/v1/services/search/?format=json';

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
    }
});

export default class ServiceList extends Component {

    static contextTypes = {
        navigator: PropTypes.object.isRequired
    };

    static renderLoadingView() {
        return (
            <View>
                <Text>Loading services...</Text>
            </View>
        );
    }

    constructor(props) {
        super(props);
        this.state = {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2
            }),
            loaded: false
        };
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData() {
        fetch(REQUEST_URL)
            .then((response) => response.json())
            .then((responseData) => {
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(responseData),
                    loaded: true
                });
            })
            .done();
    }

    renderRow(row) {
        return (
            <TouchableHighlight
                onPress={() => {}}
                style={styles.buttonContainer}
                underlayColor="white"
            >
                <Text>{row.name}</Text>
            </TouchableHighlight>
        );
    }

    render() {
        const { navigator } = this.context;

        if (!this.state.loaded) {
            return ServiceList.renderLoadingView();
        } else {
            return (
              <View style={styles.container}>
                  <ListView
                      dataSource={this.state.dataSource}
                      renderRow={this.renderRow}
                      style={styles.listViewContainer}
                  />
              </View>
            )
        }
    }
}

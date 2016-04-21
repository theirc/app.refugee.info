import React, { Component, PropTypes, View, Text, AsyncStorage, Alert } from 'react-native';

export default class GeneralInformation extends Component {

    static contextTypes = {
        navigator: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            region: ''
        };
    }

    componentDidMount() {
        this._loadInitialState().done();
    }

    async _loadInitialState() {
        let region = await AsyncStorage.getItem('region');
        this.setState({region: JSON.parse(region)});
    }

    render() {
        const { navigator } = this.context;

        return (
            <View>
                <Text>General Info</Text>
                <Text>{this.state.region.name}</Text>
            </View>
        );
    }

}

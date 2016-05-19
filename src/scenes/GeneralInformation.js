import React, { Component } from 'react';
import {PropTypes, View, Text, AsyncStorage, StyleSheet, ListView, TouchableHighlight, TextInput} from 'react-native';
import I18n from '../constants/Messages';
import MapButton from '../components/MapButton';
import { Button } from 'react-native-material-design';
import { connect } from 'react-redux';

export default class GeneralInformation extends Component {

    static contextTypes = {
        navigator: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2
            })
        };
    }

    componentDidMount() {
        this._loadInitialState();
    }

    async _loadInitialState() {
        let region = JSON.parse(await AsyncStorage.getItem('region'));
        if (!region) {
            return;
        }
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(region.content),
            generalInfo: region.content
        });
    }

    onClick(title, section) {
        const { navigator } = this.context;
        navigator.forward(null, title, {section}, this.state);
    }

    _onChangeText(text) {
        const generalInfo = this.state.generalInfo;
        const filteredGeneralInfo = generalInfo.filter((x) => x.section.toLowerCase()
            .replace(/(<(?:.|\n)*?>|\s)/gm, '').indexOf(text.toLowerCase().replace(/\s/gm, '')) !== -1);
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(filteredGeneralInfo)
        });
    }

    renderHeader() {
        return (
            <View>
                <TextInput
                    onChangeText={(text) => this._onChangeText(text)}
                    placeholder={I18n.t('SEARCH')}
                />
            </View>
        );
    }

    renderRow(rowData) {
        const {primary, theme} = this.props;
        return (
            <Button
                primary={primary}
                theme={theme}
                raised={true}
                text={rowData.title}
                onPress={() => this.onClick(rowData.title, rowData.section)}
            />
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <ListView
                    dataSource={this.state.dataSource}
                    enableEmptySections
                    renderHeader={() => this.renderHeader()}
                    renderRow={(rowData) => this.renderRow(rowData)}
                    style={styles.listViewContainer}
                />
                <MapButton/>
            </View>
        );
    }
}


const mapStateToProps = (state) => {
    return {
        primary: state.theme.primary,
        theme: state.theme.theme
    };
};

export default connect(mapStateToProps)(GeneralInformation);


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

import React, { Component, PropTypes } from 'react';
import {
    View,
    Text,
    AsyncStorage,
    StyleSheet,
    ListView,
    TouchableHighlight,
    TextInput,
    ScrollView,
    RefreshControl
} from 'react-native';
import I18n from '../constants/Messages';
import MapButton from '../components/MapButton';
import OfflineView from '../components/OfflineView';
import { connect } from 'react-redux';
import ApiClient from '../utils/ApiClient';
import styles from '../styles';
import { Divider } from 'react-native-material-design';

export default class GeneralInformation extends Component {

    static contextTypes = {
        navigator: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2
            }),
            loaded: false,
            offline: false,
            refreshing: false,
            lastSync: null
        };
    }

    componentDidMount() {
        this.apiClient = new ApiClient(this.context);
        this._loadInitialState();
    }

    async _loadInitialState() {
        const { navigator } = this.context;

        let region = JSON.parse(await AsyncStorage.getItem('region'));
        if (!region) {
            return;
        }

        try {
            region = await this.apiClient.getLocation(region.id, true);
            await AsyncStorage.setItem('regionCache', JSON.stringify(region));
            await AsyncStorage.setItem('lastGeneralSync', new Date().toISOString());
            this.setState({
                offline: false
            })
        }
        catch (e){
            region = JSON.parse(await AsyncStorage.getItem('regionCache'));
            this.setState({
                offline: true
            })
        }
        
        if (!region) {
            return;
        }
        let lastSync = await AsyncStorage.getItem('lastGeneralSync');

        if(region.content && region.content.length === 1) {
            let c = region.content[0];
            navigator.to('infoDetails', c.title, {section:c.section});
        }
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(region.content),
            generalInfo: region.content,
            region: region,
            loaded: true,
            lastSync: Math.ceil(Math.abs(new Date() - new Date(lastSync)) / 60000)
        });
    }

    onRefresh(){
        this.setState({refreshing: true});
        this._loadInitialState().then(() => { this.setState({refreshing: false}); });
    }

    onClick(title, section) {
        const { navigator } = this.context;
        if (this.state.searchText) {
            let reg = new RegExp(`(${this.state.searchText})`, 'ig');
            section = (reg) ? section.replace(reg, '<mark>$1</mark>') : section;
        }
        navigator.forward(null, title, {section}, this.state);
    }

    renderHeader() {
        return (
            <View style={styles.stickyInputContainer}>
                <TextInput
                    onChangeText={(text) => this._onChangeText(text)}
                    placeholder={I18n.t('SEARCH')}
                    style={styles.stickyInput}
                    returnKeyType={'search'}
                    autoCapitalize="none"
                    autoCorrect={false}
                    clearButtonMode="always"
                />
            </View>
        );
    }

    renderRow(rowData) {
        const {primary, theme} = this.props;
        return (
            <View>
                <TouchableHighlight
                    onPress={() => this.onClick(rowData.title, rowData.section)}
                    style={styles.buttonContainer}
                    underlayColor= {theme == 'light' ? 'rgba(72, 133, 237, 0.2)' : 'rgba(0, 0, 0, 0.1)'}
                >
                    <View style={styles.generalInfoItem}>
                        <Text style={styles.generalInfoText}>{rowData.title}</Text>
                    </View>
                </TouchableHighlight>
                <Divider />
            </View>
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <OfflineView 
                    offline={this.state.offline} 
                    onRefresh={this.onRefresh.bind(this)}
                    lastSync={this.state.lastSync}
                />
                <ListView
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this.onRefresh.bind(this)}
                        />
                    }
                    dataSource={this.state.dataSource}
                    enableEmptySections
                    renderSectionHeader={() => this.renderHeader()}
                    renderRow={(rowData) => this.renderRow(rowData)}
                    style={styles.listViewContainer}
                    keyboardShouldPersistTaps={true}
                    keyboardDismissMode="on-drag"
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

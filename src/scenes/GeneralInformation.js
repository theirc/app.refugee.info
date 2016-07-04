import React, {Component, PropTypes} from 'react';
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
import {MapButton, OfflineView, DirectionalText, SearchBar} from '../components';
import {connect} from 'react-redux';
import ApiClient from '../utils/ApiClient';
import styles, {getUnderlayColor} from '../styles';
import store from '../store';
import Icon from 'react-native-vector-icons/Ionicons';

export class GeneralInformation extends Component {

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
        this.apiClient = new ApiClient(this.context, this.props);
        this._loadInitialState();
    }

    async _loadInitialState() {
        let {region, information} = this.props;
        const {navigator} = this.context;  

        if(information) {
            region = information;
        }

        if (!region) {
            navigator.to('countryChoice');
            return;
        }

        if (region.content && region.content.length === 1) {
            let c = region.content[0];
            navigator.to('infoDetails', null, {section: c.section, sectionTitle: c.title});
            return;
        }
        let lastSync = await AsyncStorage.getItem('lastGeneralSync');

        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(region.content),
            generalInfo: region.content,
            region: region,
            loaded: true,
            lastSync: Math.ceil(Math.abs(new Date() - new Date(lastSync)) / 60000)
        });

        try {
            region = await this.apiClient.getLocation(region.id, true);
            await AsyncStorage.setItem('regionCache', JSON.stringify(region));
            await AsyncStorage.setItem('lastGeneralSync', new Date().toISOString());
            this.setState({
                offline: false,
                region: region
            })
        }
        catch (e) {
            this.setState({
                offline: true
            })
        }
    }

    onRefresh() {
        this.setState({refreshing: true});
        this._loadInitialState().then(() => {
            this.setState({refreshing: false});
        });
    }

    onClick(title, section) {
        const {navigator} = this.context;
        if (this.state.searchText) {
            let reg = new RegExp(`(${this.state.searchText})`, 'ig');
            section = (reg) ? section.replace(reg, '<mark>$1</mark>') : section;
        }
        navigator.forward(null, null, {section, sectionTitle: title}, this.state);
    }

    renderRow(rowData) {
        const {theme} = this.props;
        return (
            <View>
                <TouchableHighlight
                    onPress={() => this.onClick(rowData.title, rowData.section)}
                    underlayColor={getUnderlayColor(theme)}
                >
                    <View
                        style={[
                            styles.listItemContainer,
                            theme=='dark' ? styles.listItemContainerDark : styles.listItemContainerLight
                        ]}
                    >
                        <Icon name="md-bus" style={styles.listItemIconInline}/>
                        <View style={[
                            styles.listItemDividerInline,
                            theme=='dark' ? styles.listItemDividerDark : styles.listItemDividerLight
                        ]}/>
                        <View style={[
                                styles.listItemTextContainer,
                                {alignItems: 'flex-start'}
                            ]}>
                            <Text style={[
                                styles.listItemText,
                                theme=='dark' ? styles.listItemTextDark : styles.listItemTextLight
                            ]}>
                                {rowData.title}
                            </Text>
                        </View>
                    </View>
                </TouchableHighlight>
            </View>
        );
    }

    render() {
        const {theme} = this.props;
        return (
            <View style={styles.container}>
                <View style={styles.horizontalContainer}>
                    <SearchBar theme={theme}/>
                </View>
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
                    renderRow={(rowData) => this.renderRow(rowData)}
                    keyboardShouldPersistTaps={true}
                    keyboardDismissMode="on-drag"
                />
            </View>
        );
    }
}


const mapStateToProps = (state) => {
    return {
        primary: state.theme.primary,
        language: state.language,
        region: state.region,
        theme: state.theme.theme,
        direction: state.direction
    };
};

export default connect(mapStateToProps)(GeneralInformation);

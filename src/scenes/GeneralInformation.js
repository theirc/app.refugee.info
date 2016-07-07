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
import {MapButton, OfflineView, DirectionalText, SearchBar, ListItem, Button} from '../components';
import {connect} from 'react-redux';
import ApiClient from '../utils/ApiClient';
import styles, {getUnderlayColor, themes} from '../styles';
import store from '../store';

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

    componentWillMount() {
        const {region} = this.props;
        const {dispatch} = this.props;
    }

    componentWillUnmount() {
    }

    componentDidMount() {
        this.apiClient = new ApiClient(this.context, this.props);
        this._loadInitialState();
    }

    async _loadInitialState() {
        let {region, information} = this.props;
        const {navigator} = this.context;

        if (information) {
            region = information;
        }

        if (!region) {
            navigator.to('countryChoice');
            return;
        }

        if (region.content && region.content.length === 1) {
            let c = region.content[0];
            navigator.to('infoDetails', null, {section: c.section, sectionTitle: region.pageTitle});
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
        return (
            <ListItem
                onPress={this.onClick.bind(this, rowData.title, rowData.section)}
                text={rowData.title.trim()}
            />
        )
    }

    render() {
        const {theme, direction, language} = this.props;
        const {navigator} = this.context;

        const isLatin = ['en', 'el', 'fr', 'de'].indexOf(language) > -1;
        let s = (scene) => navigator.to(scene);

        return (
            <View style={styles.container}>

                <View style={[
                    componentStyles.searchBarContainer,
                    theme == 'dark' ? componentStyles.searchBarContainerDark : componentStyles.searchBarContainerLight
                ]}
                >
                    <Button
                        color="green"
                        icon="info"
                        text={I18n.t('SERVICE_LIST') }
                        onPress={() => s('services')}
                        style={{ flex: 1, marginRight: 2, marginBottom: 0}}
                        buttonStyle={{height: 33}}
                        textStyle={{top: (isLatin ? -2 : 0), fontSize: 15}}
                    />
                    <Button
                        color="green"
                        icon="map"
                        text={I18n.t('EXPLORE_MAP') }
                        onPress={() => s('map')}
                        style={{ flex: 1, marginLeft: 2, marginBottom: 0}}
                        buttonStyle={{height: 33}}
                        textStyle={{top: (isLatin ? -2 : 0), fontSize: 15}}
                    />
                </View>
                <OfflineView
                    offline={this.state.offline}
                    onRefresh={this.onRefresh.bind(this) }
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


const componentStyles = StyleSheet.create({
    searchBarContainer: {
        padding: 5,
        height: 43,
        flexDirection: 'row'
    },
    searchBarContainerLight: {
        backgroundColor: themes.light.dividerColor
    },
    searchBarContainerDark: {
        backgroundColor: themes.dark.menuBackgroundColor
    }

});

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

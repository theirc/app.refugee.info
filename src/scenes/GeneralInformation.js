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
    RefreshControl,
    Platform,
    Dimensions
} from 'react-native';
import I18n from '../constants/Messages';
import {OfflineView, ListItem, Button, LoadingOverlay} from '../components';
import {connect} from 'react-redux';
import styles, {themes} from '../styles';
import {Regions} from '../data';

var {width, height} = Dimensions.get('window');

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
            lastSync: null,
            loading: false
        };
    }

    componentDidMount() {
        const {region, dispatch} = this.props;
        dispatch({type: 'TOOLBAR_TITLE_CHANGED', payload: region.pageTitle});

        this.regionData = new Regions(this.props);
        this._loadInitialState();
    }

    async _loadInitialState() {
        this.setState({
            loading: true
        });

        let {region, information, country} = this.props;
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
            setTimeout(() => {
                navigator.to('infoDetails', null, {section: c.section, sectionTitle: region.pageTitle});
            }, 100);
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
            region = await this.regionData.getLocation(region.id, null, true);
            await AsyncStorage.setItem('regionCache', JSON.stringify(region));
            await AsyncStorage.setItem('lastGeneralSync', new Date().toISOString());
            this.setState({
                offline: false,
                region: region,
                loading: false
            })
        }
        catch (e) {
            this.setState({
                offline: true,
                loading: false
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
        requestAnimationFrame(() => {
            const {navigator} = this.context;
            if (this.state.searchText) {
                let reg = new RegExp(`(${this.state.searchText})`, 'ig');
                section = (reg) ? section.replace(reg, '<mark>$1</mark>') : section;
            }
            navigator.forward(null, null, {section, sectionTitle: title}, this.state);
        })
    }

    renderRow(rowData) {
        return (
            <ListItem
                icon={rowData.vector_icon}
                onPress={this.onClick.bind(this, rowData.title, rowData.section) }
                text={rowData.title.trim() }
            />
        )
    }

    render() {
        const {theme, direction, language} = this.props;
        const {navigator} = this.context;
        const {loading, refreshing} = this.state;
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
                        icon="md-information-circle"
                        text={I18n.t('SERVICE_LIST').toUpperCase()}
                        onPress={() => requestAnimationFrame(() => s('services'))}
                        buttonStyle={{height: 33, marginRight: 2}}
                        iconStyle={Platform.OS === 'ios' ? {top: 1} : {}}
                    />
                    <Button
                        color="green"
                        icon="fa-map"
                        text={I18n.t('EXPLORE_MAP').toUpperCase()}
                        onPress={() => requestAnimationFrame(() => s('map'))}
                        buttonStyle={{height: 33, marginLeft: 2}}
                        iconStyle={{fontSize: 18}}
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
                            onRefresh={this.onRefresh.bind(this) }
                        />
                    }
                    dataSource={this.state.dataSource}
                    enableEmptySections={true}
                    renderRow={(rowData) => this.renderRow(rowData) }
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
        language: state.language,
        region: state.region,
        country: state.country,
        theme: state.theme,
        direction: state.direction
    };
};


export default connect(mapStateToProps)(GeneralInformation);

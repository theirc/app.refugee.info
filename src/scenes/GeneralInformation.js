import React, {Component, PropTypes} from 'react';
import {
    View,
    StyleSheet,
    ListView,
    RefreshControl,
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
            loading: false
        };
    }

    componentDidMount() {
        const {region, dispatch} = this.props;
        dispatch({type: 'TOOLBAR_TITLE_CHANGED', payload: region.pageTitle || region.name});
        this.context.navigator.currentRoute.title = region.pageTitle;
        this.regionData = new Regions(this.props);
        this._loadInitialState();
    }

    componentWillReceiveProps(nextProps, nextState) {
        let {region, information} = this.props;
        if (information) {
            region = information;
        }
        if (region != nextProps.region) {
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(
                    nextProps.region.content.filter((info) => !info.hide_from_toc)
                ),
            });
        }
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
            setTimeout(() => {
                navigator.to('infoDetails', null, {section: c.section, sectionTitle: region.pageTitle});
            }, 100);
            return;
        }

        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(region.content.filter((info) => !info.hide_from_toc)),
            generalInfo: region.content,
            region: region,
            loaded: true,
            offline: false,
        });
    }

    onRefresh() {
        this.setState({refreshing: true});
        this._loadInitialState().then(() => {
            this.setState({refreshing: false});
        });
    }

    onClick(title, section, slug) {
        requestAnimationFrame(() => {
            const {navigator} = this.context;
            navigator.forward(null, null, {section, sectionTitle: title, slug}, this.state);
        })
    }

    renderRow(rowData) {
        let slug = rowData.slug || rowData.anchor_name || '';
        return (
            <ListItem
                icon={rowData.vector_icon}
                onPress={this.onClick.bind(this, rowData.title, rowData.section, slug)}
                text={rowData.title.trim()}
            />
        )
    }

    render() {
        const {theme, direction, language, region, country} = this.props;
        const {navigator} = this.context;
        const {loading, refreshing} = this.state;
        let s = (scene, props) => navigator.to(scene);

        return (
            <View style={styles.container}>
                <View style={[{
                    paddingHorizontal: 5, paddingVertical: 10, height: 80, flexDirection: 'row',
                    borderBottomWidth: 1, borderBottomColor: themes.light.lighterDividerColor},
                ]}>

                    <Button
                        color="green"
                        icon="fa-list"
                        text={I18n.t('SERVICE_LIST').toUpperCase()}
                        onPress={() => requestAnimationFrame(() => s('services'))}
                        transparent={true}
                    />
                    <Button
                        color="green"
                        icon="md-locate"
                        text={I18n.t('CHANGE_LOCATION').toUpperCase()}
                        onPress={() => requestAnimationFrame(() => navigator.to('cityChoice', null, {country: country}))}
                        transparent={true}
                    />
                    <Button
                        color="green"
                        icon="fa-map"
                        text={I18n.t('EXPLORE_MAP').toUpperCase()}
                        onPress={() => requestAnimationFrame(() => s('map'))}
                        iconStyle={{fontSize: 18}}
                        transparent={true}
                    />
                </View>
                <OfflineView
                    offline={this.state.offline}
                    onRefresh={this.onRefresh.bind(this) }
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

import React, {Component, PropTypes} from 'react';
import {
    View,
    StyleSheet,
    ListView,
    RefreshControl
} from 'react-native';
import I18n from '../constants/Messages';
import {OfflineView, ListItem, Button, DirectionalText} from '../components';
import {connect} from 'react-redux';
import styles, {themes} from '../styles';
import {Regions} from '../data';
import ApiClient from '../utils/ApiClient';
import {updateRegionIntoStorage} from '../actions/region';

export class GeneralInformation extends Component {

    static contextTypes = {
        navigator: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.onRefresh = this.onRefresh.bind(this);
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
        dispatch({type: 'TOOLBAR_TITLE_CHANGED', payload: region.name});
        this.context.navigator.currentRoute.title = region.name;
        this.regionData = new Regions(this.props);
        this.loadInitialState();
    }

    async loadInitialState() {
        const {region} = this.props;
        const {navigator} = this.context;
        if (!region) {
            return navigator.to('countryChoice');
        }

        if (region.content && region.content.length === 1) {
            const content = region.content[0];
            return navigator.to('infoDetails', null, {section: content.html, sectionTitle: content.title});
        }
        region.content.forEach((section) => {
            section.onPress = this.onPress.bind(this, section.title, section.html, section.slug, section.index, section.slug);
        });
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(
                region.content
            ),
            region,
            loaded: true,
            offline: false
        });
    }

    onRefresh() {
        const {region, dispatch} = this.props;
        this.setState({refreshing: true}, () => {
            this.apiClient = new ApiClient(this.context, this.props);
            this.apiClient.getLocation(region.slug, true).then((location) => {
                let hasChanged = region.updated_at != location.updated_at;
                if (hasChanged) {
                    Promise.all([
                        dispatch(updateRegionIntoStorage(location)),
                        dispatch({type: 'REGION_CHANGED', payload: location})
                    ]).then(() => {
                        this.setState({
                            refreshing: false,
                            dataSourceUpdated: true,
                            offline: false
                        });
                    });
                } else {
                    this.setState({
                        refreshing: false,
                        dataSourceUpdated: false,
                        offline: false
                    });
                }
                setTimeout(() => {
                    this.setState({dataSourceUpdated: undefined});
                }, 2500);
            }).catch(() => {
                this.setState({
                    offline: true,
                    refreshing: false
                });
            });
        });
    }

    onPress(title, section, slug, index, contentSlug) {
        requestAnimationFrame(() => {
            const {navigator} = this.context;
            navigator.forward(null, null, {
                section,
                sectionTitle: title,
                slug,
                index,
                contentSlug
            }, this.state);
        });
    }

    renderRow(rowData) {
        return (
            <ListItem
                icon={rowData.icon}
                onPress={rowData.onPress}
                text={rowData.title}
            />
        );
    }

    renderRefreshText(updated) {
        if (updated != undefined) {
            let text = ((updated) ? I18n.t('INFO_WAS_OUTDATED') : I18n.t('INFO_WAS_UP_TO_DATE')).toUpperCase();
            return (
                <View style={componentStyles.refreshTextContainer}>
                    <DirectionalText style={componentStyles.refreshText}>
                        {text}
                    </DirectionalText>
                </View>
            );
        }
    }

    render() {
        const {country} = this.props;
        const {navigator} = this.context;
        let s = (scene) => navigator.to(scene);
        let refreshText = this.renderRefreshText(this.state.dataSourceUpdated);
        return (
            <View style={styles.container}>
                <View style={componentStyles.buttonsContainer}>
                    <Button
                        color="green"
                        icon="fa-list"
                        onPress={() => requestAnimationFrame(() => s('services'))}
                        text={I18n.t('SERVICE_LIST').toUpperCase()}
                        transparent
                    />
                    <Button
                        buttonStyle={{flex: 1.66}}
                        color="green"
                        icon="md-locate"
                        onPress={() => requestAnimationFrame(() => navigator.to('cityChoice', null, {country}))}
                        text={I18n.t('CHANGE_LOCATION').toUpperCase()}
                        transparent
                    />
                    <Button
                        color="green"
                        icon="fa-map"
                        iconStyle={{fontSize: 18}}
                        onPress={() => requestAnimationFrame(() => s('map'))}
                        text={I18n.t('EXPLORE_MAP').toUpperCase()}
                        transparent
                    />
                </View>
                <OfflineView
                    offline={this.state.offline}
                    onRefresh={this.onRefresh}
                />
                { !this.state.offline && refreshText }
                <ListView
                    dataSource={this.state.dataSource}
                    enableEmptySections
                    keyboardDismissMode="on-drag"
                    keyboardShouldPersistTaps
                    refreshControl={
                        <RefreshControl
                            onRefresh={this.onRefresh}
                            refreshing={this.state.refreshing}
                        />
                    }
                    renderRow={(rowData) => this.renderRow(rowData)}
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
    },
    refreshTextContainer: {
        borderBottomColor: themes.light.lighterDividerColor,
        borderBottomWidth: 1
    },
    refreshText: {
        paddingVertical: 10,
        fontSize: 13,
        color: themes.light.greenAccentColor,
        backgroundColor: themes.light.lighterDividerColor,
        textAlign: 'center'
    },
    buttonsContainer: {
        paddingHorizontal: 5,
        paddingVertical: 10,
        height: 70,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: themes.light.lighterDividerColor,
        backgroundColor: themes.light.lighterDividerColor
    }

});

const mapStateToProps = (state) => {
    return {
        language: state.language,
        region: state.region,
        country: state.country
    };
};


export default connect(mapStateToProps)(GeneralInformation);

import React, {Component} from 'react';
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
import ApiClient from '../utils/ApiClient';
import {updateRegionIntoStorage} from '../actions/region';
import {getRegionAllContent} from '../utils/helpers';
import {Actions} from 'react-native-router-flux';


export class GeneralInformation extends Component {

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
        this.loadInitialState();
    }

    async loadInitialState() {
        const {region} = this.props;
        if (!region) {
            return Actions.countryChoice();
        }
        Actions.refresh({title: region.name});
        if (region.content && region.content.length === 1) {
            const content = region.content[0];
            return Actions.infoDetails({section: content.html, sectionTitle: content.title});
        }
        region.content = region.content.filter((content) => {return !content.pop_up});
        region.content.forEach((section) => {
            section.onPress = this.onPress.bind(this, section);
        });
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(region.content),
            region,
            loaded: true,
            offline: false
        });
    }

    onRefresh() {
        const {region, dispatch, language} = this.props;
        this.setState({refreshing: true}, () => {
            this.apiClient = new ApiClient(this.context, this.props);
            this.apiClient.getLocation(region.slug, true, language).then((location) => {
                let hasChanged = region.updated_at != location.updated_at;
                if (hasChanged) {
                    location.allContent = getRegionAllContent(location);
                    location.content = location.content.filter((content) => {return !content.pop_up});
                    location.content.forEach((section) => {
                        section.onPress = this.onPress.bind(this, section);
                    });
                    Promise.all([
                        dispatch(updateRegionIntoStorage(location)),
                        dispatch({type: 'REGION_CHANGED', payload: location})
                    ]).then(() => {
                        this.setState({
                            dataSource: this.state.dataSource.cloneWithRows(location.content),
                            region: location,
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
            }).catch(() => {
                this.setState({
                    offline: true,
                    refreshing: false
                });
            });
        });
    }

    onPress(section) {
        requestAnimationFrame(() => {Actions.infoDetails({section})});
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
        let refreshText = this.renderRefreshText(this.state.dataSourceUpdated);
        return (
            <View style={styles.container}>
                <View style={componentStyles.buttonsContainer}>
                    <Button
                        color="green"
                        icon="fa-list"
                        onPress={Actions.serviceList}
                        text={I18n.t('SERVICE_LIST').toUpperCase()}
                        transparent
                    />
                    <Button
                        buttonStyle={{flex: 1.66}}
                        color="green"
                        icon="md-locate"
                        onPress={() => Actions.cityChoice({country})}
                        text={I18n.t('CHANGE_LOCATION').toUpperCase()}
                        transparent
                    />
                    <Button
                        color="green"
                        icon="fa-map"
                        iconStyle={{fontSize: 18}}
                        onPress={Actions.serviceMap}
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

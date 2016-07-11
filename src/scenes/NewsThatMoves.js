import React, {Component, PropTypes} from 'react';
import {
    View,
    Text,
    AsyncStorage,
    StyleSheet,
    ListView,
    TouchableOpacity,
    TextInput,
    ScrollView,
    RefreshControl,
    Linking,
    Image
} from 'react-native';
import I18n from '../constants/Messages';
import {MapButton, OfflineView, DirectionalText, SearchBar, ListItem, Button} from '../components';
import {connect} from 'react-redux';
import ApiClient from '../utils/ApiClient';
import styles, {getUnderlayColor, themes, generateTextStyles} from '../styles';
import store from '../store';
import {Regions, Services, News} from '../data';

export class NewsThatMoves extends Component {
    state = {
        dataSource: new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        }),
        refreshing: false,
    }

    componentWillMount() {
        this.onRefresh().done()
    }

    async onRefresh() {
        const {region, language} = this.props;
        const {dispatch} = this.props;

        return new News(language).downloadNews().then((n) => {
            let entries = n.feed.entries
            return this.setState({
                dataSource: this.state.dataSource.cloneWithRows(entries),
                refreshing: false
            });
        });
    }

    renderRow(data) {
        const theme = themes[this.props.theme];
        const font = generateTextStyles(this.props.language);
        let textStyles = {
            flexDirection: this.props.direction == 'rtl' ? 'row-reverse' : 'row',
            textAlign: this.props.direction == 'rtl' ? 'right' : 'auto',
            backgroundColor: theme.backgroundColor,
            color: theme.textColor,
        };

        return <View style={{
            paddingLeft: 5,
            paddingRight: 5,
        }}>
            <TouchableOpacity
                onPress={() => Linking.openURL(data.link) }
                style={[localStyles.article, { borderBottomColor: theme.dividerColor, }]}>
                <View>
                    <Text style={[textStyles, font, { paddingBottom: 5, fontSize: 16, fontWeight: 'bold' }]}>{data.title}</Text>
                    <Text style={[textStyles, font, { paddingBottom: 10, }]}>{data.contentSnippet}</Text>
                </View>
            </TouchableOpacity>
        </View>;
    }

    render() {
        if (!this.state.dataSource) {
            return <View />;
        }

        return <View style={styles.container}>
            <View style={{ paddingVertical: 10, marginBottom: 5, backgroundColor: '#FFFFFF' }}>
                <Image source={{ uri: 'https://newsthatmoves.org/wp-content/uploads/2016/02/LOGO.png' }}
                    style={{ height: 70, resizeMode: 'contain', }}/>
            </View>
            <ListView
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this.onRefresh.bind(this) }
                        />
                }
                dataSource={this.state.dataSource}
                enableEmptySections
                renderRow={(rowData) => this.renderRow(rowData) }
                keyboardShouldPersistTaps={true}
                keyboardDismissMode="on-drag"
                />
        </View>
    }
}

const localStyles = StyleSheet.create({
    article: {
        paddingLeft: 5,
        paddingRight: 5,
        borderBottomWidth: 1,
        marginBottom: 10,
        flex: 1,
        flexDirection: 'column'
    }
})

const mapStateToProps = (state) => {
    return {
        primary: state.theme.primary,
        language: state.language,
        region: state.region,
        country: state.country,
        theme: state.theme,
        direction: state.direction
    };
};


export default connect(mapStateToProps)(NewsThatMoves);

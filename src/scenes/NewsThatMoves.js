import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    ListView,
    TouchableOpacity,
    RefreshControl,
    Linking,
    Image
} from 'react-native';
import {OfflineView, DirectionalText} from '../components';
import {connect} from 'react-redux';
import styles, {themes, getFontFamily} from '../styles';
import {News} from '../data';

export class NewsThatMoves extends Component {
    static smallHeader = true;


    constructor(props) {
        super(props);
        this.state = {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2
            }),
            refreshing: false
        };
        this.onRefresh = this.onRefresh.bind(this);
    }

    componentWillMount() {
        this.onRefresh().done();
    }

    async onRefresh() {
        const {language} = this.props;
        return new News(language).downloadNews().then((n) => {
            let entries = n.feed.entries;
            return this.setState({
                dataSource: this.state.dataSource.cloneWithRows(entries),
                refreshing: false,
                offline: false
            });
        }).catch(() => this.setState({offline: true}));
    }

    renderRow(data) {
        const font = getFontFamily(this.props.language);
        let textStyles = {
            flexDirection: 'row',
            textAlign: 'auto',
            backgroundColor: themes.light.backgroundColor,
            color: themes.light.textColor
        };

        return (
            <View style={{paddingHorizontal: 5}}>
                <TouchableOpacity
                    onPress={() => Linking.openURL(data.link)}
                    style={[localStyles.article, {borderBottomColor: themes.light.dividerColor}]}
                >
                    <View>
                        <DirectionalText style={[textStyles, font, {paddingBottom: 5, fontSize: 16, fontWeight: 'bold'}]}>
                            {data.title}
                        </DirectionalText>
                        <DirectionalText style={[textStyles, font, {paddingBottom: 10}]}>
                            {data.contentSnippet}
                        </DirectionalText>
                    </View>
                </TouchableOpacity>
            </View>);
    }

    render() {
        if (this.state.offline) {
            return (
                <OfflineView
                    offline={this.state.offline}
                    onRefresh={this.onRefresh}
                />
            );
        }
        if (!this.state.dataSource) {
            return <View />;
        }

        return (
            <View style={styles.container}>
                <View style={{paddingVertical: 10, marginBottom: 5, backgroundColor: '#FFFFFF'}}>
                    <Image
                        source={{uri: 'https://newsthatmoves.org/wp-content/uploads/2016/02/LOGO.png'}}
                        style={{height: 70, resizeMode: 'contain'}}
                    />
                </View>
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

const localStyles = StyleSheet.create({
    article: {
        paddingLeft: 5,
        paddingRight: 5,
        borderBottomWidth: 1,
        marginBottom: 10,
        flex: 1,
        flexDirection: 'column'
    }
});

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

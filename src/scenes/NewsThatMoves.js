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
import styles, {themes} from '../styles';
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
        return (
            <View style={{paddingHorizontal: 5}}>
                <TouchableOpacity
                    onPress={() => Linking.openURL(data.link)}
                    style={[componentStyles.article, {borderBottomColor: themes.light.dividerColor}]}
                >
                    <View>
                        <DirectionalText style={componentStyles.title}>
                            {data.title}
                        </DirectionalText>
                        <DirectionalText style={componentStyles.contentSnippet}>
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
                <View style={componentStyles.logoContainer}>
                    <Image
                        source={{uri: 'https://newsthatmoves.org/wp-content/uploads/2016/02/LOGO.png'}}
                        style={componentStyles.logo}
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

const componentStyles = StyleSheet.create({
    logoContainer: {
        paddingVertical: 10,
        marginBottom: 5,
        backgroundColor: themes.light.backgroundColor
    },
    logo: {
        height: 70,
        resizeMode: 'contain'
    },
    title: {
        paddingBottom: 5,
        fontSize: 16,
        fontWeight: 'bold'
    },
    contentSnippet: {
        paddingBottom: 10
    },
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
        language: state.language,
        region: state.region,
        country: state.country
    };
};


export default connect(mapStateToProps)(NewsThatMoves);

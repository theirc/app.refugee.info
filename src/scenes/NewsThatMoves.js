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
import {OfflineView, DirectionalText, LoadingOverlay} from '../components';
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
            loading: true,
            refreshing: false
        };
        this.onRefresh = this.onRefresh.bind(this);
    }

    componentDidMount() {
        this.onRefresh().done();
    }

    async onRefresh() {
        const {language} = this.props;
        return new News(language).downloadNews().then((n) => {
            let entries = n.items;
            entries.forEach((entry) => {
                entry.contentSnippet = entry.description.split('<span')[0];
            });
            return this.setState({
                dataSource: this.state.dataSource.cloneWithRows(entries),
                refreshing: false,
                offline: false,
                loading: false
            });
        }).catch(() => this.setState({offline: true}));
    }

    renderRow(data) {
        return (
            <View style={{paddingHorizontal: 5, flexGrow: 1}}>
                <TouchableOpacity
                    onPress={() => Linking.openURL(data.link)}
                    style={componentStyles.article}
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

    renderContent() {
        if (this.state.offline) {
            return (
                <OfflineView
                    offline={this.state.offline}
                    onRefresh={this.onRefresh}
                />
            );
        }
        return (
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
        );
    }

    render() {
        if (this.state.loading) {
            return <LoadingOverlay />;
        }
        const content = this.renderContent();
        return (
            <View style={styles.container}>
                <View style={componentStyles.logoContainer}>
                    <Image
                        source={require('../assets/logo-news.png')}
                        style={componentStyles.logo}
                    />
                </View>
                {content}
            </View>
        );
    }
}

const componentStyles = StyleSheet.create({
    logoContainer: {
        backgroundColor: themes.light.backgroundColor,
        alignItems: 'center',
        paddingVertical: 10
    },
    logo: {
        height: 100,
        width: 187,
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
        flexDirection: 'column',
        borderBottomColor: themes.light.dividerColor
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

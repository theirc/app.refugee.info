import React, {Component, PropTypes} from 'react';
import {View, Linking, Platform, WebView, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import {wrapHtmlContent} from '../utils/htmlUtils';
import styles from '../styles';
import {connect} from 'react-redux';
import {Icon, DirectionalText} from '../components';
import {getAllUrlParams} from '../utils/helpers';
import I18n from '../constants/Messages';
import Share from 'react-native-share';
import {WEB_PATH} from '../constants';
import ApiClient from '../utils/ApiClient';
import {Actions} from 'react-native-router-flux';
import {GA_TRACKER} from '../constants';
import {getRegionAllContent} from '../utils/helpers';
import {updateRegionIntoStorage} from '../actions';
import {themes} from '../styles';


export class GeneralInformationDetails extends Component {
    static backButton = true;

    static propTypes = {
        dispatch: PropTypes.func,
        language: PropTypes.string,
        region: PropTypes.object,
        section: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.webView = null;
        this.apiClient = new ApiClient(this.context, props);
        this.state = {
            loading: true,
            source: false,
            navigating: false
        };
    }

    componentWillMount() {
        this.loadInitialState();
    }

    loadInitialState() {
        const {section, language, region} = this.props;
        GA_TRACKER.trackEvent('info-page-view', section.slug);

        if (section.important) {
            Actions.refresh({title: section.title});
        } else {
            Actions.refresh({title: region.name});
        }
        let source = {
            html: wrapHtmlContent(
                section.html,
                language,
                section.title,
                'light',
                Platform.OS
            )
        };
        this.setState({source, loading: false});
    }

    getSectionBySlug(slug) {
        const {region} = this.props;
        const sections = region.allContent.filter((content) => content.slug == slug);
        return sections[0];
    }

    /* open links to other sections in the app */
    handleInternalLinking(url) {
        if (!url) {
            return;
        }
        if (Platform.OS === 'ios') {
            if (url.indexOf('%23') > -1) {
                let slug = url.split('%23')[1];
                let section = this.getSectionBySlug(slug);
                if (section) {
                    Actions.infoDetails({section});
                    return true;
                }
            } else if (url.indexOf('/') > -1 && url.split('/').length >= 2) {
                let slug = url.split('/')[url.split('/').length - 2];
                let section = this.getSectionBySlug(slug);
                if (section) {
                    Actions.infoDetails({section});
                    return true;
                }
            }
        }
        if (Platform.OS === 'android' && !this.state.navigating) {
            let section = this.getSectionBySlug(url);
            if (section) {
                this.setState({navigating: false});
                Actions.infoDetails({section});
                return true;
            }
        }
    }

    /* open links like phone, email or external http in dedicated app */
    handleExternalLinking(url) {
        if (Platform.OS === 'android') {
            if (!this.state.navigating) {
                Linking.openURL(url);
            }
            this.setState({navigating: true});
        } else {
            this.webView.goBack();
            if (url.indexOf('tel') == 0) {
                // handle phone number
            } else if (url.indexOf('mailto') == 0) {
                //handle mailto
            } else {
                this.setState({navigating: true});
                Linking.openURL(url);
            }
        }
    }

    /* open links to service list with active filters in the app */
    handleServiceLinking(url) {
        if (url.indexOf('services') > -1 || url.split('/')[1] == 'services') {
            let urlParams = getAllUrlParams(url);
            this.setState({navigating: true});
            return Actions.service({
                list: true,
                searchCriteria: urlParams.query,
                serviceTypeIds: urlParams.type && urlParams.type.constructor === Array
                    ? urlParams.type.map((el) => parseInt(el))
                    : [parseInt(urlParams.type)]
            });
        }
    }

    /* open links to another location to change app region */
    handleLocationLinking(url) {
        if (!url) {
            return;
        }
        url = url.replace(/\//g, '').replace(/,/g, '');
        return this.apiClient.getLocation(url, true).then((location) => {
            if (location.slug) {
                return Alert.alert(
                    I18n.t('CHANGE_LOCATION'),
                    I18n.t('LOCATION_WILL_CHANGE').replace('{0}', location.name), [
                        {text: I18n.t('NO'), onPress: () => {}},
                        {text: I18n.t('YES'), onPress: () => this.changeRegion(location)}
                    ]
                );
            }
        }).catch(() => {
        });
    }

    changeRegion(region) {
        const {dispatch} = this.props;
        region.allContent = getRegionAllContent(region);
        this.setState({region});

        requestAnimationFrame(() => {
            Promise.all([
                dispatch(updateRegionIntoStorage(region)),
                dispatch({type: 'REGION_CHANGED', payload: region})
            ]);
            if (region.content && region.content.length == 1) {
                return Actions.infoDetails({
                    section: region.content[0].html,
                    sectionTitle: region.title
                });
            }
            return Actions.info();
        });
    }

    isJellyBean() {
        return ([16, 17, 18].indexOf(Platform.Version) > -1);
    }

    /* Image are loaded using this method. So this narrows down to prevent all clicks. */
    checkNavigationType(state) {
        if (state.navigationType && state.navigationType === 'click') {
            this.webView.stopLoading();
        }
    }

    onNavigationStateChangeIOS(state) {
        let url = state.url;
        if (url === 'about:blank') return;
        if (!this.handleInternalLinking(url)) {
            this.handleLocationLinking(url);
            if (this.webView) {
                this.checkNavigationType(state);
                if (url.indexOf('/') == 0) {
                    this.handleServiceLinking(url);
                } else {
                    this.handleExternalLinking(url);
                }
            }
        }
    }

    onNavigationStateChangeAndroid(state) {
        /* Warning: various Android versions behave differently, so make sure to test everything when making changes */
        let url = state.url;

        if (!this.state.navigating || this.isJellyBean()) {
            if (url.indexOf('data:') == 0) {
                if (url.endsWith('</html>')) {
                    return;
                }
                let temp = url.split('#');
                if (!temp || temp.length > 2) {
                    let slug = temp[2];
                    this.handleServiceLinking(slug);
                    slug = slug.split('/')[2];
                    this.handleInternalLinking(slug);
                }
                let slug = temp[temp.length - 1];
                if (!this.handleInternalLinking(slug)) {
                    let location = String(temp).split('"');
                    return this.handleLocationLinking(location[location.length - 1]);
                } else {
                    this.setState({
                        navigating: false
                    });
                    return;
                }
            }
        } else {
            if (url === 'about:blank' || url.indexOf('data:') == 0) {
                this.setState({navigating: false});
            }
            this.webView.goBack();
        }
        this.handleExternalLinking(url);
    }

    _onNavigationStateChange(state) {
        if (Platform.OS == 'ios') {
            return this.onNavigationStateChangeIOS(state);
        }
        return this.onNavigationStateChangeAndroid(state);
    }

    onSharePress() {
        const {section, region} = this.props;
        Share.open({
            message: `${I18n.t('REFUGEE_INFO')} ${section.title || ''}`,
            url: `${WEB_PATH}/${region.slug}/${section.slug}`
        }).catch(() => {
        });
    }

    formatDateTime(datetime) {
        const date = new Date(datetime);
        return date.toLocaleString().replace(',', '');
    }

    renderFeedbackBar() {
        const {section} = this.props;

        let lastUpdated = <View style={componentStyles.updateTextContainer}>
                    <DirectionalText style={componentStyles.updateText}>
                        {I18n.t('LAST_UPDATED_ON')}:
                    </DirectionalText><DirectionalText style={componentStyles.updateText}>
                        {this.formatDateTime(section.updated_at)}
                    </DirectionalText>
                </View>;
        return (
            <View style={componentStyles.bottomBar}>
                <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => this.onSharePress()}
                    style={componentStyles.shareButton}
                >
                    <Icon
                        name="fa-share"
                        style={componentStyles.shareIcon}
                    />
                    <DirectionalText style={componentStyles.shareText}>
                        {I18n.t('SHARE')}
                    </DirectionalText>
                </TouchableOpacity>
                    {!section.hide_last_updated && lastUpdated}
            </View>
        );
    }

    render() {
        const {loading} = this.state;
        if (loading) {
            return <View />;
        }
        const feedbackBar = this.renderFeedbackBar();
        return (
            <View style={styles.container}>
                <View style={{flex: 1}}>
                    {this.state.source &&
                    <WebView
                        onNavigationStateChange={(s) => this._onNavigationStateChange(s)}
                        ref={(v) => this.webView = v}
                        source={this.state.source}
                    />}
                </View>
                {feedbackBar}
            </View>
        );
    }
}

const componentStyles = StyleSheet.create({
    bottomBar: {
        height: 48,
        flexDirection: 'row',
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: themes.light.toolbarColor
    },
    shareButton: {
        height: 48,
        flexDirection: 'row',
        alignItems: 'center'
    },
    shareText: {
        fontSize: 16,
        color: themes.light.textColor
    },
    shareIcon: {
        color: themes.light.textColor,
        paddingLeft: 10,
        paddingRight: 10,
        fontSize: 24
    },
    updateTextContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-end'
    },
    updateText: {
        fontSize: 14,
        color: themes.light.textColor
    }
});

const mapStateToProps = (state) => {
    return {
        language: state.language,
        region: state.region,
        routes: state.routes
    };
};

export default connect(mapStateToProps)(GeneralInformationDetails);

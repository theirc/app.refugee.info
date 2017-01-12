import React, {Component, PropTypes} from 'react';
import {View, Linking, Platform, WebView, TouchableOpacity, AsyncStorage} from 'react-native';
import {wrapHtmlContent} from '../utils/htmlUtils';
import styles from '../styles';
import {connect} from 'react-redux';
import {MapButton, Icon, DirectionalText} from '../components';
import {getAllUrlParams} from '../utils/helpers';
import I18n from '../constants/Messages';
import Share from 'react-native-share';
import {WEB_PATH} from '../constants';
import ApiClient from '../utils/ApiClient';


export class GeneralInformationDetails extends Component {

    static propTypes = {
        dispatch: PropTypes.func,
        language: PropTypes.string,
        region: PropTypes.object,
        section: PropTypes.object.isRequired
    };

    static contextTypes = {
        navigator: React.PropTypes.object.isRequired
    };


    constructor(props) {
        super(props);
        this.webView = null;
        this.apiClient = new ApiClient(this.context, props);
        this.state = {
            loading: false,
            source: false,
            navigating: false
        };
    }

    componentWillMount() {
        this._loadInitialState();
    }

    _loadInitialState() {
        const {dispatch, section, language, region} = this.props;
        if (section.important) {
            dispatch({type: 'TOOLBAR_TITLE_CHANGED', payload: section.title});
            this.context.navigator.currentRoute.title = section.title;
        } else {
            dispatch({type: 'TOOLBAR_TITLE_CHANGED', payload: region.name});
            this.context.navigator.currentRoute.title = region.name;
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
        this.setState({source});
        this.apiClient.getRating(section.slug).then((response) => {
            this.setState({
                thumbsUp: response.thumbs_up,
                thumbsDown: response.thumbs_down
            });
        });

    }

    getSectionBySlug(slug) {
        const {region} = this.props;
        const sections = region.allContent.filter((content) => content.slug == slug);
        return sections[0];
    }

    /* open links to other sections in the app */
    handleInternalLinking(url) {
        if (url.indexOf('%23') > -1 && Platform.OS === 'ios') {
            let slug = url.split('%23')[1];
            let section = this.getSectionBySlug(slug);
            if (section) {
                this.context.navigator.to('info.details', null, {section});
                return true;
            }
        }
        if (Platform.OS === 'android') {
            let section = this.getSectionBySlug(url);
            if (section) {
                this.setState({navigating: true});
                this.context.navigator.to('info.details', null, {section});
                return true;
            }
        }
    }

    /* open links like phone, email or external http in dedicated app */
    handleExternalLinking(url) {
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

    /* open links to service list with active filters in the app */
    handleServiceLinking(url) {
        if (url.indexOf('services') > -1 || url.split('/')[1] == 'services') {
            let urlParams = getAllUrlParams(url);
            this.setState({navigating: true});
            return this.context.navigator.to('services', null, {
                searchCriteria: urlParams.query,
                serviceTypeIds: urlParams.type && urlParams.type.constructor === Array
                    ? urlParams.type.map((el) => parseInt(el))
                    : [parseInt(urlParams.type)]
            });
        }
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
                this.handleInternalLinking(slug);
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
        });
    }

    rate(rating) {
        const {section} = this.props;

        const ratingStored = `rating-${section.slug}`;
        AsyncStorage.getItem(ratingStored, (error, result) => {
            if (!result) {
                this.apiClient.setRating(section.slug, rating).then((res) => {
                    let response = JSON.parse(res._bodyText);
                    this.setState({
                        thumbsUp: response.thumbs_up,
                        thumbsDown: response.thumbs_down
                    });
                    AsyncStorage.setItem(ratingStored, JSON.stringify(response.rating_id));
                });
            } else {
                this.apiClient.setRating(section.slug, rating, 'other', result).then((res) => {
                    let response = JSON.parse(res._bodyText);
                    this.setState({
                        thumbsUp: response.thumbs_up,
                        thumbsDown: response.thumbs_down
                    });
                    AsyncStorage.setItem(ratingStored, JSON.stringify(response.rating_id));
                });
            }
        });

    }

    renderFeedbackBar() {
        const {thumbsUp, thumbsDown} = this.state;
        return (
            <View style={styles.feedbackRow}>
                <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => this.onSharePress()}
                    style={styles.feedbackRowFacebookContainer}
                >
                    <Icon
                        name="fa-share"
                        style={styles.feedbackRowIcon}
                    />
                    <DirectionalText style={styles.feedbackRowShare}>
                        {I18n.t('SHARE')}
                    </DirectionalText>
                </TouchableOpacity>

                {thumbsUp != undefined &&
                <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => this.rate(1)}
                    style={styles.feedbackRowIconContainer}
                >
                    <Icon
                        name="fa-thumbs-up"
                        style={styles.feedbackRowIcon}
                    />
                    <DirectionalText style={{width: 30}}>
                        {thumbsUp}
                    </DirectionalText>
                </TouchableOpacity>}

                {thumbsDown != undefined &&
                <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => this.rate(-1)}
                    style={styles.feedbackRowIconContainer}
                >
                    <Icon
                        name="fa-thumbs-down"
                        style={styles.feedbackRowIcon}
                    />
                    <DirectionalText style={{width: 30}}>
                        {thumbsDown}
                    </DirectionalText>
                </TouchableOpacity>}
            </View>
        );
    }

    render() {
        const feedbackBar = this.renderFeedbackBar();

        return (
            <View style={styles.container}>
                <View style={styles.container}>
                    {this.state.source &&
                    <WebView
                        onNavigationStateChange={(s) => this._onNavigationStateChange(s)}
                        ref={(v) => this.webView = v}
                        source={this.state.source}
                    />}
                    <MapButton />
                </View>
                {feedbackBar}
            </View>
        );
    }
}


const mapStateToProps = (state) => {
    return {
        language: state.language,
        region: state.region
    };
};

export default connect(mapStateToProps)(GeneralInformationDetails);

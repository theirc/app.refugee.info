import React, {Component, PropTypes} from 'react';
import {View, Linking, Platform, WebView, TouchableOpacity, AsyncStorage} from 'react-native';
import {wrapHtmlContent} from '../utils/htmlUtils';
import styles from '../styles';
import {connect} from 'react-redux';
import {MapButton, Icon, DirectionalText} from '../components';
import {Regions} from '../data';
import {RNMail as Mailer} from 'NativeModules';
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
        this.client = new ApiClient(this.context, props);
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
        } else {
            dispatch({type: 'TOOLBAR_TITLE_CHANGED', payload: region.name});
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

        this.setState({
            source,
            thumbsUp: section.thumbs_up,
            thumbsDown: section.thumbs_down
        });
    }

    _onNavigationStateChange(state) {
        let url = state.url;
        if (!this.state.navigating || (Platform.Version >= 16 && Platform.Version <= 18)) {
            if (url === 'about:blank' && Platform.OS === 'ios') {
                return;
            }
            if (url.indexOf('data:') == 0) {
                if (Platform.OS === 'android') {
                    //hacky way to get link path
                    let suffix = '</html>';
                    if (url.indexOf(suffix, url.length - suffix.length) !== -1) {
                        // if it ends with html, it's not a anchor link but wrappedHtml
                        return;
                    }
                    let temp = url.split('#');
                    if (!temp || temp.length > 2) {
                        // check if it's info/slug link
                        let infoUrl = temp[2];
                        if (infoUrl.split('/')[1] == 'services') {
                            // check if it's service filter link
                            let urlParams = getAllUrlParams(infoUrl);
                            this.setState({navigating: true});
                            return this.context.navigator.to('services', null, {
                                searchCriteria: urlParams.query,
                                serviceTypeIds: urlParams.type && urlParams.type.constructor === Array
                                    ? urlParams.type.map((el) => parseInt(el))
                                    : [parseInt(urlParams.type)]
                            });
                        }
                        let fullSlug = infoUrl.split('/')[2];
                        if (fullSlug && !fullSlug.includes('"')) {
                            let info = Regions.searchImportantInformation(this.props.region, fullSlug);
                            if (info) {
                                this.setState({navigating: true});
                                let payload = {
                                    title: '',
                                    section: info.content[0].section,
                                    slug: info.slug,
                                    index: info.index,
                                    content_slug: info.slug
                                };
                                return this.context.navigator.to('info.details', null, payload);
                            }
                        }
                        return;
                    }
                    let fullSlug = temp[temp.length - 1];
                    if (fullSlug && !fullSlug.includes('"')) {
                        let info = Regions.searchImportantInformation(this.props.region, fullSlug);
                        if (info) {
                            this.setState({navigating: true});
                            let payload = {
                                title: '',
                                section: info.content[0].section,
                                slug: info.slug,
                                index: info.index,
                                content_slug: info.slug
                            };
                            return this.context.navigator.to('info.details', null, payload);
                        }
                        info = Regions.searchGeneralInformation(this.props.region, fullSlug);
                        if (info) {
                            this.setState({navigating: true});
                            let payload = {
                                title: '',
                                section: info.section,
                                slug: info.anchor_name,
                                index: info.index
                            };
                            return this.context.navigator.to('info.details', null, payload);
                        }
                    }
                }
                return;
            }
            if (url.indexOf('refugeeinfo') > -1 || url.indexOf('refugee.info') > -1) {
                url = url.substr(url.indexOf('://') + 3);
                url = url.substr(url.indexOf('/'));
            }
            if (this.webView) {
                if (state.navigationType && state.navigationType === 'click') {
                    // Image are loaded using this method. So this narrows down to prevent all clicks.
                    this.webView.stopLoading();
                }
                // check if it's anchor link with #
                if (url.indexOf('%23') > -1 && Platform.OS === 'ios') {
                    let fullSlug = url.split('%23')[1];
                    let info = Regions.searchGeneralInformation(this.props.region, fullSlug);
                    if (info) {
                        let payload = {
                            title: '',
                            section: info.section,
                            slug: info.anchor_name,
                            index: info.index
                        };
                        return this.context.navigator.to('info.details', null, payload);
                    }
                }

                if (url.indexOf('/') == 0) {
                    // If we get to this point, we need to point to the app

                    // check if it's a internal link to service filter
                    if (url.indexOf('services') > -1) {
                        let urlParams = getAllUrlParams(url);
                        this.setState({navigating: true});
                        return this.context.navigator.to('services', null, {
                            searchCriteria: urlParams.query,
                            serviceTypeIds: urlParams.type && urlParams.type.constructor === Array
                                ? urlParams.type.map((el) => parseInt(el))
                                : [parseInt(urlParams.type)]
                        });
                    }

                    // check if it's anchor link or important info link
                    let slugs = [url.substr(1).split('/')[0], url.substr(1).split('/')[2]];
                    slugs.forEach((fullSlug) => {
                        let info = Regions.searchImportantInformation(this.props.region, fullSlug);
                        if (info) {
                            let payload = {
                                title: '',
                                section: info.content[0].section,
                                slug: info.slug,
                                index: info.index,
                                content_slug: info.slug
                            };
                            return this.context.navigator.to('info.details', null, payload);
                        }
                    });

                } else {
                    this.webView.goBack();
                    if (state.url.indexOf('tel') == 0) {
                        /* Gotta test this */
                    } else if (state.url.indexOf('mailto') == 0 && Platform.OS == 'android') {
                        let email = state.url.split('mailto:')[1];
                        Mailer.mail({
                            recipients: [email]
                        }, () => {
                        });
                    } else {
                        this.setState({navigating: true});
                        Linking.openURL(state.url);
                    }
                }
            }
        } else {
            if (Platform.OS === 'android' && (url === 'about:blank' || url.indexOf('data:') == 0)) {
                this.setState({navigating: false});
            }
            this.webView.goBack();
        }
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
                this.client.setRating(section.slug, rating).then((res) => {
                    let response = JSON.parse(res._bodyText);
                    this.setState({
                        thumbsUp: response.thumbs_up,
                        thumbsDown: response.thumbs_down
                    });
                    AsyncStorage.setItem(ratingStored, JSON.stringify(response.rating_id));
                });
            } else {
                this.client.setRating(section.slug, rating, 'other', result).then((res) => {
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
                </TouchableOpacity>

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
                </TouchableOpacity>
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

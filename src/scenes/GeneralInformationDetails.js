import React, {Component} from 'react';
import {View, Linking, Platform, WebView} from 'react-native';
import {wrapHtmlContent} from '../utils/htmlUtils'
import styles, {themes} from '../styles';
import {connect} from 'react-redux';
import {MapButton} from '../components';
import {Regions} from '../data';
import {RNMail as Mailer} from 'NativeModules';
import {getAllUrlParams} from "../utils/helpers";

export class GeneralInformationDetails extends Component {

    static propTypes = {
        title: React.PropTypes.string.isRequired,
        section: React.PropTypes.string.isRequired
    };

    static contextTypes = {
        navigator: React.PropTypes.object.isRequired
    };


    constructor(props) {
        super(props);
        this.webView = null;

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
        const {section, sectionTitle, language, theme, showTitle, dispatch, region} = this.props;
        if (showTitle) {
            dispatch({type: 'TOOLBAR_TITLE_CHANGED', payload: sectionTitle});
        } else {
            dispatch({type: 'TOOLBAR_TITLE_CHANGED', payload: region.pageTitle});

        }
        let source = {
            html: wrapHtmlContent(section, language, (!showTitle && !(region.content.length == 1)) ? sectionTitle : null, theme)
        };

        this.setState({
            source: source
        });
    }

    _onNavigationStateChange(state) {
        if (!this.state.navigating) {
            let url = state.url;
            if (url === 'about:blank' || url.indexOf('data:') == 0) {
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
                        this.setState({navigating: true});
                        let payload = {title: '', section: info.section};
                        return this.context.navigator.to('info.details', null, payload)
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

                    let fullSlug = url.substr(1).split('/')[0];

                    if (Platform.OS == 'android') {
                        this.webView.goBack();
                    }
                    let info = Regions.searchImportantInformation(this.props.region, fullSlug);
                    if (info) {
                        let payload = {title: '', section: info.content[0].section};
                        return this.context.navigator.to('info.details', null, payload)
                    }

                } else {
                    this.webView.goBack();
                    if (state.url.indexOf('tel') == 0) {
                        /* Gotta test this */
                    } else if (state.url.indexOf('mailto') == 0 && Platform.OS == 'android') {
                        let email = state.url.split('mailto:')[1];
                        Mailer.mail({
                            recipients: [email],
                        }, (error, event) => {
                        });
                    } else {
                        this.setState({navigating: true});
                        Linking.openURL(state.url);
                    }
                }
            }
        } else {
            this.webView.goBack();
        }
    }

    render() {
        return (
            <View style={styles.container}>
                {this.state.source &&
                <WebView
                    ref={(v) => this.webView = v}
                    onNavigationStateChange={(s) => this._onNavigationStateChange(s) }
                    domStorageEnabled={true}
                    source={this.state.source}
                />
                }
                <MapButton
                    direction={this.props.direction}
                />
            </View>
        );
    }
}


const mapStateToProps = (state) => {
    return {
        primary: state.theme.primary,
        language: state.language,
        theme: state.theme,
        direction: state.direction,
        region: state.region
    };
};

export default connect(mapStateToProps)(GeneralInformationDetails);

import React, {Component, PropTypes} from 'react';
import {AsyncStorage, Image, StyleSheet, View, ScrollView, Text, Dimensions, TextInput} from 'react-native';
import {connect} from 'react-redux';
import I18n from '../constants/Messages';
import styles, {getFontFamily, getBorderColor, getTextAlign, getTextColor} from '../styles';
import {Button} from '../components';
import ApiClient from '../utils/ApiClient';


class Contact extends Component {

    static contextTypes = {
        navigator: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            isFormDirty: false
        };
    }

    componentDidMount() {
        this.apiClient = new ApiClient(this.context, this.props);
    }

    _isNameInvalid() {
        return this.state.isFormDirty && !this.state.name;
    }

    _isSubjectInvalid() {
        return this.state.isFormDirty && !this.state.subject;
    }

    _isMessageInvalid() {
        return this.state.isFormDirty && !this.state.message;
    }

    _isEmailInvalid() {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return this.state.isFormDirty && !re.test(this.state.email);
    }

    onSubmitClick() {
        this.setState({isFormDirty: true}, function () {
            if (!this._isNameInvalid() && !this._isSubjectInvalid() && !this._isMessageInvalid() && !this._isEmailInvalid()) {
                console.log("Mail has been sent!");
                // this.apiClient.sendEmail(this.state.name, this.state.subject, this.state.email, this.state.message)
            }
        });
    }

    render() {
        const {theme, direction, language} = this.props;

        return (
            <ScrollView style={styles.detailsContainer}>
                <Text style={[
                    styles.sectionContent,
                    getTextColor(theme),
                    getFontFamily(language)
                ]}>
                    {I18n.t('NAME')}
                </Text>
                <View style={[
                    styles.contactBorder,
                    getBorderColor(theme)
                ]}>
                    <TextInput
                        onChangeText={
                            (text) => this.setState({name: text})
                        }
                        value={this.state.name}
                        style={[
                            styles.textInputModal,
                            getTextColor(theme),
                            getTextAlign(direction),
                            getFontFamily(language)
                        ]}
                        underlineColorAndroid='transparent'
                        autoCorrect={false}
                    />
                </View>
                {this._isNameInvalid() &&
                <Text style={[
                        styles.validationText,
                        getFontFamily(language)
                    ]}>
                    {I18n.t('FIELD_REQUIRED')}
                </Text>
                }
                <Text style={[
                    styles.sectionContent,
                    getTextColor(theme),
                    getFontFamily(language)
                ]}>
                    {I18n.t('EMAIL')}
                </Text>
                <View style={[
                    styles.contactBorder,
                    getBorderColor(theme)
                ]}>
                    <TextInput
                        onChangeText={
                            (text) => this.setState({email: text})
                        }
                        value={this.state.email}
                        style={[
                            styles.textInputModal,
                            getTextColor(theme),
                            getTextAlign(direction),
                            getFontFamily(language)
                        ]}
                        underlineColorAndroid='transparent'
                        autoCorrect={false}
                        autoCapitalize="none"
                    />
                </View>
                {this._isEmailInvalid() &&
                <Text style={[
                        styles.validationText,
                        getFontFamily(language)
                    ]}>
                    {I18n.t('FIELD_REQUIRED')}
                </Text>
                }
                <Text style={[
                    styles.sectionContent,
                    getTextColor(theme),
                    getFontFamily(language)
                ]}>
                    {I18n.t('SUBJECT')}
                </Text>
                <View style={[
                    styles.contactBorder,
                    getBorderColor(theme)
                ]}>
                    <TextInput
                        onChangeText={
                            (text) => this.setState({subject: text})
                        }
                        value={this.state.subject}
                        style={[
                            styles.textInputModal,
                            getTextColor(theme),
                            getTextAlign(direction),
                            getFontFamily(language)
                        ]}
                        underlineColorAndroid='transparent'
                    />
                </View>
                {this._isSubjectInvalid() &&
                <Text style={[
                        styles.validationText,
                        getFontFamily(language)
                    ]}>
                    {I18n.t('FIELD_REQUIRED')}
                </Text>
                }
                <Text style={[
                    styles.sectionContent,
                    getTextColor(theme),
                    getFontFamily(language)
                ]}>
                    {I18n.t('MESSAGE')}
                </Text>
                <View style={[
                    styles.contactBorder,
                    theme=='dark' ? styles.borderDark : styles.borderLight
                ]}>
                    <TextInput
                        multiline
                        onChangeText={
                            (text) => this.setState({message: text})
                        }
                        value={this.state.message}
                        style={[
                            styles.textInputMultiline,
                            getTextColor(theme),
                            getTextAlign(direction),
                            getFontFamily(language)
                        ]}
                        underlineColorAndroid='transparent'
                    />
                </View>
                {this._isMessageInvalid() &&
                <Text style={[
                        styles.validationText,
                        getFontFamily(language)
                    ]}>
                    {I18n.t('FIELD_REQUIRED')}
                </Text>
                }
                <Button
                    color="green"
                    text={I18n.t('SUBMIT')}
                    onPress={() => this.onSubmitClick()}
                />
            </ScrollView>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        theme: state.theme,
        language: state.language,
        direction: state.direction
    };
};

export default connect(mapStateToProps)(Contact);

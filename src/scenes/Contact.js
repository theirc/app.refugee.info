import React, {Component, PropTypes} from 'react';
import {View, ScrollView, TextInput} from 'react-native';
import {connect} from 'react-redux';
import I18n from '../constants/Messages';
import styles from '../styles';
import {Button, DirectionalText} from '../components';
import ApiClient from '../utils/ApiClient';


export class Contact extends Component {

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
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return this.state.isFormDirty && !re.test(this.state.email);
    }

    onSubmitClick() {
        this.setState({isFormDirty: true}, function () {
            if (!this._isNameInvalid() && !this._isSubjectInvalid() && !this._isMessageInvalid() && !this._isEmailInvalid()) {
                // console.log("Mail has been sent!");
                // this.apiClient.sendEmail(this.state.name, this.state.subject, this.state.email, this.state.message)
            }
        });
    }

    render() {
        return (
            <ScrollView style={styles.detailsContainer}>
                <DirectionalText
                    style={[styles.sectionContent, styles.textLight]}
                >
                    {I18n.t('NAME')}
                </DirectionalText>
                <View style={[styles.contactBorder, styles.borderLight]}>
                    <TextInput
                        autoCorrect={false}
                        onChangeText={
                            (text) => this.setState({name: text})
                        }
                        style={[styles.textInputModal, styles.textLight]}
                        underlineColorAndroid="transparent"
                        value={this.state.name}
                    />
                </View>

                {this._isNameInvalid() &&
                <DirectionalText style={styles.validationText}>
                    {I18n.t('FIELD_REQUIRED')}
                </DirectionalText>
                }

                <DirectionalText style={[styles.sectionContent, styles.textLight]}>
                    {I18n.t('EMAIL')}
                </DirectionalText>
                <View style={[styles.contactBorder, styles.borderLight]}>
                    <TextInput
                        autoCapitalize="none"
                        autoCorrect={false}
                        onChangeText={(text) => this.setState({email: text})}
                        style={[styles.textInputModal, styles.textLight]}
                        underlineColorAndroid="transparent"
                        value={this.state.email}
                    />
                </View>

                {this._isEmailInvalid() &&
                <DirectionalText style={[styles.validationText]}>
                    {I18n.t('FIELD_REQUIRED')}
                </DirectionalText>}

                <DirectionalText style={[styles.sectionContent, styles.textLight]}>
                    {I18n.t('SUBJECT')}
                </DirectionalText>
                <View style={[styles.contactBorder, styles.borderLight]}>
                    <TextInput
                        onChangeText={(text) => this.setState({subject: text})}
                        style={[styles.textInputModal, styles.textLight]}
                        underlineColorAndroid="transparent"
                        value={this.state.subject}
                    />
                </View>

                {this._isSubjectInvalid() &&
                <DirectionalText style={[styles.validationText]}>
                    {I18n.t('FIELD_REQUIRED')}
                </DirectionalText>}

                <DirectionalText style={[styles.sectionContent, styles.textLight]}>
                    {I18n.t('MESSAGE')}
                </DirectionalText>
                <View style={[styles.contactBorder, styles.borderLight]}>
                    <TextInput
                        multiline
                        onChangeText={(text) => this.setState({message: text})}
                        style={[styles.textInputMultiline, styles.textLight]}
                        underlineColorAndroid="transparent"
                        value={this.state.message}
                    />
                </View>

                {this._isMessageInvalid() &&
                <DirectionalText style={styles.validationText}>
                    {I18n.t('FIELD_REQUIRED')}
                </DirectionalText>}

                <Button
                    color="green"
                    onPress={() => this.onSubmitClick()}
                    text={I18n.t('SUBMIT')}
                    textStyle={{fontSize: 15}}
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

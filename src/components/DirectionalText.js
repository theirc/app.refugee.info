import React, {Component} from 'react';
import {Text} from 'react-native';
import {connect} from 'react-redux';
import {getFontFamily, getTextDirection} from '../styles';

export class DirectionalText extends Component {

    static propTypes = {
        ...Text.propTypes
    };

    render() {
        const {language, children} = this.props;
        return (
            <Text
                {...this.props}
                style={[getFontFamily(language), getTextDirection(language), this.props.style]}
            >
                {children}
            </Text>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.language
    };
};

export default connect(mapStateToProps)(DirectionalText);

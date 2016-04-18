import React, { Component, PropTypes } from 'react-native';
import { Toolbar as MaterialToolbar } from 'react-native-material-design';

export default class Toolbar extends Component {

    static contextTypes = {
        navigator: PropTypes.object
    };

    static propTypes = {
        onIconPress: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            title: 'Refugee Info'
        };
    }

    render() {
        const { navigator } = this.context;
        const { onIconPress } = this.props;

        return (
            <MaterialToolbar
                icon={navigator && navigator.isChild ? 'keyboard-backspace' : 'menu'}
                onIconPress={() => {navigator && navigator.isChild ? navigator.back() : onIconPress()}}
                rightIconStyle={{
                    margin: 10
                }}
                title={navigator && navigator.currentRoute ? navigator.currentRoute.title : 'Welcome'}
            />
        );
    }
}

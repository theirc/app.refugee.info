import styles, {
    getIconComponent,
    getIconName,
} from '../styles';
import React, {Component, PropTypes} from 'react'

export default class Icon extends Component {
    static propTypes = {
    }

    render() {
        let props = {...this.props };
        const IconComponent = getIconComponent(props.name);
        props.name = getIconName(props.name);

        return (<IconComponent {...props}></IconComponent>)
    }
}

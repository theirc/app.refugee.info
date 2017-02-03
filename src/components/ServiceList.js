import React, {Component, PropTypes} from 'react';
import {View, ListView} from 'react-native';
import {ServiceListItem} from '../components';
import {isStatusBarTranslucent} from '../styles';


export class ServiceList extends Component {

    static propTypes = {
        services: PropTypes.array
    };

    constructor(props) {
        super(props);

        this.dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1.id !== row2.id
        });
    }

    renderRow(rowData) {
        return (
            <ServiceListItem service={rowData}/>
        );
    }

    render() {
        return (
            <View style={{flex: 1, marginTop: isStatusBarTranslucent() ? 25 + 110 : 110}}>
                <ListView
                    dataSource={this.dataSource.cloneWithRows(this.props.services)}
                    enableEmptySections
                    keyboardDismissMode="on-drag"
                    keyboardShouldPersistTaps
                    renderRow={(service) => this.renderRow(service)}
                />
            </View>
        );
    }
}

export default ServiceList;

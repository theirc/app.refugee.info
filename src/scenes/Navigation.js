import React, { Component, PropTypes } from 'react-native';

import { Drawer } from 'react-native-material-design';

export default class Navigation extends Component {

    static contextTypes = {
        drawer: PropTypes.object.isRequired,
        navigator: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            route: null
        }
    }

    changeScene = (path, name) => {
        const { drawer, navigator } = this.context;

        this.setState({
            route: path
        });
        navigator.to(path, name);
        drawer.closeDrawer();
    };

    render() {
        const { route } = this.state;

        return (
            <Drawer theme="light">
                <Drawer.Section
                    items={[{
                        icon: 'home',
                        value: 'Home',
                        active: !route || route === 'welcome',
                        onPress: () => this.changeScene('welcome'),
                        onLongPress: () => this.changeScene('welcome')
                    }]}
                />

                <Drawer.Section
                    items={[{
                        icon: 'list',
                        value: 'List Services',
                        active: route === 'services',
                        onPress: () => this.changeScene('services'),
                        onLongPress: () => this.changeScene('services')
                    }, {
                        icon: 'map',
                        value: 'Explore Services on Map',
                        active: route === 'map',
                        onPress: () => this.changeScene('map'),
                        onLongPress: () => this.changeScene('map')
                    }, {
                        icon: 'info',
                        value: 'General Information',
                        active: route === 'info',
                        onPress: () => this.changeScene('info'),
                        onLongPress: () => this.changeScene('info')
                    }
                    ]}
                    title="Refugee Info"
                />

            </Drawer>
        );
    }
}

import {
    StatusBar,
    Platform
} from 'react-native';
import React, {Component, PropTypes} from 'react';
import Drawer from 'react-native-drawer';
import {connect} from 'react-redux';
import Navigation from '../scenes/Navigation';
import {Actions, DefaultRenderer} from 'react-native-router-flux';
import {themes} from '../styles';


class AppDrawer extends Component {
    static propTypes = {
        navigationState: PropTypes.object,
        onNavigate: PropTypes.func
    };

    renderStatusBar() {
        if (Platform.OS === 'ios') {
            return (
                <StatusBar
                    barStyle="default"
                />
            );
        } else {
            return (
                <StatusBar
                    backgroundColor="rgba(0,0,0,0.3)"
                    translucent
                />
            );
        }
    }

    render() {
        const state = this.props.navigationState;
        const children = state.children;

        return (
            <Drawer
                acceptTap
                captureGestures={true}
                closedDrawerOffset={0}
                content={<Navigation />}
                onClose={() => Actions.refresh({open: false})}
                onOpen={() => Actions.refresh({open: true})}
                openDrawerOffset={0.2}
                panOpenMask={0.02}
                panThreshold={0.08}
                side="left"
                styles={drawerStyles}
                tapToClose
                tweenDuration={100}
                type="displace"
            >
                <DefaultRenderer
                    navigationState={children[0]}
                    onNavigate={this.props.onNavigate}
                />
            </Drawer>
        );
    }
}

const drawerStyles = {
    main: {
        backgroundColor: themes.light.backgroundColor
    },
    drawer: {
        borderRightWidth: 1,
        borderLeftWidth: 1,
        borderLeftColor: themes.light.dividerColor,
        borderRightColor: themes.light.dividerColor,
        backgroundColor: themes.light.backgroundColor,
        shadowOpacity: 0.8,
        shadowRadius: 3
    }
};

const mapStateToProps = (state) => {
    return {
        direction: state.direction,
        ...state
    };
};

export default connect(mapStateToProps)(AppDrawer);

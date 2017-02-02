import React, {Component, PropTypes} from 'react';
import {View, StyleSheet, TouchableHighlight} from 'react-native';
import {connect} from 'react-redux';
import styles, {
    themes
} from '../styles';
import {Icon, DirectionalText} from '../components';
import {Actions} from 'react-native-router-flux';


export class MapPopup extends Component {

    static propTypes = {
        marker: PropTypes.object,
        region: PropTypes.object
    };

    constructor(props) {
        super(props);
    }

    navigateToService(marker) {
        const {region} = this.props;
        requestAnimationFrame(() => Actions.serviceDetails({service: marker, location: region}));
    }

    renderWidget(marker) {
        return (
            <View style={componentStyles.mapWidgetContainer}>
                {marker.type && (
                    <Icon
                        name={(marker.type.vector_icon || '').trim()}
                        style={componentStyles.mapWidgetIcon}
                    />
                )}
            </View>
        );
    }

    render() {
        const {marker} = this.props;
        return (
            <View style={[styles.containerLight]}>
                <TouchableHighlight
                    onPress={(() => this.navigateToService(marker))}
                    underlayColor="rgba(0, 0, 0, 0.2)"
                >
                    <View style={[styles.row, {padding: 10}]}>
                        <View style={[styles.iconContainer, {justifyContent: 'center', height: 48}]}>
                            {this.renderWidget(marker)}
                        </View>
                        <View style={{justifyContent: 'center', flex: 1}}>
                            <DirectionalText style={[componentStyles.mapPopupTitle, styles.textLight]}>
                                {marker.name}
                            </DirectionalText>
                            <DirectionalText style={[componentStyles.mapPopupProvider, styles.textLight]}>
                                {marker.provider.name}
                            </DirectionalText>
                        </View>
                    </View>
                </TouchableHighlight>
                <View style={{paddingLeft: 10, paddingRight: 10}}>
                    <DirectionalText style={[componentStyles.mapPopupDescription, styles.textLight]}>
                        {marker.description}
                    </DirectionalText>
                </View>
            </View>
        );
    }
}


const componentStyles = StyleSheet.create({
    mapPopupTitle: {
        fontSize: 14,
        fontWeight: 'bold'
    },
    mapPopupProvider: {
        fontSize: 13
    },
    mapPopupDescription: {
        marginTop: 5,
        fontSize: 13
    },
    mapWidgetContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 40,
        height: 40,
        marginHorizontal: 5,
        backgroundColor: themes.light.greenAccentColor,
        borderColor: themes.light.backgroundColor,
        borderRadius: 10,
        borderWidth: 1
    },
    mapWidgetIcon: {
        fontSize: 22,
        color: themes.dark.textColor,
        textAlign: 'center'
    }
});

const mapStateToProps = (state) => {
    return {
        language: state.language,
        region: state.region
    };
};

export default connect(mapStateToProps)(MapPopup);

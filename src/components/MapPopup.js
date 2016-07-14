import React, {Component, PropTypes} from 'react';
import {Text, View, Image, Dimensions, StyleSheet} from 'react-native';
import ServiceCommons from '../utils/ServiceCommons';
import {connect} from 'react-redux';
import styles, {
    getFontFamily, 
    getRowOrdering, 
    getTextColor,
    getContainerColor,
    getAlignItems,
    getTextAlign
} from '../styles';

export default class MapPopup extends Component {

    static propTypes = {
        marker: PropTypes.object
    };

    constructor(props) {
        super(props);
        this.serviceCommons = new ServiceCommons();
    }


    render() {
        let {direction, marker, theme, language} = this.props;
        return (
            <View style={[
                styles.container,
                getContainerColor(theme),
                {padding: 10}
            ]}>
                <View style={getRowOrdering(direction)}>
                    <View style={[
                        styles.iconContainer,
                        direction=='rtl' ? {marginLeft: 10, marginRight: 0} : {}
                    ]}>
                        <Image
                            source={{ uri: marker.icon_url }}
                            style={styles.mapIcon}
                        />
                    </View>
                    <View style={[
                        styles.container,
                        getAlignItems(direction)
                    ]}>
                        <Text style={[
                            componentStyles.mapPopupTitle,
                            getTextColor(theme),
                            getFontFamily(language)
                        ]}>
                            {marker.title}
                        </Text>
                        <Text style={[
                            componentStyles.mapPopupProvider,
                            getTextColor(theme),
                            getFontFamily(language)
                        ]}>
                            {marker.service.provider.name}
                        </Text>
                    </View>
                </View>
                <View>
                    <Text style={[
                        componentStyles.mapPopupDescription,
                        getTextColor(theme),
                        getFontFamily(language),
                        getTextAlign(direction)
                    ]}>
                        {marker.description}
                    </Text>
                </View>
            </View>
        )
    }
};

const componentStyles = StyleSheet.create({
    mapPopupTitle: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    mapPopupProvider: {
        fontSize: 14,
        marginBottom: 5
    },
    mapPopupDescription: {
        marginTop: 5,
        fontSize: 12
    }
});

const mapStateToProps = (state) => {
    return {
        direction: state.direction,
        language: state.language,
        theme: state.theme
    };
};

export default connect(mapStateToProps)(MapPopup);

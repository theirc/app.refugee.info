import React, {Component, PropTypes} from 'react';
import {Text, View, Image, Dimensions, StyleSheet} from 'react-native';
import ServiceCommons from '../utils/ServiceCommons';
import {connect} from 'react-redux';
import styles, {generateTextStyles, getRowOrdering} from '../styles';

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
                {padding: 10},
                theme=='dark' ? styles.listItemContainerDark : styles.listItemContainerLight
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
                        {alignItems: (direction=='rtl') ? 'flex-end' : 'flex-start'}
                    ]}>
                        <Text style={[
                            componentStyles.mapPopupTitle,
                            theme=='dark' ? styles.textDark : styles.textLight,
                            generateTextStyles(language)
                        ]}>
                            {marker.title}
                        </Text>
                        <Text style={[
                            componentStyles.mapPopupProvider,
                            theme=='dark' ? styles.textDark : styles.textLight,
                            generateTextStyles(language)
                        ]}>
                            {marker.service.provider.name}
                        </Text>
                        <View style={getRowOrdering(direction)}>
                            {this.serviceCommons.renderStars(marker.service.rating)}
                        </View>
                    </View>
                </View>
                <View>
                    <Text style={[
                        componentStyles.mapPopupDescription,
                        theme=='dark' ? styles.textDark : styles.textLight,
                        generateTextStyles(language),
                        {textAlign: (direction=='rtl') ? 'right' : 'left'}
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
        theme: state.theme.theme
    };
};

export default connect(mapStateToProps)(MapPopup);

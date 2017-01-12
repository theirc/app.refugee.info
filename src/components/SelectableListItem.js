import React, {Component, PropTypes} from 'react';
import {
    View,
    TouchableHighlight,
    StyleSheet
} from 'react-native';
import styles, {themes} from '../styles';
import {Icon, DirectionalText} from '../components';


class SelectableListItem extends Component {

    static propTypes = {
        icon: PropTypes.string,
        image: PropTypes.string,
        onPress: PropTypes.func,
        selected: PropTypes.bool,
        text: PropTypes.string
    };

    renderSelectMark() {
        const {selected} = this.props;
        return (
            <View
                style={[componentStyles.listItemIconContainer]}
            >
                {selected &&
                <Icon
                    name="ios-checkmark-circle"
                    style={[componentStyles.listItemIcon]}
                />}
            </View>
        );
    }


    renderIcon() {
        const {icon} = this.props;
        return (
            <View>
                <View
                    style={[componentStyles.listItemIconContainer]}
                >
                    {icon &&
                    <Icon
                        name={icon}
                        style={[componentStyles.listItemIcon, {color: themes.light.textColor}]}
                    />}
                </View>
                <View style={[componentStyles.dividerInline, styles.dividerLight]}/>
            </View>
        );
    }

    render() {
        const {onPress, text} = this.props;
        const selectedMark = this.renderSelectMark();
        const buttonIcon = this.renderIcon();

        return (
            <View>
                <TouchableHighlight
                    onPress={onPress}
                    underlayColor="rgba(0, 0, 0, 0.2)"
                >
                    <View style={[
                        componentStyles.listItemContainer,
                        styles.row,
                        styles.bottomDividerLight,
                        styles.containerLight,
                        {borderBottomWidth: 1}]}
                    >
                        {buttonIcon}
                        <View style={componentStyles.listItemTextContainer}>
                            <DirectionalText style={componentStyles.listItemText}>
                                {text}
                            </DirectionalText>
                        </View>
                        {selectedMark}
                    </View>
                </TouchableHighlight>
            </View>
        );
    }
}


const componentStyles = StyleSheet.create({
    listItemContainer: {
        flexGrow: 1,
        height: 50
    },
    listItemTextContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10
    },
    listItemText: {
        textAlign: 'center',
        fontSize: 15
    },
    listItemIconContainer: {
        width: 60,
        height: 50,
        padding: 13,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    listItemIcon: {
        color: themes.light.greenAccentColor,
        fontSize: 24
    }

});

export default SelectableListItem;

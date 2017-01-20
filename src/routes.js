/* eslint-disable react/jsx-max-props-per-line */
import React from 'react';
import I18n from './constants/Messages';
import {Actions, Scene} from 'react-native-router-flux';
import CountryChoice from './scenes/CountryChoice';
import CityChoice from './scenes/CityChoice';
import ServiceList from './scenes/ServiceList';
import ServiceDetails from './scenes/ServiceDetails';
import ServiceMap from './scenes/ServiceMap';
import GeneralInformation from './scenes/GeneralInformation';
import AppDrawer from './components/AppDrawer';
import GeneralInformationDetails from './scenes/GeneralInformationDetails';
import NetworkFailure from './scenes/NetworkFailure';
import Notifications from './scenes/Notifications';
import NewsThatMoves from './scenes/NewsThatMoves';
import Settings from './scenes/Settings';

const scenes = Actions.create(
    <Scene component={AppDrawer} key="drawer" open={false}>
        <Scene key="main">
            <Scene
                component={GeneralInformation}
                hideNavBar={false}
                initial key="info"
                title={() => I18n.t('GENERAL_INFO')}
            />
            <Scene
                component={GeneralInformationDetails}
                hideNavBar={false}
                key="infoDetails"
                title={() => I18n.t('GENERAL_INFO')}
            />
            <Scene
                component={CountryChoice}
                hideNavBar={false}
                key="countryChoice"
                title={() => I18n.t('WHERE_ARE_YOU')}
            />
            <Scene
                component={CityChoice}
                hideNavBar={false}
                key="cityChoice"
                title={() => I18n.t('WHERE_ARE_YOU')}
            />
            <Scene
                component={ServiceList}
                hideNavBar={false}
                key="serviceList"
                title={() => I18n.t('SERVICE_LIST')}
            />
            <Scene
                component={ServiceDetails}
                hideNavBar={false}
                key="serviceDetails"
                title={() => I18n.t('SERVICE_DETAILS')}
            />
            <Scene
                component={ServiceMap}
                hideNavBar
                key="serviceMap"
            />
            <Scene
                component={NetworkFailure}
                hideNavBar={false}
                key="networkFailure"
            />
            <Scene
                component={Notifications}
                hideNavBar={false}
                key="notifications"
                title={() => I18n.t('ANNOUNCEMENTS')}
            />
            <Scene
                component={NewsThatMoves}
                hideNavBar={false}
                key="news"
                title={() => I18n.t('NEWS')}
            />
            <Scene
                component={Settings}
                hideNavBar={false}
                key="settings"
                title={() => I18n.t('SETTINGS')}
            />
        </Scene>
    </Scene>
);

export default scenes;

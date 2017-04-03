/* eslint-disable react/jsx-max-props-per-line */
import React from 'react';
import I18n from './constants/Messages';
import {Actions, Scene} from 'react-native-router-flux';
import CountryChoice from './scenes/CountryChoice';
import CityChoice from './scenes/CityChoice';
import Service from './scenes/Service';
import ServiceDetails from './scenes/ServiceDetails';
import GeneralInformation from './scenes/GeneralInformation';
import AppDrawer from './components/AppDrawer';
import GeneralInformationDetails from './scenes/GeneralInformationDetails';
import NetworkFailure from './scenes/NetworkFailure';
import NewsThatMoves from './scenes/NewsThatMoves';
import Settings from './scenes/Settings';
import MicroApp from './scenes/MicroApp';


const scenes = Actions.create(
    <Scene component={AppDrawer} key="drawer" open={false}>
        <Scene key="main" panHandlers={null}>
            <Scene
                component={GeneralInformation}
                hideNavBar={false}
                initial
                key="info"
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
                component={ServiceDetails}
                hideNavBar={false}
                key="serviceDetails"
                title={() => I18n.t('SERVICE_DETAILS')}
            />
            <Scene
                component={Service}
                hideNavBar={true}
                key="service"
            />
            <Scene
                component={NetworkFailure}
                hideNavBar={false}
                key="networkFailure"
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
            <Scene
                component={MicroApp}
                hideNavBar={true}
                key="microApp"
                title={() => I18n.t('MICRO_APPS')}
            />
        </Scene>
    </Scene>
);

export default scenes;

/**
 * Test-Mobx
 *
 * @flow
 */
'use strict';
import React, { Component } from 'react';
import {
    AppState,
    NetInfo,
    Navigator,
    UIManager,
    View,
    Text,
    Image,
    StatusBar,
    ScrollView,
    BackAndroid,
    Alert,
    Platform,
} from 'react-native';
// import PushNotification from 'react-native-push-notification';
import Orientation from 'react-native-orientation';
import DeviceInfo from 'react-native-device-info';
import Icon from 'react-native-vector-icons/Ionicons';

import Network from './mixins/Network';
//pages
import HomePage from './containers/HomePage';
import ErrorPage from './containers/ErrorPage';
import TestFlatList from './containers/listpages/TestFlatList';
import ListPage1 from './containers/listpages/ListDemo1';
import ListPage2 from './containers/listpages/ListDemo2';

export default class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            initializtion: true,
            appState: AppState.currentState,
            firstGuide: true,
        };

        NetInfo.addEventListener('change',
            (state)=> {
                Network.info = state;
            }
        );
    }

    componentWillMount() {
        Orientation.lockToPortrait();

        if (Platform.OS === 'android') {
            BackAndroid.addEventListener('hardwareBackPress', this._onBackAndroid);
        }
    }

    componentDidMount() {
        //
        global.title = 'test mobx';
        //alert(title)

        AppState.addEventListener('change', this._onAppStateChange);
    }

    componentWillUnmount(){
        this.unmounting = true;

        AppState.removeEventListener('change', this._onAppStateChange);
        if (Platform.OS === 'android') {
            BackAndroid.removeEventListener('hardwareBackPress', this._onBackAndroid);
        }
    }

    render() {
        var {
            firstGuide,
        }=this.state;

        return (
            <View style={{flex: 1,backgroundColor: '#f4f4f4',}}>
                <StatusBar backgroundColor='rgba(0,0,0,0.1)' hidden={false} animated={true} translucent={true} barStyle='light-content'/>
                <Navigator
                    initialRoute={{title: firstGuide?'Home':'Guide', component:null, passProps:{}}}
                    configureScene={this._configureScene}
                    renderScene={this._navToPage}
                    style={{flex: 1,}}
                />

            </View>
        );
    }

    _configureScene = (route, routeStack) => {
        if (route.configureScene) return route.configureScene;
        else return Navigator.SceneConfigs.PushFromRight;
    }

    _onAppStateChange = (appState) => {
        if (appState==='background'){
            //..
        }

        if(appState==='active'){
            //..

            this.setState({ appState:appState });
        }
    }

    _onBackAndroid = () => {
        const nav = this.navigator;
        if(!nav||nav===null){
            return true;
        }
        const routers = nav.getCurrentRoutes();

        //最近2秒内连按两次back键，可以退出应用。
        if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
            Alert.alert(
                '确认',
                '是否要退出应用?',
                [
                    {text: '取消', onPress: () => {}},
                    {text: '确定', onPress: () => {BackAndroid.exitApp()}},
                ]
            )
            return true;
        }else{
            this.lastBackPressed = Date.now();
            if (routers.length > 1) {
                nav.pop();
                return true;
            }else{
                Alert.alert(
                    '确认',
                    '是否要退出应用?',
                    [
                        {text: '取消', onPress: () => {}},
                        {text: '确定', onPress: () => {BackAndroid.exitApp()}},
                    ]
                )
            }
            return true;
        };
    }

    _navToPage = (route, navigator) => {
        let Component = route.component;
        if (Component) return <Component {...route} navigator={navigator} />;

        switch (route.title) {
            case 'Guide':
                return <FirstGuide navigator={navigator} />;
            case 'Cover':
                return <AppCover navigator={navigator} {...route}  callback={this.appCoverCallBack} />
            case 'Home':
                return <HomePage {...route} navigator={navigator} />;
            case 'FlatList':
                return <TestFlatList {...route} navigator={navigator} />;
            case 'ListDemo1':
                return <ListPage1 {...route} navigator={navigator} />;
            case 'ListDemo2':
                return <ListPage2 {...route} navigator={navigator} />;
            default:
                return <ErrorPage {...route} navigator={navigator} />;
        }
    }


}

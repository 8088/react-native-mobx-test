/**
 * A-mili React Native App
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
    StyleSheet,
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
import TestListPage from './containers/listpages/TestListPage';

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
            <View style={styles.container}>
                <StatusBar backgroundColor='rgba(0,0,0,0.1)' hidden={false} animated={true} translucent={true} barStyle='light-content'/>
                <Navigator
                    initialRoute={{title: firstGuide?'Home':'Guide', component:null, passProps:{}}}
                    configureScene={this._configureScene}
                    renderScene={this._navToPage}
                    style={styles.container}
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
            case 'TestList':
                return <TestListPage {...route} navigator={navigator} />;
            default:
                return <ErrorPage {...route} navigator={navigator} />;
        }
    }


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f4f4',
    },


    btn_default: {
        borderRadius: 3,
        borderWidth: 1,
        borderColor: '#FFB8C6',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF7F8',
        paddingHorizontal: 8,
        paddingVertical: 5,
    },
    btn_disabled: {
        borderRadius: 3,
        borderWidth: 1,
        borderColor: '#eee',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f4f4f4',
        paddingHorizontal: 8,
        paddingVertical: 5,
    },
    btn_switch_off:{
        height: 26,
        width: 54,
        borderRadius: 13,
        borderWidth: 2,
        borderColor: '#bbb',
        alignItems: 'center',
        backgroundColor: '#bbb',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    btn_switch_on:{
        height: 26,
        width: 54,
        borderRadius: 13,
        borderWidth: 2,
        borderColor: 'rgb(250,110,120)',
        alignItems: 'center',
        backgroundColor: 'rgb(250,110,120)',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    btn_switch_icon:{
        backgroundColor: '#fff',
        height: 22,
        width: 22,
        borderRadius: 11,
    },
    btn_switch_text:{
        color: '#fff',
        paddingHorizontal: 7,
        fontSize: 12,
        paddingBottom: .5,
    },

    text_input: {
        borderRadius: 3,
        borderWidth: 1,
        borderColor: '#eee',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#fff',
        flexDirection: 'row',
        padding: 6,
    },

    inputbar: {
        padding: 10,
        backgroundColor: '#fff',
        borderTopColor: '#eee',
        borderTopWidth: 1,
    },

    tab_page:{
        flex: 1,
        backgroundColor: '#eee',
    },



    flex_1:{
        flex: 1,
    },
    flex_wrap: {
        flexWrap: 'wrap',
    },
    flex_row: {
        flexDirection: 'row',
    },
    flex_column: {
        flexDirection: 'column',
    },
    flex_between: {
        justifyContent: 'space-between',
    },
    align_start:{
        alignItems: 'flex-start',
    },
    align_end:{
        alignItems: 'flex-end',
    },
    align_center: {
        alignItems: 'center',
    },

    margin_left_10: {
        marginLeft: 10,
    },
    margin_top_10: {
        marginTop: 10,
    },
    margin_right_10: {
        marginRight: 10,
    },
    margin_bottom_10:{
        marginBottom: 10,
    },
    margin_left_5: {
        marginLeft: 5,
    },
    margin_right_5: {
        marginRight: 5,
    },
    margin_top_5: {
        marginTop: 5,
    },

    color_black: {
        color: '#000',
    },
    color_white:{
        color: '#fff',
    },
    color_gray:{
        color: '#ccc',
    },
    color_deep:{
        color: '#999',
    },
    color_pink:{
        color: '#FE7A93',
    },


    font_size_12:{
        fontSize:12,
    },
    font_size_14:{
        fontSize:14,
    },
    font_size_16:{
        fontSize:16,
    },
    font_size_18:{
        fontSize:18,
    },
    font_size_20:{
        fontSize:20,
    },

    module:{
        marginHorizontal: 10,
        marginTop: 10,
        backgroundColor: '#fff',
    },
    module_head:{
        borderBottomColor: '#eee',
        borderBottomWidth: 1,
    },
    module_head_text:{
        fontWeight: 'bold',
    },
    module_body: {
        padding: 15,
    }
});

/**
 * A-mili React Native App
 *
 * @flow
 */
'use strict';
import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    TextInput,
    StatusBar,
    ScrollView,
    StyleSheet,
} from 'react-native';
import {observer} from 'mobx-react/native';
import { observable, computed, outrun, action, useStrict } from 'mobx';
import Icon from 'react-native-vector-icons/Ionicons';

import Network from '../mixins/Network';
import styles from './Style.css';

import Button from '../components/Button';
import ToggleButton from '../components/ToggleButton';
import HtmlView from '../components/HtmlView';
import InputEditor from '../components/InputEditor';
import SlideBox from '../components/SlideBox';
import ScrollBox from '../components/ScrollBox';
import Tabbar from '../components/Tabbar';
import Tabbody from '../components/Tabbody';

import Topbar from '../modules/Topbar';
import Module from '../modules/Module';

@observer
export default class HomePage extends Component {

    @observable counter = 0;

    constructor(props) {
        super(props);
        this.state = {
            //..
        };
    }

    componentDidMount() {
        //
    }

    componentWillUnmount(){
        this.unmounting = true;
    }

    //
    render() {

        return (
            <View style={styles.container}>
                <StatusBar backgroundColor='rgba(255,255,255,0.1)' hidden={false} animated={true} translucent={true} barStyle='default'/>
                <Topbar title='Mobx Test'/>
                <ScrollView style={styles.flex_1}>
                    <Module title='introduce-mobx'>

                        <TextInput style={{height:30,}} value={`${this.counter}`} onChangeText={this.onChangeText} />
                        <Text style={styles.btn} onPress={this.inc}>+</Text>
                        <Text style={styles.btn} onPress={this.dec}>-</Text>
                    </Module>
                </ScrollView>
            </View>
        );
    }

    inc = () => {
        ++this.counter;
    };

    dec = () => {
        --this.counter;
    };

    onChangeText = v => {
        try {
            this.counter = parseInt(v);
        } catch (err) {

        }
    };



}


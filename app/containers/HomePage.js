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

import Colors from '../assets/Colors';
import Network from '../mixins/Network';
import styles from './Style.css';

import Button from '../components/Button';
import ToggleButton from '../components/ToggleButton';
import Stepper from '../components/Stepper';
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

    @observable counter = 90;

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
                    <Module title='mobx'>
                        <Stepper disabled={false} max={99} min={0} style={styles.stepper}>
                            <Button style={[styles.stepper_btn, styles.left_btn]} renderDisabled={()=>{
                                return (
                                    <View style={[styles.stepper_btn_disabled, styles.left_btn]}>
                                        <Icon name='ios-remove' size={26} color={Colors.white}/>
                                    </View>
                                );
                            }}>
                                <Icon name='ios-remove' size={26} color={Colors.white}/>
                            </Button>
                            <TextInput style={styles.stepper_txt} value={`${this.counter}`} onChangeText={this.onChangeText} />
                            <Button style={[styles.stepper_btn, styles.right_btn]} renderDisabled={()=>{
                                return (
                                    <View style={[styles.stepper_btn_disabled, styles.right_btn]}>
                                        <Icon name='ios-add' size={26} color={Colors.white}/>
                                    </View>
                                );
                            }}>
                                <Icon name='ios-add' size={26} color={Colors.white}/>
                            </Button>
                        </Stepper>
                    </Module>
                </ScrollView>
            </View>
        );
    }

}


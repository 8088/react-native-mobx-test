/**
 * 投票模块
 * TODO:
 *    1、外部更新投票数据
 *    2、根据数据量遍历渲染投票项(如果有结果直接显示结果动画,单条颜色透明度为总量的百分比)
 *    3、当用户选中某项,提交按钮解禁
 *    4、点提交后,按钮禁用并显示loading
 *    5、提交成功, 提交按钮消失, 各条投票项根据数据量做动画。
 *    6、提交失败(超时或者返回错误), 解禁提交按钮可再次提交。
 *
 * @flow
 */
'use strict';
import React, { PureComponent, PropTypes } from 'react';
import {
    View,
    Text,
    Alert,
    Easing,
    Animated,
    StyleSheet,
} from 'react-native';
import { observable, action, computed } from 'mobx';
import { observer } from 'mobx-react/native';
import Icon from 'react-native-vector-icons/Ionicons';

import Colors from '../assets/Colors';
import RadioGroup from '../components/RadioGroup';
import RadioButton from '../components/RadioButton';

class ItemData {

    title = '';

    @observable
    count = 0;

    @observable
    percent =0;

    constructor(item) {
        this.title = item.title;
        this.count = item.count;
    }

};

class VoteData {

    @observable
    items = [];

    @observable
    disabled = false;

    @observable
    polled = false;

    constructor(data) {
        this.polled = data.responseData.polled;

        let ln = data.responseData.votes.length;
        for (let i = 0; i < ln; i++) {
            var temp = data.responseData.votes[i];
            this.items.push(new ItemData(temp));
        }
    }

    @computed
    get count() {
        return this.items.reduce((a, b) => a + b.count, 0);
    }

}

@observer
export default class Vote extends PureComponent {

    constructor(props) {
        super(props);
        this._voteData = new VoteData(props.data);
        this._width=0;
        this.state = {
            fadeInOpacity: new Animated.Value(0),
            itemAnim: this._voteData.items.map(() => new Animated.Value(0))
        };

    }

    componentDidMount() {
        this.vote_radio = this.refs["vote_radio"];

        if(this._voteData.polled){
            this._voteData.items.forEach((item, i)=>{
                item.percent = item.count/this._voteData.count;
            })
        }
    }

    render() {
        return (
            <View style={{flex:1}} onLayout={this._onLayout}>
            {
                this._voteData.polled?<Animated.View style={[styles.container, {
                    opacity: this.state.fadeInOpacity
                }]}>
                {
                    this._voteData.items.map((item,index)=>{
                        return (
                            <View key={index} style={styles.container}>
                                <View style={styles.vote_item}>
                                    <Animated.View style={{position:'absolute', backgroundColor:`rgba(255, 190, 200, ${(item.percent*.8+0.2).toFixed(2)})`,width:this.state.itemAnim[index], height:'100%',}}/>
                                    <Text numberOfLines={1} style={styles.radio_txt}>{item.title}</Text>
                                    <Text style={styles.radio_num}>{item.count}</Text>
                                </View>
                                {index<this._voteData.items.length-1?<View style={styles.separator}/>:null}
                            </View>
                        );
                    })
                }
                </Animated.View>:
                <RadioGroup ref="vote_radio" disabled={this._voteData.disabled} name={'vote'} style={styles.container} onChanged={this._onRadioChanged}>
                {
                    this._voteData.items.map((item,index)=>{
                        return (
                            <View key={index} style={styles.container}>
                                <RadioButton
                                    style={styles.vote_item}
                                    renderChecked={()=>{
                                        return (
                                            <View style={styles.vote_item}>
                                                <Text numberOfLines={1} style={styles.radio_txt}>{item.title}</Text>
                                                <View style={styles.radio_btn_checked}>
                                                    <Icon style={{backgroundColor:'transparent'}} name='md-checkmark' size={14} color='#FE7A93'/>
                                                </View>
                                            </View>
                                        );
                                    }}>
                                    <Text numberOfLines={1} style={styles.radio_txt}>{item.title}</Text>
                                    <View style={styles.radio_btn} />
                                </RadioButton>
                                {index<this._voteData.items.length-1?<View style={styles.separator}/>:null}
                            </View>
                        );
                    })
                }
                </RadioGroup>
            }
            </View>
        );
    }

    _onLayout=(evt)=>{
        this._width=evt.nativeEvent.layout.width;

        this._showPolled();
    }

    _onRadioChanged=(index)=>{
        Alert.alert(
            `${index+1}. ${this._voteData.items[index].title}`,
            `您宝贵的一票是否投给第 ${index+1} 项？`,
            [
                {text: '取消', onPress: () => {if(this.vote_radio)this.vote_radio.reset()}},
                {text: '确定', onPress: () => {
                    this._voteData.disabled =true;

                    this._voteData.items.forEach((item, i)=>{
                        item.percent = item.count/this._voteData.count;
                        if(i===index) item.count +=1;
                    })

                    this._voteData.polled =true;
                    this._showPolled();

                    //mark: 提交投票数据接口...
                }},
            ]
        );
    }

    _showPolled=()=>{
        Animated.timing(this.state.fadeInOpacity, {
            toValue: 1,
            duration: 400,
            easing: Easing.linear
        }).start();

        if(!this._width) return;

        Animated.stagger(240, this.state.itemAnim.map((anim,index)=> {
            let _percent = this._voteData.items[index].percent;
            return Animated.timing(anim, {
                toValue: this._width*_percent,
                duration: parseInt(400*_percent+200),
                easing: Easing.linear
            });
        })).start();
    }

}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#eee'
    },

    vote_item:{
        flexDirection: 'row',
        alignItems: 'center',
        height: 40,
        backgroundColor:'#fff'


    },

    //radio button
    radio_btn: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.gray,
        height: 20,
        width: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    radio_btn_checked: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.pink,
        height: 20,
        width: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    radio_txt:{
        color: Colors.deep,
        marginLeft: 5,
        flex:1,
        backgroundColor:'transparent',
    },
    radio_num:{
        color: Colors.deep,
        backgroundColor:'transparent',
    },


    separator: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#eee',
    },

});

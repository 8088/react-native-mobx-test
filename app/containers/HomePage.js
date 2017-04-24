/**
 * Home Page
 *
 * @flow
 */
'use strict';
import React, { Component, PropTypes } from 'react';
import {
    View,
    Text,
    Image,
    Platform,
    TextInput,
    StatusBar,
    ScrollView,
    StyleSheet,
    ProgressViewIOS,
    ProgressBarAndroid,
} from 'react-native';
import validate from 'mobx-form-validate';
import { observer } from 'mobx-react/native';
import { observable, computed, outrun, action, useStrict } from 'mobx';
import moment from 'moment';
import camelcase from 'camelcase';
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
import Form from '../components/Form';

import Topbar from '../modules/Topbar';
import Module from '../modules/Module';
import Vote from '../modules/Vote';

import vote_json from '../data/vote.json';

const now = observable(moment());
function updateNow() {
    requestAnimationFrame(action(() => {
        now.set(moment());
        updateNow();
    }));
}
updateNow();
const date = computed(() => now.get().format('YYYY-MM-DD'));
const DateClock = observer(function () {
    return <Text>{date.get()}</Text>;
});

const clock = computed(() => now.get().format('hh:mm:ss'));
const Clock = observer(function () {
    return <Text>{clock.get()}</Text>;
});
const cycle = computed(() => now.get() % 3000);

const CycleProgress = observer(function () {
    if (_isIOS) {
        return (
            <ProgressViewIOS
                progressTintColor={'#FFB8C6'}
                progress={cycle.get() / 3000}
            />
        );
    }
    return (
        <ProgressBarAndroid
            color={'#FFB8C6'}
            progress={cycle.get() / 3000}
        />
    )
});

//测试标题
class Title {
    id = `${Date.now()}${Math.floor(Math.random()*10)}`;

    @observable
    text = '';

    @observable
    done = false;

    constructor(text) {
        this.text = text;
    }
}

//表单验证
class FormValidate {
    @observable
    @validate(/^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/, 'Please input a valid phone number.')
    mobile = '';

    @observable
    @validate(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/, 'Please input a valid email address.')
    email = '';

    @observable
    @validate(/^.+$/, 'Please input any password.')
    password = '';

    @observable
    @validate(/^\d{4,6}$/, 'Please input identifying code.')
    code = '';

    @observable
    errorinfo = '';

    clear = () => {
        this.mobile='';
        this.email='';
        this.password='';
        this.code='';
        this.errorinfo='';
    };
}

//倒计时
class CountDown {
    @observable
    timer = moment(0);

    @computed
    get time() {
        let _time =0;
        if(this.timer > now.get())
        {
            _time = Math.floor(moment.duration({
                from: now.get(),
                to: this.timer,
            }).asSeconds());
        }
        return _time;
    }

    @action
    start=(num)=>{
        this.timer = moment(now.get()).add(num, 'seconds');
    };
}

@observer
export default class HomePage extends Component {

    @observable counter = 8;
    @observable counter2 = 0;

    static propTypes = {
        ttl: PropTypes.instanceOf(Title),
    };

    static defaultProps = {
        ttl: new Title('Test mobx style'),
    };

    constructor(props) {
        super(props);
        this.state = {
            secure:true,
            countdown: 0,
        };

        this.validate= new FormValidate();
        this.countdown = new CountDown();
    }

    componentDidMount() {
        //
    }

    componentWillUnmount(){
        this.unmounting = true;
    }


    //
    render() {
        const { ttl, } = this.props;
        const { secure, countdown} = this.state;
        return (
            <View style={styles.container}>
                <StatusBar backgroundColor='rgba(255,255,255,0.1)' hidden={false} animated={true} translucent={true} barStyle='default'/>
                <Topbar title='Mobx Test'/>
                <ScrollView style={styles.flex_1}>

                    <Module title='mobx form'>
                        <Form style={styles.flex_1}  action='form_action.php' method="post" validate={this.validate} callback={this._submitSuccess}>
                            <View style={[styles.form_item, this._getValidStyle('mobile')]}>
                                <Text style={styles.form_ttl}>账号</Text>
                                <TextInput
                                    name='mobile'
                                    autoFocus={false}
                                    maxLength={30}
                                    style={styles.form_input}
                                    placeholder='请输入手机号(首次登录自动注册)'
                                    selectionColor='pink'
                                    placeholderTextColor='#bbb'
                                    underlineColorAndroid='transparent'
                                    keyboardType='numeric'>
                                </TextInput>
                                <Button disabled={this.validate.mobile===''} style={[styles.clear_btn]} renderDisabled={()=>{return null;}}
                                        onPress={()=>{
                                            this.validate.mobile='';
                                        }}>
                                    <Icon name='ios-close-circle' size={16} color={Colors.gray}/>
                                </Button>
                            </View>
                            <View style={[styles.form_item, this._getValidStyle('email')]}>
                                <Text style={styles.form_ttl}>邮箱</Text>
                                <TextInput
                                    name='email'
                                    autoFocus={false}
                                    maxLength={30}
                                    style={styles.form_input}
                                    placeholder='请输入邮箱'
                                    selectionColor='pink'
                                    placeholderTextColor='#bbb'
                                    underlineColorAndroid='transparent'
                                    keyboardType='email-address'>
                                </TextInput>
                                <Button disabled={this.validate.email===''} style={[styles.clear_btn]} renderDisabled={()=>{return null;}}
                                        onPress={()=>{
                                            this.validate.email='';
                                        }}>
                                    <Icon name='ios-close-circle' size={16} color={Colors.gray}/>
                                </Button>
                            </View>
                            <View style={[styles.form_item, this._getValidStyle('password')]}>
                                <Text style={styles.form_ttl}>密码</Text>
                                <TextInput
                                    name='password'
                                    maxLength={30}
                                    secureTextEntry={secure}
                                    style={styles.form_input}
                                    placeholder='请输入密码'
                                    selectionColor='pink'
                                    placeholderTextColor='#bbb'
                                    underlineColorAndroid='transparent'
                                    keyboardType='default'>
                                </TextInput>
                                <Button disabled={this.validate.password===''} style={[styles.clear_btn, styles.margin_right_10]} renderDisabled={()=>{return null;}}
                                        onPress={()=>{
                                            this.validate.password='';
                                        }}>
                                    <Icon name='ios-close-circle' size={16} color={Colors.gray}/>
                                </Button>
                                <ToggleButton onPress={this._onToggle}  checked={secure} style={styles.secure_btn}>
                                    <Button>
                                        <Icon name='md-eye' size={24} color='#fdd'/>
                                    </Button>
                                    <Button >
                                        <Icon name='md-eye-off' size={24} color='#ffe8e8'/>
                                    </Button>
                                </ToggleButton>
                            </View>
                            <View style={[styles.form_item, this._getValidStyle('code')]}>
                                <TextInput
                                    name='code'
                                    maxLength={30}
                                    style={styles.form_input}
                                    placeholder='请输入验证码'
                                    selectionColor='pink'
                                    placeholderTextColor='#bbb'
                                    underlineColorAndroid='transparent'
                                    keyboardType='numeric'>
                                </TextInput>
                                <Button disabled={this.validate.code===''} style={[styles.clear_btn, styles.margin_right_10]} renderDisabled={()=>{return null;}}
                                        onPress={()=>{
                                            this.validate.code='';
                                        }}>
                                    <Icon name='ios-close-circle' size={16} color={Colors.gray}/>
                                </Button>
                                {this.countdown.time>0?<View style={styles.get_code_btn_disabled}>
                                    <Text style={[styles.color_gray, styles.font_size_14]}>{this.countdown.time+'秒后重试'}</Text>
                                </View>
                                :<Button onPress={this._getCode} disabled={this.validate[camelcase('validate','error', 'mobile')]?true:false} style={styles.get_code_btn}
                                                renderDisabled={()=>{
                                                    return(
                                                        <View style={styles.get_code_btn_disabled}>
                                                            <Text style={[styles.color_gray, styles.font_size_14]}>获取验证码</Text>
                                                        </View>
                                                    );
                                                }}>
                                    <Text style={[styles.color_deep, styles.font_size_14]}>获取验证码</Text>
                                </Button>

                                }

                            </View>
                            <View style={[styles.flex_row, styles.align_center]}>
                                <Text style={styles.form_info}>{this.validate.errorinfo}</Text>
                                <Button disabled={!this.validate.isValid} type='submit' style={[styles.form_submit, styles.margin_top_10]} renderDisabled={()=>{
                                    return (
                                        <View style={[styles.form_submit_disabled, styles.margin_top_10]} >
                                            <Text style={[styles.color_gray,styles.font_size_14]}>提交</Text>
                                        </View>
                                    );
                                }}>
                                    <Text style={[styles.color_deep,styles.font_size_14]}>提交</Text>
                                </Button>
                            </View>
                        </Form>
                    </Module>

                    <Module title='mobx list'>
                        <Button type='submit' style={styles.list_btn} onPress={()=>{
                            this._gotoPage('FlatList');
                        }}>
                            <Text style={[styles.flex_1, styles.color_deep,styles.font_size_14]}>FlatList Test</Text>
                            <Icon name='ios-arrow-forward-outline' size={24} color={Colors.grey}/>
                        </Button>
                        <Button type='submit' style={styles.list_btn} onPress={()=>{
                            this._gotoPage('ShoppingCart');
                        }}>
                            <Text style={[styles.flex_1, styles.color_deep,styles.font_size_14]}>Simple Shopping Cart</Text>
                            <Icon name='ios-arrow-forward-outline' size={24} color={Colors.grey}/>
                        </Button>
                    </Module>

                    <Module title='mobx vote'>
                        <Vote data={vote_json}/>
                    </Module>

                    <Module title='mobx time'>
                        <DateClock />
                        <Clock />
                        <CycleProgress />
                    </Module>

                    <Module title='mobx base'>
                        <View style={[styles.flex_row, styles.align_center, styles.flex_wrap, styles.margin_bottom_10]}>
                            <Stepper disabled={false} maxValue={10} minValue={0} style={styles.stepper} onChanged={this._onChanged}>
                                <Button style={[styles.stepper_btn, styles.left_btn]} renderDisabled={()=>{
                                    return (
                                        <View style={[styles.stepper_btn_disabled, styles.left_btn]}>
                                            <Icon name='ios-remove' size={24} color={Colors.gray}/>
                                        </View>
                                    );
                                }}>
                                    <Icon name='ios-remove' size={24} color={Colors.pink}/>
                                </Button>
                                <TextInput style={styles.stepper_input} value={`${this.counter}`} />
                                <Button style={[styles.stepper_btn, styles.right_btn]} renderDisabled={()=>{
                                    return (
                                        <View style={[styles.stepper_btn_disabled, styles.right_btn]}>
                                            <Icon name='ios-add' size={24} color={Colors.gray}/>
                                        </View>
                                    );
                                }}>
                                    <Icon name='ios-add' size={24} color={Colors.pink}/>
                                </Button>
                            </Stepper>
                            <Button onPress={this._getValue} style={[styles.btn_default, styles.margin_left_5]} elementId={'btn1'} >
                                <Text style={[styles.color_deep,styles.font_size_14]}>Get Counter</Text>
                            </Button>
                            <Text style={[styles.stepper_txt]}>{`${this.counter2}`}</Text>
                            <Stepper disabled={false} initValue={0} maxValue={9999} minValue={0} style={styles.stepper} onChanged={this._onChanged2}>
                                <Button style={[styles.stepper_btn, styles.left_btn, ]} renderDisabled={()=>{
                                    return (
                                        <View style={[styles.stepper_btn_disabled, styles.left_btn]}>
                                            <Icon name='ios-remove' size={24} color={Colors.gray}/>
                                        </View>
                                    );
                                }}>
                                    <Icon name='ios-remove' size={24} color={Colors.pink}/>
                                </Button>
                                <Button style={[styles.stepper_btn, styles.right_btn]} renderDisabled={()=>{
                                    return (
                                        <View style={[styles.stepper_btn_disabled, styles.right_btn]}>
                                            <Icon name='ios-add' size={24} color={Colors.gray}/>
                                        </View>
                                    );
                                }}>
                                    <Icon name='ios-add' size={24} color={Colors.pink}/>
                                </Button>
                            </Stepper>
                        </View>
                        <Text
                            style={[styles.item, ttl.done && styles.done]}
                            onPress={this._onPress}>
                            {ttl.text}
                        </Text>

                    </Module>



                </ScrollView>
            </View>
        );
    }

    _getCode=()=>{
        //..
        this.countdown.start(60);
    }

    _onToggle=(evt)=>{
        this.setState({secure:!this.state.secure})
    }

    _submitSuccess=(info)=>{
        this.validate.clear();

        //TODO:跳转页面或处理数据
        //..
    }

    _getValidStyle=(name)=>{
        if(this.validate[name]==='')
        {
            return {borderColor: Colors.light};
        }
        else{
            if(this.validate[camelcase('validate','error',name)]){
                return {borderColor: Colors.orange};
            }
            else return {borderColor: Colors.green};
        }
    }

    _onChanged=(value)=>{
        try {
            this.counter = parseInt(value);
        } catch (err) {

        }
    }


    _onChanged2=(value)=>{
        try {
            this.counter2 = parseInt(value);
        } catch (err) {

        }
    }

    _getValue=()=>{
        alert(this.counter)
    }

    _onPress = () => {
        const { ttl } = this.props;
        ttl.done = !ttl.done;
    };

    _gotoPage=(title, passProps=null, component=null)=>{
        requestAnimationFrame(()=>{
            this.props.navigator.push({title, passProps, component});
        })
    }
}


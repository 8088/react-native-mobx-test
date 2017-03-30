import React, {Component,PropTypes} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Easing,
    Animated,
    StatusBar,
    Dimensions,
    TouchableOpacity
} from 'react-native';
var window = Dimensions.get('window');

var screen_w = window.width;
var screen_h = window.height;
var outInFinished = false;
var TIMING = {
        BG:600,
        OUT:500,
        SACLe:500,
    }
export default class AppCover extends Component {


    static propTypes = {
        callback: PropTypes.func,
    };
    static defaultProps = {
        callback: ()=>{return true;},
    };    

    constructor(props) {
        super(props);
        this.state = {
            animDown: new Animated.Value(0),
            animUp:new Animated.Value(0),
            fadeIn: new Animated.Value(0),
            animOut: new Animated.Value(0),
            time:3,
            fadeOut:{},
            height:screen_h,
            width:screen_w,
            animatedFrom:230,

        };
    }

    componentDidMount() { 
        outInFinished = false;
        this.animDown();
    }

    animDown=()=>{
        Animated.spring(this.state.animDown, {toValue: 1500,easing: Easing.linear,friction: 20}).start();
        Animated.timing(this.state.fadeIn, {toValue: TIMING.BG,duration: TIMING.BG}).start();

        this.state.animDown.addListener(this.onAnimatedDownCompleted);        
    }

    animUp=()=>{

        Animated.timing(this.state.animUp, {toValue: TIMING.OUT, duration: TIMING.OUT}).start();

        this.state.animUp.addListener(this.onAnimatedUpCompleted);        
        this.setState({
            fadeOut:this.fadeOut(0,this.state.animatedFrom),
        })           
    }

    componentWillUnmount() {
        clearInterval(this.timmer);
        this.state.animDown.removeAllListeners();
        this.state.animUp.removeAllListeners();
        this.state.fadeIn.removeAllListeners();
        this.state.animOut.removeAllListeners();
        

    }

    onAnimatedDownCompleted = (value)=> { 
        if(outInFinished)  return;
        if (Math.ceil(value.value) === 1497) {
            outInFinished=true;
            var t = this.state.time;
            this.timmer=setInterval(()=>{
                this.setState({
                    time:t--
                });
                if(t==0){
                    this.animUp();
                    clearInterval(this.timmer)
                }
            },1000)
        }
    }

    onAnimatedUpCompleted = (value)=>{
        if (value.value === 500) {            
            Animated.timing(this.state.animOut, {toValue: TIMING.SACLe, duration: TIMING.SACLe}).start();
            this.state.animOut.addListener(this.onAnimOutCompleted); 
        }          
    }
    onAnimOutCompleted =(value)=>{
        if (value.value === TIMING.SACLe) {
            this.props.callback();    
        }            
    }

    guidSkip = ()=>{ 
        this.animUp(); 
    }
    _onLayout=(evt)=>{
        if(this.unmounting) return;
        if (evt.nativeEvent&&evt.nativeEvent.layout) {
            var cur_height = evt.nativeEvent.layout.height;
            if(cur_height !== this.state.height){
                this.setState({
                    height:evt.nativeEvent.layout.height,
                    width:evt.nativeEvent.layout.width, 
                    animatedFrom:(evt.nativeEvent.layout.height<evt.nativeEvent.layout.width)?100:230,
                })
            }
        }
    }
    render() {
        return (
            <View style={[{flex: 1,backgroundColor: '#FFF'}]} onLayout={this._onLayout}>
                <StatusBar backgroundColor='transparent' hidden={true} translucent={true} barStyle='default'/>
                <Animated.View style={[styles.bg,this.opacity(0,0.8,0.4)]}>
                <Animated.Image resizeMode='cover' style={[ styles.cover,this.sacle(0,1.2),{width:this.state.width,height:this.state.height}]}
                               source={require('./../assets/cover_bg.png')}>
                </Animated.Image>
                </Animated.View>
                <View style={[styles.container]}>
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center',}}>
                        <Animated.View style={[this.fadeIn(300, 0),this.animate(1300,this.state.animatedFrom),this.state.fadeOut]}>
                        <TouchableOpacity onPress={this.guidSkip}>
                        <Animated.Image resizeMode='cover'  style={[styles.logo,this.opacity(0,1,0.4)]} source={require('./../assets/cover_logo.png')}/>
                        </TouchableOpacity>
                        </Animated.View>
                    </View>
                    <View style={{height: 50,backgroundColor:'transparent'}}>
                        <Animated.Text style={[styles.info, this.fadeIn(300, 10)]}>
                           点击图标跳过  {this.state.time}秒
                        </Animated.Text>
                    </View>                
                </View>
            </View>
        );
    }

    fadeIn(delay, from = 0) {
        const {fadeIn} = this.state;
        return {
            opacity: fadeIn.interpolate({
                inputRange: [delay, Math.min(delay + 100, TIMING.BG)],
                outputRange: [0, 1],
                extrapolate: 'clamp',
            }),

          
        };
    }
    fadeOut(delay, from = 0) {
        const {animUp} = this.state;
        return {
            transform: [{
                translateY: animUp.interpolate({
                    inputRange: [delay, Math.min(delay + 200, TIMING.OUT)],
                    outputRange: [from,0],
                    extrapolate: 'clamp',
                }),
            }],          
        };
    }      
    animate(delay, from = 0) {
        const {animDown} = this.state;
        return {
            transform: [{
                translateY: animDown.interpolate({
                    inputRange: [delay, Math.min(delay + 500, 1500)],
                    outputRange: [ 0,from],
                    extrapolate: 'clamp',
                }),
            }],          
        };
    }
    sacle(delay, from = 0) {
        const {animOut} = this.state;
        return {
            transform: [{
                scale: animOut.interpolate({
                    inputRange: [delay, Math.min(delay + 200, TIMING.SACLe)],
                    outputRange: [ 1,from],
                    extrapolate: 'clamp',
                }),
            }],          
        };
    }    

    opacity(delay, from = 0,to) {
        const {animOut} = this.state;
        return {
            opacity: animOut.interpolate({
                inputRange: [delay, Math.min(delay + 100, TIMING.SACLe)],
                outputRange: [from, to],
                extrapolate: 'clamp',
            }),        
        };
    }    

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
        width: undefined,
        height: undefined,
        flexDirection: 'column',
    },
    bg: {
        position:'absolute',
        left:0,
        top:0,
        width:screen_w,
        height:screen_h,        
        flex: 1,
        backgroundColor: 'transparent',
        width: undefined,
        height: undefined,
        flexDirection: 'column',
        opacity:0.8
    }, 
    cover:{
        width:screen_w,
        height:screen_h,        
    },  
    logo: {
        alignSelf: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        marginBottom: 10,
        height: 100,
        width: 100,
    },
    info: {
        marginTop: 10,
        fontSize: 18,
        color: '#fff',
        fontWeight:'bold',
        textAlign: 'center',
    },
});
import React, {Component,PropTypes} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    StatusBar,
    AsyncStorage,
    Dimensions,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import SlideBox from '../components/SlideBox';
import Button from '../components/Button';
import Colors from '../assets/Colors';

var window = Dimensions.get('window');
var screen_w = window.width;
var screen_h = window.height;
var IMGS = [
    'https://images.unsplash.com/photo-1441126270775-739547c8680c?h=1024',
    'https://images.unsplash.com/photo-1440964829947-ca3277bd37f8?h=1024',
    'https://images.unsplash.com/photo-1440847899694-90043f91c7f9?h=1024'
];

export default class FirstGuide extends Component {
    static propTypes = {
        callback: PropTypes.func,
    };
    static defaultProps = {
        callback: ()=>{return true;},
    };  
    componentDidMount(){
        AsyncStorage.setItem('firstGuide','1',(e)=>{});
        AsyncStorage.setItem('appVersion',DeviceInfo.getVersion(),(e)=>{});

    }

    render() {
        return (
            <View style={{flex:1}}>
                <StatusBar backgroundColor='transparent' hidden={true} translucent={true} barStyle='default'/>
                <SlideBox style={styles.wrapper} autoplay={false} dotColor={Colors.main}>
                    <View style={[styles.slide]}>
                        <View style={[styles.bg]}>
                            <Image resizeMode='cover' style={styles.image} source={require('./../assets/guide_01.jpg')}/>
                        </View>
                    </View>
                    <View style={[styles.slide]}>
                        <View style={[styles.bg]}>
                            <Image resizeMode='cover' style={styles.image} source={require('./../assets/guide_02.jpg')}/>
                        </View>
                    </View>
                    <View style={[styles.slide]}>
                        <View style={[styles.bg]}>
                            <Image resizeMode='cover' style={styles.image} source={require('./../assets/guide_03.jpg')}/>
                        </View>
                    </View>
                    <View style={[styles.slide]}>
                        <View style={[styles.bg]}>
                            <Image resizeMode='cover' style={styles.image} source={require('./../assets/guide_04.jpg')}/>
                        </View>
                        <Button style={styles.button}
                                onPress={() =>  this.props.callback()}>
                            <Text style={styles.button_lable}>开启美丽之路</Text>
                        </Button>

                    </View>
                </SlideBox>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
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
        opacity:0.7
    },    
    slide: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    image: {
        width:screen_w,
        height:screen_h,
    },
    button: {
        backgroundColor: 'rgb(255, 120, 150)',
        borderWidth: 1,
        borderColor: 'pink',
        borderRadius: 20,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
        marginBottom:50,
    },
    button_lable: {
        color: '#fff',
        fontSize: 18,
    }
});

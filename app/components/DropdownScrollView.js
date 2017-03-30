/**
 * 自定义下拉刷新ScrollView控件
 *
 * @flow
 */
'use strict';
import React, { PureComponent, PropTypes} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Platform,
    Dimensions,
    PanResponder,
    LayoutAnimation,
} from 'react-native';

export default class DropdownScrollView extends PureComponent {
    static propTypes = {
        elementType: PropTypes.string,
        elementId: PropTypes.any,
    };

    static defaultProps = {
        elementType: 'DropdownScrollView',
        elementId: null,
    };

    constructor(props){
        super(props);
        this.draging = false;
        this.state = {
            //
        };

    }

    componentWillMount() {
        this._panResponder=PanResponder.create({
            onStartShouldSetPanResponder: this._handleStartShouldSetPanResponder,
            onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder,
            onPanResponderGrant: this._handlePanResponderGrant,
            onPanResponderMove: this._handlePanResponderMove,
            onPanResponderRelease: this._handlePanResponderEnd,
            onPanResponderTerminate: this._handlePanResponderEnd,
        });
    }

    render() {

        return (
            <View style={{flex:1, position:'relative'}}>
                <View style={{position:'absolute',}}>
                    <View style={{justifyContent:'center',alignItems:'center',width:deviceWidth,height:REFRESH_PULL_LENGTH,flexDirection:'row'}}>
                        <View style={{height:REFRESH_PULL_LENGTH,justifyContent:'center',alignItems:'center',marginLeft:10}}>
                            <Text style={{fontSize:12,color:'#666',marginBottom:1}}>{pullText}</Text>
                        </View>
                    </View>
                </View>
                <View
                    ref={PULL_REFRESH_LAYOUT}
                    style={{flex:1,position:'absolute'}}  {...this._panResponder.panHandlers} >
                    {this.props.children}
                </View>
            </View>
        );

    }

    _handleStartShouldSetPanResponder=()=>{ return true; }

    _handleMoveShouldSetPanResponder=()=>{ return true; }

    _handlePanResponderGrant=()=>{ }

    _handlePanResponderMove=(evt, gestureState)=>{
        if(this.state.currentDistance>REFRESH_PULL_LENGTH){
            if(this.state.showPullStatus===ShowLoadingStatus.SHOW_DOWN){
                this.setState({
                    showPullStatus:ShowLoadingStatus.SHOW_UP,
                });
            }
        }
        else{
            if (this.state.showPullStatus===ShowLoadingStatus.SHOW_UP){
                this.setState({
                    showPullStatus:ShowLoadingStatus.SHOW_DOWN,
                });
            }
        }
        if (this.state.pullRefreshStatus===RefreshStatus.Refresh_Loading){
            this.setState({
                currentDistance:REFRESH_PULL_LENGTH+gestureState.dy/factor,
                // refreshStateHeader:2,
            });
            this.refs[PULL_REFRESH_LAYOUT].setNativeProps({
                style:{
                    marginTop:this.state.currentDistance,
                }
            });
            return;
        }
        if (gestureState.dy>0&&this.state.currentDistance<MAX_PULL_LENGTH){
            this.setState({
                currentDistance:gestureState.dy/factor,
                pullRefreshStatus:RefreshStatus.Refresh_Drag_Down,
            });
            this.refs[PULL_REFRESH_LAYOUT].setNativeProps({
                style:{
                    marginTop:this.state.currentDistance,
                }
            });
        }
        else if(gestureState.dy>0&&this.state.currentDistance>MAX_PULL_LENGTH){//则不再往下移动
            this.setState({
                currentDistance:MAX_PULL_LENGTH,
                pullRefreshStatus:RefreshStatus.Refresh_Drag_Down,
            });
            this.refs[PULL_REFRESH_LAYOUT].setNativeProps({
                style:{
                    marginTop:this.state.currentDistance,
                }
            });
        }
    }

    _handlePanResponderEnd=()=>{
        if (this.state.currentDistance>=REFRESH_PULL_LENGTH){
            this._refreshStateHeader();
        }
        else{
            this._resetHeader();
        }
    }

    _resetHeader=()=>{
        LayoutAnimation.configureNext({
            duration: BACK_TIME,
            update: {
                type: 'linear',
            }
        });
        this.refs[PULL_REFRESH_LAYOUT].setNativeProps({
            style:{
                marginTop:0,
            }
        });
        this.setState({
            currentDistance:0,
            pullRefreshStatus:RefreshStatus.Refresh_Reset,
            showPullStatus:ShowLoadingStatus.SHOW_DOWN,
        });
    }

    _refreshStateHeader=()=>{
        this.setState({
            pullRefreshStatus:RefreshStatus.Refresh_Loading,
            currentDistance:REFRESH_PULL_LENGTH,
            showPullStatus:ShowLoadingStatus.SHOW_LOADING,
        },()=>{
            if(this.props.onRefresh){
                this.props.onRefresh();
            }
        });
        LayoutAnimation.configureNext({
            duration: BACK_TIME,
            update: {
                type: 'linear',
            }
        });
        this.refs[PULL_REFRESH_LAYOUT].setNativeProps({
            style:{
                marginTop:REFRESH_PULL_LENGTH,
            }
        });
    }

}

const styles = StyleSheet.create({
    refresh:{
        position:'absolute',
        top:-69,
        left:0,
        right:0,
        height:70,
        backgroundColor:'#fafafa',
        alignItems:'center',
        justifyContent:'flex-end'
    },

});
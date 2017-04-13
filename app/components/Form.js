/**
 * 自定义表单
 * TODO:
 *    1、表单样式布局完全由外部定义
 *    /////////2、如果有验证器 则验证表单输入项, 验证通过则启用提交按钮
 *    3、提取表单用户输入以GET或POST方式发送到ACTION地址 并回调返回结果
 *
 * @flow
 */
'use strict';
import React, {Component, PureComponent, PropTypes } from 'react';
import {
    View,
    Text,
    TextInput,
} from 'react-native';
import camelcase from 'camelcase';
import { observer } from 'mobx-react/native';
import { observable, computed, outrun, action, useStrict, toJS } from 'mobx';
import Network from '../mixins/Network';

@observer
export default class Form extends Component {
    static propTypes = {
        action: PropTypes.string,
        method: PropTypes.string,
        validate: PropTypes.object,
        callback: PropTypes.func,
        style: View.propTypes.style,
    };
    static defaultProps = {
        action: null,
        method: 'GET',
        validate: null,
        callback: (info)=>{},
    };

    render() {
        var { style, children, }= this.props;
        return (
            <View style={style}>
                {this._createElement(children)}
            </View>
        );
    }

    _createElement=(elements)=>{
        return React.Children.map(elements, (element, index) => {
            if (typeof element !== 'object') return element;

            const _type = element.props.type;
            const _name = element.props.name;
            const _isTextInput = element.type.displayName==='TextInput';

            // console.log(element);
            let props = {};

            if(_isTextInput&&_name)
            {
                props.value= this.props.validate[_name];
                props.onChangeText = (text)=>{
                    this.props.validate[_name] = text;
                    this.props.validate.errorinfo = '';
                }
                props.onBlur = ()=>{
                    this.props.validate.errorinfo = '';
                    if(props.value!=='') this.props.validate.errorinfo = this.props.validate[camelcase('validate','error', _name)] || '';
                }
            }

            if(_type==='submit')
            {
                props.onPress = (evt)=>{

                    this._onSubmit();

                    const _onPress = element.props.onPress;
                    if (typeof _onPress === 'function') {
                        _onPress(evt)
                    }
                };

            }
            return React.cloneElement(element, {
                ...props,
                children: this._createElement(element.props.children)
            })
        });
    };

    _onSubmit=()=>{
        const {
            action,
            method,
            callback,
        }=this.props;

        var data = toJS(this.props.validate);
        // console.log(JSON.stringify(data));
        if(method.toUpperCase()==='GET') Network.get(action, data, callback);

        if(method.toUpperCase()==='POST') Network.post(action, data, callback);
    }
}
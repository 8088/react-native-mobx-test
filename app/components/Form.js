/**
 * 表单
 *
 * @flow
 */
'use strict';
import React, { PureComponent, PropTypes } from 'react';
import {
    View,
    Text,
    TextInput,
} from 'react-native';

export default class Form extends PureComponent {
    static propTypes = {
        action: PropTypes.string,
        method: PropTypes.string,
        validate: PropTypes.object,
        children: PropTypes.element.isRequired,
        style: View.propTypes.style,
    };

    static childContextTypes = {
        validate: PropTypes.object,
    };

    getChildContext() {
        return {
            validate: this.props.validate,
        };
    }
    render() {
        var { style, children, }= this.props;
        return (
            <View style={style}>
                {children}
            </View>
        );
    }
}
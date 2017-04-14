import React, { PropTypes, Component } from 'react';

import {
    View,
    StyleSheet,
    ListView,
    Text,
    Image,
    FlatList,
    TextInput,
    TouchableHighlight,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { observable, action, computed } from 'mobx';
import { observer } from 'mobx-react/native';
import Topbar from '../../modules/Topbar';
import Button from '../../components/Button';
import Stepper from '../../components/Stepper';
import Colors from '../../assets/Colors';

class ItemData {

    image=''
    title = '';
    info = '';
    price = 0;
    key= '';

    @observable
    count = 0;

    constructor(item) {
        this.image = item.image;
        this.title = item.title;
        this.info = item.info;
        this.price = item.price;
        this.key = item.key;
    }

    @action
    inc = () => {
        ++this.count;
    }

    @action
    dec = () => {
        if (this.count > 0) {
            --this.count;
        }
    }
};

class ListData {

    @observable
    items = [];

    constructor() {
        for (let i = 0; i < 10; i++) {
            var temp = {
                image: '',
                title: `商品名称${i}`,
                info: `商品简介${i}商品简介商品简介商品简介${i}`,
                price: Math.floor(Math.random() * 10000)/100,
                key: String(i),
            }
            this.items.push(new ItemData(temp));
        }
    }

    @computed
    get count() {
        return this.items.reduce((a, b) => a + b.count, 0);
    }

    @computed
    get price() {
        return this.items.reduce((a, b) => a + (b.price * b.count), 0);
    }
}

@observer
class Item extends Component {
    static propTypes = {
        data: PropTypes.instanceOf(ItemData),
        onPress: PropTypes.func,
    };

    static defaultProps = {
        data: {},
        onPress: (key) => {},
    };

    render() {
        const { data, onPress } = this.props;
        return (
            <View style={styles.row}>
                <View style={styles.thumb} source={{uri:data.image}} />
                <View style={{flex:1, marginLeft:10,}}>
                    <View style={{flex:1, flexDirection:'row'}}>
                        <View style={{flex:1}}>
                            <Text style={styles.title}>{data.title}</Text>
                            <Text style={styles.text}>{data.info}</Text>
                        </View>
                        <View style={{justifyContent:'flex-end',height:26,}}>
                            <Text style={{fontSize:12, color:Colors.red}}>￥<Text style={{fontSize:24}}>{data.price}</Text></Text>
                        </View>
                    </View>


                    <View>
                        <Stepper disabled={false} maxValue={99} minValue={0} style={[styles.stepper,{alignSelf:'flex-end'}]} onChanged={this._onChanged}>
                            <Button style={[styles.stepper_btn, styles.left_btn]} renderDisabled={()=>{
                                return (
                                    <View style={[styles.stepper_btn_disabled, styles.left_btn]}>
                                        <Icon name='ios-remove' size={24} color={Colors.gray}/>
                                    </View>
                                );
                            }}>
                                <Icon name='ios-remove' size={24} color={Colors.pink}/>
                            </Button>
                            <TextInput style={styles.stepper_input} value={`${data.count}`} />
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
                </View>



            </View>
        );
    }

    _onChanged=(num)=>{
        this.props.data.count = num;
    }
};

const Bottombar = observer(function({data}) {
    return (
        <View style={styles.bottombar}>
            <Text style={{flex:1, textAlign:'right', paddingRight:10,}}>
                合计: <Text style={{fontSize:12, color:Colors.red}}>￥<Text style={{fontSize:28}}>{data.price.toFixed(2)}</Text></Text> {'\n'}
                <Text style={{color:Colors.deep}}>总共购买 {`${data.count}`} 件物品</Text>
            </Text>
            <Button disabled={data.count===0} style={[styles.center,{flex:1, width:100, backgroundColor: Colors.red}]} renderDisabled={()=>{
                return (
                    <View style={[styles.center,{flex:1, width:100, backgroundColor: Colors.gray}]}>
                        <Text style={{color:'white', fontSize:20}}>结算</Text>
                    </View>
                );
            }}>
                <Text style={{color:'white', fontSize:20}}>结算</Text>
            </Button>
        </View>
    );
});

class Separator extends React.PureComponent {
    render() {
        return <View style={styles.separator} />;
    }
}
class ListHeader extends React.PureComponent {
    render() {
        return (
            <View style={{flex:1}}>
                <View style={{height:30, justifyContent:'center', paddingLeft:10,}}>
                    <Text>-- 简单模拟购物车 --</Text>
                </View>
                <Separator />
            </View>
        );
    }
}

class ListFooter extends React.PureComponent {
    render() {
        return (
            <View style={{flex:1}}>
                <Separator />
                <View style={[styles.center,{height:50}]}>
                    <Text>-- xxxxxx --</Text>
                </View>
            </View>
        );
    }
}

export default class ShoppingCart extends Component {

    _listData = new ListData();

    render() {
        return (
            <View style={styles.container}>
                <Topbar {...this.props} color='#000000' backgroundColor='white'/>
                <FlatList
                    ItemSeparatorComponent={this._ItemSeparatorComponent}
                    ListHeaderComponent={ListHeader}
                    ListFooterComponent={ListFooter}
                    data={this._listData.items}
                    keyboardShouldPersistTaps="always"
                    keyboardDismissMode="on-drag"
                    legacyImplementation={false}
                    numColumns={1}
                    refreshing={false}
                    renderItem={this._renderItem}
                    contentContainerStyle={styles.list}
                />
                <Bottombar data={this._listData} />
            </View>
        );
    }

    _ItemSeparatorComponent=()=>{
        return <View style={styles.item_separator}/>;
    }

    _renderItem = ({item, separators}) => {
        return (
            <Item
                data={item}
                onPress={this._pressItem}
            />
        );
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    center: {
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    separator: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#eee',
    },
    item_separator:{
        height: StyleSheet.hairlineWidth,
        backgroundColor: 'rgb(200, 199, 204)',
        marginLeft: 10,
    },
    spindicator: {
        marginLeft: 10,
        width: 2,
        height: 16,
        backgroundColor: '#FFB8C6',
    },
    option: {
        flexDirection: 'row',
        padding: 8,
        paddingRight: 0,
    },
    item: {
        flex: 1,
    },
    row: {
        flex:1,
        flexDirection: 'row',
        padding: 10,
    },
    title:{
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    text: {
        flex: 1,
        color:Colors.deep,
    },
    thumb: {
        width: 90,
        height: 120,
        backgroundColor: '#ccc',
    },


    //stepper
    stepper:{
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#FFB8C6',
        justifyContent: 'flex-start',
        alignItems: 'center',
        alignSelf:'flex-start',
        flexDirection: 'row',
        backgroundColor: '#fff',
    },
    stepper_btn:{
        borderRadius: 3,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF1F2',
        paddingHorizontal: 8,
        paddingTop:1,
    },
    stepper_btn_disabled:{
        borderRadius: 3,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF7F8',
        paddingHorizontal: 8,
        paddingTop:1,
    },
    left_btn:{
        borderBottomRightRadius:0,
        borderTopRightRadius:0,
    },
    right_btn:{
        borderBottomLeftRadius:0,
        borderTopLeftRadius:0,
    },
    stepper_txt:{
        justifyContent: 'center',
        alignItems: 'center',
        flex:1,
        textAlign:'center',
        color: '#777',
        fontSize: 20,
    },
    stepper_input:{
        justifyContent: 'center',
        alignItems: 'center',
        width: 30,
        textAlign:'center',
        color: '#777',
    },


    bottombar:{
        height:56,
        backgroundColor:'#fff',
        borderTopWidth:1,
        borderTopColor:'#eee',
        flexDirection: 'row',
    }
});

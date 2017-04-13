import React, { PropTypes, Component } from 'react';
import {
    View,
    Text,
    Image,
    Animated,
    FlatList,
    StyleSheet,
    TouchableHighlight,
} from 'react-native';

import { observer } from 'mobx-react/native';

import PageList from './PageList';
import Topbar from '../../modules/Topbar';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
const VIEWABILITY_CONFIG = {
    minimumViewTime: 3000,
    viewAreaCoveragePercentThreshold: 100,
    waitForInteraction: true,
};
const LOREM_IPSUM = '电影讲述1933年的美国，一名勇于冒险的企业家及电影制作者，率领摄制队伍到荒岛拍摄，\
其中包括女主角安及编剧杰克，他们遇到恐龙及当地土著的袭击，安发出的尖叫声换来金刚的回应。这只巨大无比的猩猩，\
连凶悍的恐龙也惧怕它几分，偏偏它却钟情于安。安其后将金刚由荒岛带回纽约，但却是它悲剧命运的开始。';
const IMAGE_URL = 'https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=1720544554,1958448072&fm=58&s=A7080BE0FB1206DC08591106030080C2';

/* eslint no-bitwise: 0 */
function hashCode(str) {
    let hash = 15;
    for (let i = str.length - 1; i >= 0; i--) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
    }
    return hash;
}

function genItemData(count, start = 0) {
    const dataBlob = [];
    for (let i = start; i < count + start; i++) {
        const itemHash = Math.abs(hashCode('Item ' + i));
        dataBlob.push({
            title: 'Item ' + i,
            text: LOREM_IPSUM.substr(0, itemHash % 301 + 20),
            key: String(i),
            pressed: false,
        });
    }
    return dataBlob;
}

class Separator extends React.PureComponent {
    render() {
        return <View style={styles.separator} />;
    }
}
class Spindicator extends React.PureComponent {
    render() {
        return (
            <Animated.View style={[styles.spindicator, {
                transform: [
                    {rotate: this.props.value.interpolate({
                        inputRange: [0, 5000],
                        outputRange: ['0deg', '360deg'],
                        extrapolate: 'extend',
                    })}
                ]
            }]} />
        );
    }
}
class ListHeader extends React.PureComponent {
    render() {
        return (
            <View style={{flex:1}}>
                <View style={[styles.center, {height:50}]}>
                    <Text>-- list header --</Text>
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
                    <Text>-- list footer --</Text>
                </View>
            </View>
        );
    }
}

class ItemCard extends React.PureComponent {
    static propTypes = {
        item: PropTypes.object,
        onPress: PropTypes.func,
        onShowUnderlay: PropTypes.func,
        onHideUnderlay: PropTypes.func,
    };

    static defaultProps = {
        item: {},
        onPress: (key) => {},
        onShowUnderlay: () => {},
        onHideUnderlay: () => {},
    };

    render() {
        const {item} = this.props;
        const itemHash = Math.abs(hashCode(item.title));
        return (
            <TouchableHighlight
                onPress={this._onPress}
                onShowUnderlay={this.props.onShowUnderlay}
                onHideUnderlay={this.props.onHideUnderlay}
                style={styles.item}>
                <View style={styles.row}>
                    <Image style={styles.thumb} source={{uri:IMAGE_URL}} />
                    <Text style={styles.text}>
                        <Text style={styles.title}>{item.title}</Text> - {item.text}
                    </Text>
                </View>
            </TouchableHighlight>
        );
    }

    _onPress=()=>{
        this.props.onPress(this.props.item.key);
    };
}

@observer
export default class TestListPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: genItemData(100),
            filterText: '',
        };

        this._scrollPos = new Animated.Value(0);
        this._scrollSinkX = Animated.event(
            [{nativeEvent: { contentOffset: { x: this._scrollPos } }}],
            {useNativeDriver: true},
        );
        this._scrollSinkY = Animated.event(
            [{nativeEvent: { contentOffset: { y: this._scrollPos } }}],
            {useNativeDriver: true},
        );
    }



    render() {
        const filterRegex = new RegExp(String(this.state.filterText), 'i');
        const filter = (item) => (
            filterRegex.test(item.text) || filterRegex.test(item.title)
        );
        const filteredData = this.state.data.filter(filter);

        return (
            <View style={{flex:1}}>
                <Topbar {...this.props} color='#000000' backgroundColor='white'/>
                <AnimatedFlatList
                    ItemSeparatorComponent={this._ItemSeparatorComponent}
                    ListHeaderComponent={ListHeader}
                    ListFooterComponent={ListFooter}
                    data={filteredData}
                    keyboardShouldPersistTaps="always"
                    keyboardDismissMode="on-drag"
                    legacyImplementation={false}
                    numColumns={1}
                    onEndReached={this._onEndReached}
                    onRefresh={this._onRefresh}
                    onScroll={this.state.horizontal ? this._scrollSinkX : this._scrollSinkY}
                    onViewableItemsChanged={this._onViewableItemsChanged}
                    refreshing={false}
                    renderItem={this._renderItem}
                    contentContainerStyle={styles.list}
                    viewabilityConfig={VIEWABILITY_CONFIG}
                />

                <Separator />
                <View style={styles.options}>
                    <Spindicator value={this._scrollPos} />
                </View>
            </View>
        );
    }

    _ItemSeparatorComponent=()=>{
        return <View style={styles.item_separator}/>;
    }

    _onEndReached = () => {
        if (this.state.data.length >= 1000) {
            return;
        }
        this.setState((state) => ({
            data: state.data.concat(genItemData(100, state.data.length)),
        }));
    };

    _onRefresh=()=>{
        alert('refresh');
    }

    _renderItem = ({item, separators}) => {
        return (
            <ItemCard
                item={item}
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
        marginLeft: 100,
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
        flexDirection: 'row',
        padding: 10,
        backgroundColor: 'white',
    },
    title:{
        fontWeight: 'bold',
    },
    text: {
        flex: 1,
    },
    thumb: {
        width: 90,
        height: 120,
        left: -5,
    },
});

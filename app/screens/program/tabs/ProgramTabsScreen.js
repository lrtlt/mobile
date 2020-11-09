import React, {useState} from 'react';
import {View, Dimensions, Text} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {ProgramItem} from '../../../components';
import Styles from './styles';
import {TabView, TabBar} from 'react-native-tab-view';
import EStyleSheet from 'react-native-extended-stylesheet';
import {getIconForChannelById} from '../../../util/UI';
import {ScrollView} from 'react-native-gesture-handler';

const renderTabLable = (props) => {
  const channelId = props.route.key;
  const title = props.route.title;
  return (
    <View style={Styles.centerContainer}>
      {getIconForChannelById(channelId)}
      <Text style={Styles.tabLable}>{title}</Text>
    </View>
  );
};

const renderTabBar = (props) => {
  return (
    <TabBar
      {...props}
      scrollEnabled={true}
      pressColor={EStyleSheet.value('androidTouchFeedback')}
      renderLabel={(labelProps) => renderTabLable(labelProps)}
      indicatorStyle={Styles.indicator}
      style={Styles.tabbar}
      tabStyle={Styles.tab}
    />
  );
};

const tabsScreen = (props) => {
  const [index, setIndex] = useState(0);

  const navigationState = {
    index,
    routes: props.program.map((channel) => {
      return {
        key: channel.channel_id,
        title: channel.title,
        program: channel.prog,
      };
    }),
  };

  const renderProgramItem = (val) => {
    const item = val.item;
    return (
      <View key={item.time_start + item.title}>
        <ProgramItem title={item.title} startTime={item.time_start} percent={item.proc} />
        <View style={Styles.separator} />
      </View>
    );
  };

  const renderScene = (props) => {
    if (Math.abs(index - navigationState.routes.indexOf(props.route)) > 0) {
      return <View />;
    }

    const prog = props.route.program;

    const scrollToIndex = prog.findIndex((i) => {
      const proc = Math.max(0, Math.min(Number(i.proc), 100));
      return proc < 100;
    });

    return (
      <View style={Styles.contentContainer}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={prog}
          renderItem={renderProgramItem}
          getItemLayout={(data, index) => ({length: 59, offset: 59 * index, index})}
          initialScrollIndex={scrollToIndex}
          keyExtractor={(item, index) => String(index) + String(item)}
        />
      </View>
    );
  };

  return (
    <View style={Styles.root}>
      <TabView
        navigationState={navigationState}
        swipeEnabled={true}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        lazy={true}
        onIndexChange={(i) => setIndex(i)}
        initialLayout={{width: Dimensions.get('window').width}}
      />
    </View>
  );
};

export default React.memo(tabsScreen);

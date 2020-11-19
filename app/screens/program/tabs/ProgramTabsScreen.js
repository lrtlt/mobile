import React, {useState} from 'react';
import {View, Dimensions, StyleSheet} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {ProgramItem, Text} from '../../../components';
import {TabView, TabBar} from 'react-native-tab-view';
import {getIconForChannelById} from '../../../util/UI';
import Divider from '../../../components/divider/Divider';
import {useTheme} from '../../../Theme';

const TabsScreen = (props) => {
  const [index, setIndex] = useState(0);

  const {colors} = useTheme();

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

  const renderTabLable = ({route}) => {
    const channelId = route.key;
    const title = route.title;
    return (
      <View style={styles.centerContainer}>
        {getIconForChannelById(channelId)}
        <Text style={styles.tabLable} scalingEnabled={false} type="secondary">
          {title}
        </Text>
      </View>
    );
  };

  const renderTabBar = (tabBarProps) => {
    return (
      <TabBar
        {...tabBarProps}
        scrollEnabled={true}
        pressColor={colors.androidTouchFeedback}
        renderLabel={(labelProps) => renderTabLable(labelProps)}
        indicatorStyle={{backgroundColor: colors.primary}}
        style={{backgroundColor: colors.background}}
        tabStyle={styles.tab}
      />
    );
  };

  const renderProgramItem = (val) => {
    const item = val.item;
    return (
      <View key={item.time_start + item.title}>
        <ProgramItem title={item.title} startTime={item.time_start} percent={item.proc} />
        <Divider />
      </View>
    );
  };

  const renderScene = ({route}) => {
    if (Math.abs(index - navigationState.routes.indexOf(route)) > 0) {
      return <View />;
    }

    const prog = route.program;

    const scrollToIndex = prog.findIndex((i) => {
      const proc = Math.max(0, Math.min(Number(i.proc), 100));
      return proc < 100;
    });

    return (
      <View>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={prog}
          renderItem={renderProgramItem}
          getItemLayout={(data, index) => ({length: 59, offset: 59 * index, index})}
          initialScrollIndex={scrollToIndex}
          keyExtractor={(item, i) => String(i) + String(item)}
        />
      </View>
    );
  };

  return (
    <View style={styles.root}>
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

export default TabsScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tab: {
    width: 140,
  },
  tabLable: {
    width: '100%',
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 10,
    textTransform: 'uppercase',
    paddingTop: 6,
  },
});

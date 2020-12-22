import React, {useState} from 'react';
import {View, Dimensions, StyleSheet} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {ProgramItem, Text} from '../../../components';
import {TabView, TabBar} from 'react-native-tab-view';
import {getIconForChannelById} from '../../../util/UI';
import Divider from '../../../components/divider/Divider';
import {useTheme} from '../../../Theme';

const TabsScreen = (props) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const {colors} = useTheme();

  const navigationState = {
    index: currentIndex,
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
      <View key={`${channelId}-${title}`} style={styles.centerContainer}>
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
      <View key={`${item.time_start}-${item.title}`}>
        <ProgramItem title={item.title} startTime={item.time_start} percent={item.proc} />
        <Divider style={styles.programItemDivider} />
      </View>
    );
  };

  const renderScene = ({route}) => {
    if (Math.abs(currentIndex - navigationState.routes.indexOf(route)) > 0) {
      return <View key={`${route.key}-foo`} />;
    }

    const prog = route.program;

    const scrollToIndex = prog.findIndex((i) => {
      const proc = Math.max(0, Math.min(Number(i.proc), 100));
      return proc < 100;
    });

    return (
      <View key={`${route.key}`}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={prog}
          renderItem={renderProgramItem}
          getItemLayout={(_, index) => ({length: 58, offset: 58 * index, index})}
          initialScrollIndex={scrollToIndex}
          contentContainerStyle={styles.scrollContainer}
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
        onIndexChange={(i) => setCurrentIndex(i)}
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
  scrollContainer: {
    minHeight: '100%',
  },
  programItemDivider: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

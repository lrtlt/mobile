import React, {useCallback, useMemo, useState} from 'react';
import {View, Dimensions, StyleSheet} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {ProgramItem, Text} from '../../../components';
import {TabView, TabBar} from 'react-native-tab-view';
import {getIconForChannelById} from '../../../util/UI';
import Divider from '../../../components/divider/Divider';
import {useTheme} from '../../../Theme';
import {ProgramItemType, SingleDayProgram} from '../../../api/Types';
import {Scene} from 'react-native-tab-view/lib/typescript/src/types';

interface Props {
  program: SingleDayProgram[];
}

type Route = {
  key: string;
  channelId: number;
  title: string;
  program: ProgramItemType[];
};

const TabsScreen: React.FC<Props> = ({program}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const {colors} = useTheme();

  const routes: Route[] = useMemo(() => {
    return program.map((channel, i) => {
      return {
        key: String(channel.channel_id || `unkown-channel-${i}`),
        channelId: channel.channel_id ?? -1,
        title: channel.title,
        program: channel.prog,
      };
    });
  }, [program]);

  const renderTabLable = useCallback(({route}: Scene<Route>) => {
    const {channelId, title} = route;
    return (
      <View key={`${channelId}-${title}`} style={styles.centerContainer}>
        {getIconForChannelById(channelId)}
        <Text style={styles.tabLable} scalingEnabled={false} type="secondary">
          {title}
        </Text>
      </View>
    );
  }, []);

  const renderTabBar = useCallback(
    (tabBarProps) => {
      return (
        <TabBar
          {...tabBarProps}
          scrollEnabled={true}
          pressColor={colors.androidTouchFeedback}
          renderLabel={renderTabLable}
          indicatorStyle={{backgroundColor: colors.primary}}
          style={{backgroundColor: colors.background}}
          tabStyle={styles.tab}
        />
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [renderTabLable],
  );

  const renderProgramItem = useCallback((val) => {
    const item = val.item;
    return (
      <View key={`${item.time_start}-${item.title}`}>
        <ProgramItem title={item.title} startTime={item.time_start} percent={item.proc} />
        <Divider style={styles.programItemDivider} />
      </View>
    );
  }, []);

  const keyExtractor = useCallback((item, i) => String(i) + String(item), []);

  const calculateProgramItemLayout = useCallback((_, index) => ({length: 58, offset: 58 * index, index}), []);

  const renderScene = useCallback(
    ({route}) => {
      if (Math.abs(currentIndex - routes.indexOf(route)) > 0) {
        return <View key={`${route.key}-foo`} />;
      }

      const programItems = (route as Route).program;

      const scrollToIndex = programItems.findIndex((i) => {
        const proc = Math.max(0, Math.min(Number(i.proc), 100));
        return proc < 100;
      });

      return (
        <View key={`${route.key}`}>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={programItems}
            renderItem={renderProgramItem}
            getItemLayout={calculateProgramItemLayout}
            initialScrollIndex={scrollToIndex}
            contentContainerStyle={styles.scrollContainer}
            keyExtractor={keyExtractor}
          />
        </View>
      );
    },
    [calculateProgramItemLayout, currentIndex, keyExtractor, renderProgramItem, routes],
  );

  return (
    <View style={styles.root}>
      <TabView
        navigationState={{
          index: currentIndex,
          routes: routes,
        }}
        swipeEnabled={true}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        lazy={true}
        onIndexChange={setCurrentIndex}
        initialLayout={{width: Dimensions.get('screen').width}}
      />
    </View>
  );
};

export default React.memo(TabsScreen);

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

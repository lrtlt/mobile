import React, {useCallback, useMemo, useState} from 'react';
import {View, Dimensions, StyleSheet} from 'react-native';
import {TabView, TabBar, TabViewProps} from 'react-native-tab-view';
import {getIconForChannelById} from '../../../util/UI';
import {useTheme} from '../../../Theme';
import {ProgramItemType, SingleDayProgram} from '../../../api/Types';
import {Scene} from 'react-native-tab-view/src/types';
import ProgramList from './ProgramList';

interface Props {
  program: SingleDayProgram[];
}

type Route = {
  key: string;
  channelId: number;
  title: string;
  program: ProgramItemType[];
};

const TabsScreen: React.FC<React.PropsWithChildren<Props>> = ({program}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const {colors} = useTheme();

  const routes: Route[] = useMemo(() => {
    return program.map((channel, i) => {
      return {
        key: String(channel.channel_id || `unknown-channel-${i}`),
        channelId: channel.channel_id ?? -1,
        title: channel.title,
        program: channel.prog,
      };
    });
  }, [program]);

  const renderTabLabel = useCallback(({route}: Scene<Route>) => {
    const {channelId, title} = route;
    return (
      <View key={`${channelId}-${title}`} style={styles.centerContainer}>
        {getIconForChannelById(channelId, {height: 24, width: 120})}
      </View>
    );
  }, []);

  const renderTabBar = useCallback(
    (tabBarProps: any) => {
      return (
        <TabBar
          {...tabBarProps}
          scrollEnabled={true}
          pressColor={colors.androidTouchFeedback}
          renderLabel={renderTabLabel}
          indicatorStyle={{backgroundColor: colors.primary}}
          style={{backgroundColor: colors.background}}
          tabStyle={styles.tab}
        />
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [renderTabLabel],
  );

  const renderScene: TabViewProps<Route>['renderScene'] = useCallback(
    ({route}) => {
      if (Math.abs(currentIndex - routes.indexOf(route)) > 0) {
        return <View key={`${route.key}-foo`} />;
      }

      const programItems = route.program;

      const currentProgramIndex = programItems?.findIndex((i) => {
        const proc = Math.max(0, Math.min(Number(i.proc), 100));
        return proc < 100;
      });

      const scrollToIndex = Math.max(currentProgramIndex, 0);

      return (
        <View key={`${route.key}`}>
          <ProgramList items={programItems || []} scrollToIndex={scrollToIndex} />
        </View>
      );
    },
    [currentIndex, routes],
  );

  return (
    <View style={styles.root}>
      <TabView
        navigationState={{
          index: currentIndex < 0 ? 0 : currentIndex,
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
});

import React, {useCallback, useEffect, useRef} from 'react';
import {View, RefreshControl, StyleSheet, StatusBar, ListRenderItemInfo} from 'react-native';
import {MyFlatList, ScreenLoader} from '../../../../components';
import {fetchAudioteka} from '../../../../redux/actions/index';
import {GEMIUS_VIEW_SCRIPT_ID, EVENT_LOGO_PRESS, ARTICLE_EXPIRE_DURATION} from '../../../../constants';
import {useDispatch, useSelector} from 'react-redux';
import Gemius from 'react-native-gemius-plugin';
import {EventRegister} from 'react-native-event-listeners';
import {useTheme} from '../../../../Theme';
import {selectAudiotekaScreenState} from '../../../../redux/selectors';
import {AudiotekaTemplate} from '../../../../api/Types';
import TopArticle from './components/topArticle/TopArticle';
import PodcastsBlock from './components/podcasts/PodcastsBlock';
import {SafeAreaView} from 'react-native-safe-area-context';
import CategoryBlock from './components/category/CategoryBlock';

import PopularBlock from './components/popular/PopularBlock';
import NewestBlock from './components/newest/NewestBlock';
import AudiotekaSearch from './components/search/AudiotekaSearch';
import {createNativeWrapper} from 'react-native-gesture-handler';

const WrappedRefreshControl = createNativeWrapper(RefreshControl, {
  disallowInterruption: true,
  shouldCancelWhenOutside: false,
});

interface Props {
  isCurrent: boolean;
}

const AudiotekaScreen: React.FC<Props> = ({isCurrent}) => {
  const dispatch = useDispatch();
  const listRef = useRef<MyFlatList>(null);
  const refreshRef = useRef(null);
  const {colors, dark} = useTheme();

  const state = useSelector(selectAudiotekaScreenState);
  const {refreshing, lastFetchTime, data} = state;

  useEffect(() => {
    Gemius.sendPartialPageViewedEvent(GEMIUS_VIEW_SCRIPT_ID, {
      page: 'audioteka',
    });
  }, []);

  useEffect(() => {
    const listener = EventRegister.addEventListener(EVENT_LOGO_PRESS, (_data) => {
      if (isCurrent) {
        listRef.current?.scrollToIndex({
          animated: true,
          index: 0,
        });
        dispatch(fetchAudioteka());
      }
    });
    return () => {
      EventRegister.removeEventListener(listener as string);
    };
  });

  useEffect(() => {
    if (isCurrent) {
      if (!refreshing && Date.now() - lastFetchTime > ARTICLE_EXPIRE_DURATION) {
        console.log('Audioteka data expired!');
        dispatch(fetchAudioteka());
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCurrent, refreshing, lastFetchTime]);

  const renderItem = useCallback((listItem: ListRenderItemInfo<AudiotekaTemplate>) => {
    const {item} = listItem;

    switch (item.template) {
      case 'top': {
        return <TopArticle article={item.article} />;
      }
      case 'newest': {
        return (
          <View>
            <AudiotekaSearch />
            <NewestBlock data={item} />
          </View>
        );
      }
      case 'podcasts': {
        return <PodcastsBlock data={item} />;
      }
      case 'popular': {
        return <PopularBlock data={item} />;
      }
      case 'category':
      case 'slug': {
        if (item.articles_list) {
          return <CategoryBlock data={item} />;
        } else {
          console.warn('No articles in audioteka slug category');
          return <View />;
        }
      }
      default: {
        console.warn('Uknown list item: ' + item);
        return <View />;
      }
    }
  }, []);

  if (data.length === 0) {
    return <ScreenLoader />;
  }

  return (
    <>
      <StatusBar
        barStyle={dark ? 'light-content' : 'dark-content'}
        translucent={false}
        backgroundColor={colors.statusBar}
      />
      <View style={styles.container}>
        <MyFlatList
          waitFor={refreshRef}
          shouldActivateOnStart
          showsVerticalScrollIndicator={false}
          style={styles.container}
          ref={listRef}
          extraData={{
            lastFetchTime: lastFetchTime,
          }}
          renderItem={renderItem}
          refreshControl={
            <WrappedRefreshControl
              ref={refreshRef}
              refreshing={refreshing}
              onRefresh={() => dispatch(fetchAudioteka())}
            />
          }
          data={data}
          removeClippedSubviews={false}
          windowSize={4}
          updateCellsBatchingPeriod={20}
          maxToRenderPerBatch={2}
          ListFooterComponent={<SafeAreaView edges={['bottom']} />}
          initialNumToRender={6}
          keyExtractor={(item, index) => String(index) + String(item)}
        />
      </View>
    </>
  );
};

export default AudiotekaScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

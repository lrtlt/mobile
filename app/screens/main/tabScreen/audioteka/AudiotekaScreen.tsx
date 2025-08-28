import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {View, RefreshControl, StyleSheet, StatusBar} from 'react-native';
import {ScreenLoader} from '../../../../components';
import {EVENT_LOGO_PRESS, ARTICLE_EXPIRE_DURATION} from '../../../../constants';
import Gemius from 'react-native-gemius-plugin';
import {EventRegister} from 'react-native-event-listeners';
import {useTheme} from '../../../../Theme';
import {FlashList, FlashListRef, ListRenderItemInfo} from '@shopify/flash-list';
import {AudiotekaTemplate} from '../../../../api/Types';
import TopArticle from './components/topArticle/TopArticle';
import PodcastsBlock from './components/podcasts/PodcastsBlock';
import {SafeAreaView} from 'react-native-safe-area-context';
import CategoryBlock from './components/category/CategoryBlock';

import PopularBlock from './components/popular/PopularBlock';
import NewestBlock from './components/newest/NewestBlock';
import AudiotekaSearch from './components/search/AudiotekaSearch';
import TopFeedBlock from '../home/blocks/TopFeedBlock/TopFeedBlock';
import TopUrlBlock from '../home/blocks/TopUrlBlock/TopUrlBlock';
import useAppStateCallback from '../../../../hooks/useAppStateCallback';
import useNavigationAnalytics from '../../../../util/useNavigationAnalytics';
import {ArticleState, useArticleStore} from '../../../../state/article_store';
import {useShallow} from 'zustand/shallow';
import Config from 'react-native-config';

interface Props {
  isCurrent: boolean;
}

const selectAudiotekaScreenState = (state: ArticleState) => {
  const block = state.audioteka;
  return {
    refreshing: block.isFetching && block.data.length > 0,
    lastFetchTime: block.lastFetchTime,
    data: block.data,
  };
};

const AudiotekaScreen: React.FC<React.PropsWithChildren<Props>> = ({isCurrent}) => {
  const listRef = useRef<FlashListRef<any>>(null);
  const {colors, dark} = useTheme();

  const {fetchAudioteka} = useArticleStore.getState();
  const state = useArticleStore(useShallow(selectAudiotekaScreenState));
  const {refreshing, lastFetchTime, data} = state;

  useEffect(() => {
    Gemius.sendPartialPageViewedEvent(Config.GEMIUS_VIEW_SCRIPT_ID, {
      page: 'audioteka',
    });
  }, []);

  useNavigationAnalytics({
    viewId: 'https://www.lrt.lt/radioteka',
    title: 'Radioteka - LRT',
    sections: ['Radioteka_home'],
  });

  useEffect(() => {
    const listener = EventRegister.addEventListener(EVENT_LOGO_PRESS, (_data) => {
      if (isCurrent) {
        listRef.current?.scrollToIndex({
          animated: true,
          index: 0,
        });
        fetchAudioteka();
      }
    });
    return () => {
      EventRegister.removeEventListener(listener as string);
    };
  }, [isCurrent, fetchAudioteka]);

  const refresh = useCallback(() => {
    if (!refreshing && Date.now() - lastFetchTime > ARTICLE_EXPIRE_DURATION) {
      console.log('Audioteka data expired!');
      fetchAudioteka();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshing, state.lastFetchTime]);

  useEffect(() => {
    if (isCurrent) {
      refresh();
    }
  }, [isCurrent, refresh]);

  useAppStateCallback(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  const renderItem = useCallback((listItem: ListRenderItemInfo<AudiotekaTemplate>) => {
    const {item} = listItem;

    switch (item.template) {
      case 'url_list': {
        return <TopUrlBlock block={item} />;
      }
      case 'top_feed': {
        return <TopFeedBlock block={item} />;
      }
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
        //TODO: remove this after audioteka api update. This is temp workaround
        if ((item as any).type === 'top_feed') {
          return <TopFeedBlock block={item} />;
        }
        console.warn('Unknown list item: ', JSON.stringify(item, null, 4));
        return <View />;
      }
    }
  }, []);

  const extraData = useMemo(() => ({lastFetchTime: lastFetchTime}), [lastFetchTime]);

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
        <FlashList
          showsVerticalScrollIndicator={false}
          //style={styles.container}
          ref={listRef}
          extraData={extraData}
          renderItem={renderItem}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => fetchAudioteka()} />}
          data={data}
          removeClippedSubviews={false}
          ListFooterComponent={<SafeAreaView edges={['bottom']} />}
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

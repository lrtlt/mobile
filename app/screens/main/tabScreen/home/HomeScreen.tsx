import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {View, StyleSheet, StatusBar, RefreshControl} from 'react-native';
import {
  ArticleRow,
  ScrollingChannels,
  ScreenLoader,
  Forecast,
  TouchableDebounce,
  BannerComponent,
} from '../../../../components';
import {FlashList, ListRenderItemInfo} from '@shopify/flash-list';
import {ARTICLE_EXPIRE_DURATION, EVENT_LOGO_PRESS} from '../../../../constants';
import Gemius from 'react-native-gemius-plugin';
import {EventRegister} from 'react-native-event-listeners';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../../../../Theme';
import {HomeBlockType} from '../../../../api/Types';
import {StackNavigationProp} from '@react-navigation/stack';
import {MainStackParamList} from '../../../../navigation/MainStack';
import TopArticlesBlock from './blocks/TopArticlesBlock/TopArticlesBlock';
import FeedArticlesBlock from './blocks/FeedArticlesBlock/FeedArticlesBlock';
import DailyQuestionComponent from '../../../../components/dailyQuestion/DailyQuestionComponent';
import CategoryArticlesBlock from './blocks/CategoryArticlesBlock/CategoryArticlesBlock';
import SlugArticlesBlock from './blocks/SlugArticlesBlock/SlugArticlesBlock';
import TopFeedBlock from './blocks/TopFeedBlock/TopFeedBlock';
import TopUrlBlock from './blocks/TopUrlBlock/TopUrlBlock';
import useAppStateCallback from '../../../../hooks/useAppStateCallback';
import useNavigationAnalytics from '../../../../util/useNavigationAnalytics';
import EpikaBlock from './blocks/EpikaBlock/EpikaBlock';
import VideoListBlock from './blocks/VideoListBlock/VideoListBlock';
import {useShallow} from 'zustand/shallow';
import {ArticleState, useArticleStore} from '../../../../state/article_store';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Config from 'react-native-config';
import {useArticleStorageStore} from '../../../../state/article_storage_store';
import {sendSearchUserEvent} from '../../../../api';

const selectHomeScreenState = () => (state: ArticleState) => {
  const block = state.home;
  return {
    refreshing: block.isFetching && block.items.length > 0,
    lastFetchTime: block.lastFetchTime,
    items: block.items,
  };
};

interface Props {
  isCurrent: boolean;
}

const HomeScreen: React.FC<React.PropsWithChildren<Props>> = ({isCurrent}) => {
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  const listRef = useRef<FlashList<any>>(null);

  const {fetchHome} = useArticleStore.getState();
  const state = useArticleStore(useShallow(selectHomeScreenState()));

  const {syncSavedArticles} = useArticleStorageStore.getState();
  useEffect(() => {
    syncSavedArticles();
  }, []);

  const {colors, dark} = useTheme();

  const {items, lastFetchTime, refreshing} = state;

  useEffect(() => {
    Gemius.sendPartialPageViewedEvent(Config.GEMIUS_VIEW_SCRIPT_ID, {
      page: 'home',
    });
    sendSearchUserEvent({
      type: 'view-home-page',
      data: {
        attributes: {
          source: 'mobile_app',
        },
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useNavigationAnalytics({
    viewId: 'https://www.lrt.lt/',
    title: 'Lietuvos nacionalinis radijas ir televizija. Naujienos, įrašai ir transliacijos. - LRT',
    sections: ['/Lrt'],
  });

  useEffect(() => {
    const listener = EventRegister.addEventListener(EVENT_LOGO_PRESS, (_data) => {
      if (isCurrent) {
        listRef.current?.scrollToOffset({
          animated: true,
          offset: 0,
        });
        callApi();
      }
    });

    return () => {
      EventRegister.removeEventListener(listener as string);
    };
  }, [isCurrent]);

  const refresh = useCallback(() => {
    if (!refreshing && Date.now() - state.lastFetchTime > ARTICLE_EXPIRE_DURATION) {
      console.log(`Home data expired!`);
      callApi();
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

  const callApi = useCallback(() => {
    fetchHome();
  }, []);

  const onForecastPressHandler = useCallback(() => {
    navigation.navigate('Weather');
  }, [navigation]);

  const renderItem = useCallback(
    (val: ListRenderItemInfo<HomeBlockType>) => {
      const block = val.item;
      switch (block.type) {
        case 'article': {
          return (
            <ArticleRow
              data={[block.article]}
              onArticlePress={(article) => {
                if (article.is_audio) {
                  navigation.push('Podcast', {articleId: article.id});
                } else if (article.is_video) {
                  navigation.push('Vodcast', {articleId: article.id});
                } else {
                  navigation.push('Article', {articleId: article.id});
                }
              }}
            />
          );
        }
        case 'channels': {
          return (
            <ScrollingChannels
              onChannelPress={(channel) =>
                navigation.navigate('Channel', {channelId: channel.payload.channel_id})
              }
            />
          );
        }
        case 'top_url_list': {
          return <TopUrlBlock block={block} />;
        }
        case 'top_feed': {
          return <TopFeedBlock block={block} />;
        }
        case 'vertical_video_list': {
          return <VideoListBlock block={block} />;
        }
        case 'top_articles': {
          return <TopArticlesBlock block={block} />;
        }
        case 'articles_block': {
          return <FeedArticlesBlock block={block} />;
        }
        case 'category': {
          return <CategoryArticlesBlock block={block} />;
        }
        case 'slug': {
          return <SlugArticlesBlock block={block} />;
        }
        case 'embed': {
          return <BannerComponent data={block} />;
        }
        case 'daily_question': {
          return <DailyQuestionComponent block={block} />;
        }
        case 'banner': {
          return <EpikaBlock block={block} />;
        }
        default: {
          console.warn('Unknown list item type: ' + val.item.type);
          return <View />;
        }
      }
    },
    [navigation],
  );

  const renderForecast = useCallback(() => {
    return (
      <TouchableDebounce debounceTime={500} onPress={onForecastPressHandler}>
        <Forecast style={styles.forecast} />
      </TouchableDebounce>
    );
  }, [onForecastPressHandler]);

  const insets = useSafeAreaInsets();
  const keyExtractor = useCallback((item: HomeBlockType, index: number) => `${index}-${item.type}`, []);
  const extraData = useMemo(() => ({lastFetchTime: lastFetchTime}), [lastFetchTime]);

  if (items.length === 0) {
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
          contentContainerStyle={{paddingBottom: insets.bottom}}
          ref={listRef}
          extraData={extraData}
          renderItem={renderItem}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={callApi} />}
          ListHeaderComponent={renderForecast()}
          data={items}
          removeClippedSubviews={false}
          estimatedItemSize={400}
          keyExtractor={keyExtractor}
        />
      </View>
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  forecast: {
    margin: 8,
  },
});

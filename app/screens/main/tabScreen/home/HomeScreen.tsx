import React, {useCallback, useEffect, useRef} from 'react';
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
import {fetchHome, fetchMediateka} from '../../../../redux/actions/index';
import {ARTICLE_EXPIRE_DURATION, GEMIUS_VIEW_SCRIPT_ID, EVENT_LOGO_PRESS} from '../../../../constants';
import {useDispatch, useSelector} from 'react-redux';
import Gemius from 'react-native-gemius-plugin';
import {EventRegister} from 'react-native-event-listeners';
import {selectHomeScreenState} from '../../../../redux/selectors';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../../../../Theme';
import {HomeBlockType, ROUTE_TYPE_HOME, ROUTE_TYPE_MEDIA} from '../../../../api/Types';
import {StackNavigationProp} from '@react-navigation/stack';
import {MainStackParamList} from '../../../../navigation/MainStack';
import TopArticlesBlock from './blocks/TopArticlesBlock/TopArticlesBlock';
import FeedArticlesBlock from './blocks/FeedArticlesBlock/FeedArticlesBlock';
import DailyQuestionComponent from '../../../../components/dailyQuestion/DailyQuestionComponent';
import CategoryArticlesBlock from './blocks/CategoryArticlesBlock/CategoryArticlesBlock';
import SlugArticlesBlock from './blocks/SlugArticlesBlock/SlugArticlesBlock';
import TopFeedBlock from './blocks/TopFeedBlock/TopFeedBlock';
import TopUrlBlock from './blocks/TopUrlsBlock/TopUrlBlock';
import useAppStateCallback from '../../../../hooks/useAppStateCallback';
import useNavigationAnalytics from '../../../../util/useNavigationAnalytics';

interface Props {
  isCurrent: boolean;
  type: typeof ROUTE_TYPE_HOME | typeof ROUTE_TYPE_MEDIA;
}

const HomeScreen: React.FC<Props> = ({isCurrent, type}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  const listRef = useRef<FlashList<any>>(null);

  const state = useSelector(selectHomeScreenState(type), (l, r) => l.lastFetchTime === r.lastFetchTime);

  const {colors, dark} = useTheme();

  const {items, lastFetchTime, refreshing} = state;

  useEffect(() => {
    Gemius.sendPartialPageViewedEvent(GEMIUS_VIEW_SCRIPT_ID, {
      page: type,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useNavigationAnalytics({
    type: type === ROUTE_TYPE_MEDIA ? 'Mediateka' : 'Home',
    title: type === ROUTE_TYPE_MEDIA ? 'Mediateka' : 'Pagrindinis',
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
  });

  const refresh = useCallback(() => {
    if (!refreshing && Date.now() - state.lastFetchTime > ARTICLE_EXPIRE_DURATION) {
      console.log(`${type} data expired!`);
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
    if (type === ROUTE_TYPE_MEDIA) {
      dispatch(fetchMediateka());
    } else {
      dispatch(fetchHome());
    }
  }, [dispatch, type]);

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
              onArticlePress={(article) => navigation.navigate('Article', {articleId: article.id})}
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
        default: {
          console.warn('Unknown list item type: ' + val.item.type);
          return <View />;
        }
      }
    },
    [navigation],
  );

  const renderForecast = useCallback(() => {
    if (type === ROUTE_TYPE_MEDIA) {
      return null;
    } else {
      return (
        <TouchableDebounce debounceTime={500} onPress={onForecastPressHandler}>
          <Forecast style={styles.forecast} />
        </TouchableDebounce>
      );
    }
  }, [onForecastPressHandler, type]);

  const keyExtractor = useCallback((item: HomeBlockType, index) => `${index}-${item.type}`, []);

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
          //style={styles.container}
          ref={listRef}
          extraData={{
            lastFetchTime: lastFetchTime,
          }}
          renderItem={renderItem}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={callApi} />}
          ListHeaderComponent={renderForecast()}
          data={items}
          removeClippedSubviews={false}
          estimatedItemSize={350}
          // windowSize={6}
          // updateCellsBatchingPeriod={20}
          // maxToRenderPerBatch={4}
          // initialNumToRender={8}
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

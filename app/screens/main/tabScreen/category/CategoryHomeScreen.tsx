import React, {useCallback, useEffect, useRef} from 'react';
import {View, StyleSheet, RefreshControl} from 'react-native';
import {
  ArticleRow,
  ScrollingChannels,
  ScreenLoader,
  BannerComponent,
  TouchableDebounce,
  Text,
} from '../../../../components';
import {FlashList, ListRenderItemInfo} from '@shopify/flash-list';
import {ARTICLE_EXPIRE_DURATION, EVENT_LOGO_PRESS, EVENT_SELECT_CATEGORY_INDEX} from '../../../../constants';
import Gemius from 'react-native-gemius-plugin';
import {EventRegister} from 'react-native-event-listeners';
import {useNavigation} from '@react-navigation/native';
import {HomeBlockType, ROUTE_TYPE_CATEGORY} from '../../../../api/Types';
import {StackNavigationProp} from '@react-navigation/stack';
import {MainStackParamList} from '../../../../navigation/MainStack';
import DailyQuestionComponent from '../../../../components/dailyQuestion/DailyQuestionComponent';
import useAppStateCallback from '../../../../hooks/useAppStateCallback';

import {useShallow} from 'zustand/shallow';
import {ArticleState, useArticleStore} from '../../../../state/article_store';
import CategoryArticlesBlock from '../home/blocks/CategoryArticlesBlock/CategoryArticlesBlock';
import EpikaBlock from '../home/blocks/EpikaBlock/EpikaBlock';
import FeedArticlesBlock from '../home/blocks/FeedArticlesBlock/FeedArticlesBlock';
import SlugArticlesBlock from '../home/blocks/SlugArticlesBlock/SlugArticlesBlock';
import TopArticlesBlock from '../home/blocks/TopArticlesBlock/TopArticlesBlock';
import TopFeedBlock from '../home/blocks/TopFeedBlock/TopFeedBlock';
import VideoListBlock from '../home/blocks/VideoListBlock/VideoListBlock';
import useCategoryScreenAnalytics from './useCategoryScreenAnalytics';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ArticlesListByDateBlock from '../home/blocks/ArticlesListByDateBlock/ArticlesListByDateBlock';
import TopUrlInlineBlock from '../home/blocks/TopUrlInlineBlock/TopUrlInlineBlock';
import {IconArrowLeft} from '../../../../components/svg';
import {useTheme} from '../../../../Theme';
import Config from 'react-native-config';

const selectCategoryState = (id: number) => (state: ArticleState) => {
  const block = state.advancedCategories[id];
  if (block) {
    return {
      refreshing: block.isFetching && Boolean(block.items?.length),
      lastFetchTime: block.lastFetchTime,
      items: block.items ?? [],
    };
  } else {
    return {
      refreshing: false,
      lastFetchTime: 0,
      items: [],
    };
  }
};

interface Props {
  isCurrent: boolean;
  id: number;
  title: string;
  url: string;
}

const CategoryHomeScreen: React.FC<React.PropsWithChildren<Props>> = ({isCurrent, id, title, url}) => {
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  const listRef = useRef<FlashList<any>>(null);

  const {fetchCategoryHome} = useArticleStore.getState();
  const state = useArticleStore(useShallow(selectCategoryState(id)));

  const {items, lastFetchTime, refreshing} = state;
  const {colors} = useTheme();

  useEffect(() => {
    Gemius.sendPartialPageViewedEvent(Config.GEMIUS_VIEW_SCRIPT_ID, {
      page: ROUTE_TYPE_CATEGORY,
      categoryId: id.toString(),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useCategoryScreenAnalytics({
    categoryUrl: `/naujienos/${url}`,
    categoryTitle: title,
  });

  useEffect(() => {
    const listener = EventRegister.addEventListener(EVENT_LOGO_PRESS, (_data) => {
      if (isCurrent) {
        listRef.current?.scrollToOffset({
          animated: true,
          offset: 0,
        });
        fetchCategoryHome(id);
      }
    });

    return () => {
      EventRegister.removeEventListener(listener as string);
    };
  });

  const checkForRefresh = useCallback(() => {
    if (!refreshing && Date.now() - state.lastFetchTime > ARTICLE_EXPIRE_DURATION) {
      console.log(`Category ${id} data expired!`);
      fetchCategoryHome(id, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshing, state.lastFetchTime]);

  useEffect(() => {
    if (isCurrent) {
      checkForRefresh();
    }
  }, [isCurrent, checkForRefresh]);

  useAppStateCallback(
    useCallback(() => {
      checkForRefresh();
    }, [checkForRefresh]),
  );

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
          return <TopUrlInlineBlock block={block} />;
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
        case 'articles_list_by_date': {
          return (
            <ArticlesListByDateBlock
              block={block}
              category_id={id}
              category_title={title}
              category_url={url}
            />
          );
        }
        default: {
          console.warn('Unknown list item type: ' + val.item.type);
          return <View />;
        }
      }
    },
    [navigation],
  );

  const renderTitle = useCallback(() => {
    return (
      <View>
        <TouchableDebounce
          style={styles.backContainer}
          onPress={() => {
            EventRegister.emit(EVENT_SELECT_CATEGORY_INDEX, {index: 0});
          }}>
          <IconArrowLeft color={colors.primary} size={16} />
          <Text style={{color: colors.primary, ...styles.backText}}>Atgal į pagrindinį</Text>
        </TouchableDebounce>

        <Text style={styles.title} fontFamily="PlayfairDisplay-Regular">
          {title}
        </Text>
      </View>
    );
  }, [colors.primary]);

  const keyExtractor = useCallback((item: HomeBlockType, index: number) => `${index}-${item.type}`, []);

  const insets = useSafeAreaInsets();

  if (!items.length) {
    return <ScreenLoader />;
  }

  return (
    <View style={styles.container}>
      <FlashList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: insets.bottom}}
        ref={listRef}
        ListHeaderComponent={renderTitle()}
        extraData={{
          lastFetchTime: lastFetchTime,
        }}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => fetchCategoryHome(id, true)} />
        }
        data={items}
        removeClippedSubviews={false}
        estimatedItemSize={350}
        keyExtractor={keyExtractor}
      />
    </View>
  );
};

export default CategoryHomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
    marginTop: 24,
  },
  backText: {
    marginLeft: 6,
  },
  title: {
    fontSize: 30,
    paddingVertical: 20,
    paddingHorizontal: 8,
  },
});

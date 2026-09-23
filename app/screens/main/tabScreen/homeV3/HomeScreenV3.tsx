import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {View, StyleSheet, StatusBar, RefreshControl} from 'react-native';
import {ScrollingChannels, ScreenLoader, BannerComponent} from '../../../../components';
import {FlashList, FlashListRef, ListRenderItemInfo} from '@shopify/flash-list';
import {ARTICLE_EXPIRE_DURATION, EVENT_LOGO_PRESS} from '../../../../constants';
import Gemius from 'react-native-gemius-plugin';
import {EventRegister} from 'react-native-event-listeners';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../../../../Theme';
import {HomeV3BlockCategory, HomeV3BlockSlug, HomeV3BlockType} from '../../../../api/Types';
import {StackNavigationProp} from '@react-navigation/stack';
import {MainStackParamList} from '../../../../navigation/MainStack';
import DailyQuestionComponent from '../../../../components/dailyQuestion/DailyQuestionComponent';
import useAppStateCallback from '../../../../hooks/useAppStateCallback';
import useNavigationAnalytics from '../../../../util/useNavigationAnalytics';
import {useShallow} from 'zustand/shallow';
import {ArticleState, useArticleStore} from '../../../../state/article_store';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Config from 'react-native-config';
import TopArticlesBlock from './blocks/TopArticlesBlock/TopArticlesBlock';
import TopFeedBlock from './blocks/TopFeedBlock/TopFeedBlock';
import TopArticlesListBlock from './blocks/TopArticlesListBlock/TopArticlesListBlock';
import MostReadBlock from './blocks/MostReadBlock/MostReadBlock';
import SlugBannerBlock from './blocks/SlugBannerBlock/SlugBannerBlock';
import SlugFeaturedBlock from './blocks/SlugFeaturedBlock/SlugFeaturedBlock';
import OpinionsBlock from './blocks/OpinionsBlock/OpinionsBlock';
import CategoryArticlesBlock from './blocks/CategoryArticlesBlock/CategoryArticlesBlock';
import SingleArticleBlock from './blocks/SingleArticleBlock/SingleArticleBlock';
import VideoListBlock from './blocks/VideoListBlock/VideoListBlock';
import MediaBlock from './blocks/MediaBlock/MediaBlock';
// Blocks shared with the v2 home page.
import TopUrlBlock from '../home/blocks/TopUrlBlock/TopUrlBlock';
import EpikaBlock from '../home/blocks/EpikaBlock/EpikaBlock';
import useHomeColors from './components/useHomeColors';
import {getBlockSeparator, getBlockVariant} from './util';

const selectHomeScreenState = () => (state: ArticleState) => {
  const block = state.homeV3;
  return {
    refreshing: block.isFetching && block.items.length > 0,
    lastFetchTime: block.lastFetchTime,
    items: block.items,
  };
};

interface Props {
  isCurrent: boolean;
  onScroll?: (event: any) => void;
  paddingTop?: number;
}

const HomeScreenV3: React.FC<React.PropsWithChildren<Props>> = ({isCurrent, onScroll, paddingTop}) => {
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  const listRef = useRef<FlashListRef<any>>(null);

  const {fetchHomeV3} = useArticleStore.getState();
  const state = useArticleStore(useShallow(selectHomeScreenState()));

  const {colors, dark} = useTheme();

  const {items, lastFetchTime, refreshing} = state;

  useEffect(() => {
    Gemius.sendPartialPageViewedEvent(Config.GEMIUS_VIEW_SCRIPT_ID, {
      page: 'home',
    });
  }, []);

  useNavigationAnalytics({
    viewId: 'https://www.lrt.lt/',
    title: 'Lietuvos nacionalinis radijas ir televizija. Naujienos, įrašai ir transliacijos. - LRT',
    sections: ['/Lrt'],
  });

  useEffect(() => {
    const listener = EventRegister.addEventListener(EVENT_LOGO_PRESS, (_data) => {
      listRef.current?.scrollToTop({
        animated: false,
      });
      callApi();
    });

    return () => {
      EventRegister.removeEventListener(listener as string);
    };
  }, []);

  const refresh = useCallback(() => {
    if (!refreshing && Date.now() - state.lastFetchTime > ARTICLE_EXPIRE_DURATION) {
      console.log(`Home v3 data expired!`);
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
    fetchHomeV3();
  }, []);

  const renderItem = useCallback(
    (val: ListRenderItemInfo<HomeV3BlockType>) => {
      const block = val.item;
      switch (block.type) {
        case 'top_articles1-9':
          return <TopArticlesBlock block={block} />;
        case 'top_feed':
          return <TopFeedBlock block={block} />;
        case 'channels':
          return (
            <View style={styles.channels}>
              <ScrollingChannels
                onChannelPress={(channel) => navigation.navigate('Channel', {channelId: channel.channel_id})}
              />
            </View>
          );
        case 'top_articles10-15':
          return <TopArticlesListBlock block={block} />;
        case 'articles_list':
          return <MostReadBlock block={block} />;
        case 'block_with_title':
          return <MediaBlock block={block} />;
        case 'slug': {
          switch (getBlockVariant(block)) {
            case 'slug_banner':
              return <SlugBannerBlock block={block} />;
            case 'slug_featured':
              return <SlugFeaturedBlock block={block} />;
            default:
              return <CategoryArticlesBlock block={block} />;
          }
        }
        case 'category': {
          switch (getBlockVariant(block)) {
            case 'opinions':
              return <OpinionsBlock block={block} />;
            case 'single_article':
              return <SingleArticleBlock block={block} />;
            case 'slug_featured':
              return <SlugFeaturedBlock block={toSlugBlock(block)} />;
            default:
              return <CategoryArticlesBlock block={block} />;
          }
        }
        case 'top_url_list':
          return <TopUrlBlock block={block} />;
        case 'vertical_video_list':
          return <VideoListBlock block={block} />;
        case 'embed':
          // The block separators already give the web's spacing around banners.
          return <BannerComponent data={block} containerStyle={styles.banner} />;
        case 'daily_question':
          return <DailyQuestionComponent block={block} />;
        case 'banner':
          return <EpikaBlock block={block} />;
        default:
          console.warn('Unknown home v3 block: ' + (val.item as any).type);
          return <View />;
      }
    },
    [navigation],
  );

  const insets = useSafeAreaInsets();
  const keyExtractor = useCallback((item: HomeV3BlockType, index: number) => `${index}-${item.type}`, []);
  const getItemType = useCallback((item: HomeV3BlockType) => getBlockVariant(item), []);
  const extraData = useMemo(() => ({lastFetchTime: lastFetchTime}), [lastFetchTime]);
  const blocks = useMemo(() => withTopFeedFirst(items), [items]);

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
          contentContainerStyle={{paddingTop: paddingTop ?? 0, paddingBottom: insets.bottom + 32}}
          ref={listRef}
          extraData={extraData}
          renderItem={renderItem}
          getItemType={getItemType}
          ItemSeparatorComponent={BlockSeparator}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={callApi} />}
          data={blocks}
          removeClippedSubviews={false}
          keyExtractor={keyExtractor}
          onScroll={onScroll}
        />
      </View>
    </>
  );
};

/** The web shows the newest articles strip above everything else. */
const withTopFeedFirst = (items: HomeV3BlockType[]) => [
  ...items.filter((i) => i.type === 'top_feed'),
  ...items.filter((i) => i.type !== 'top_feed'),
];

/** A category block with template 18 renders like a featured topic. */
const toSlugBlock = (block: HomeV3BlockCategory): HomeV3BlockSlug => {
  return {
    ...block,
    type: 'slug',
    data: {
      slug_title: block.data.category_title,
      slug_url: block.data.category_url,
      articles_list: block.data.articles_list,
    },
  };
};

const BlockSeparator: React.FC<{leadingItem?: HomeV3BlockType; trailingItem?: HomeV3BlockType}> = ({
  leadingItem,
  trailingItem,
}) => {
  const colors = useHomeColors();

  if (!leadingItem || !trailingItem || getBlockSeparator(leadingItem, trailingItem) === 'space') {
    return <View style={styles.space} />;
  }
  return <View style={{...styles.line, backgroundColor: colors.separator}} />;
};

export default HomeScreenV3;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  channels: {
    paddingHorizontal: 4,
  },
  banner: {
    marginVertical: 0,
  },
  space: {
    height: 40,
  },
  line: {
    height: 1,
    marginHorizontal: 8,
    marginVertical: 32,
  },
});

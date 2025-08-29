import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {View, RefreshControl, StyleSheet, StatusBar} from 'react-native';
import {FlashList, ListRenderItemInfo} from '@shopify/flash-list';
import {ScreenLoader} from '../../../../components';
import {EVENT_LOGO_PRESS, ARTICLE_EXPIRE_DURATION} from '../../../../constants';
import Gemius from 'react-native-gemius-plugin';
import {EventRegister} from 'react-native-event-listeners';
import {useTheme} from '../../../../Theme';
import moment from 'moment';

import {useSafeAreaInsets} from 'react-native-safe-area-context';

import useAppStateCallback from '../../../../hooks/useAppStateCallback';
import useNavigationAnalytics from '../../../../util/useNavigationAnalytics';
import {ArticleState, useArticleStore} from '../../../../state/article_store';
import {useShallow} from 'zustand/shallow';
import Config from 'react-native-config';
import {buildImageUri, IMG_SIZE_L} from '../../../../util/ImageUtil';

import {useNavigation} from '@react-navigation/native';
import {MainStackParamList} from '../../../../navigation/MainStack';
import {StackNavigationProp} from '@react-navigation/stack';
import {
  isMediatekaBlockBanner,
  isMediatekaBlockCategory,
  isMediatekaBlockSlug,
  isMediatekaBlockWidget,
  MediatekaBlockType,
} from '../../../../api/Types';
import EpikaBlock from '../home/blocks/EpikaBlock/EpikaBlock';
import MediatekaHero from './components/hero/MediatekaHero';
import MediatekaHorizontalCategoryList from './components/horizontal_list/MediatekaHorizontalCategoryList';
import VideoListBlock from '../home/blocks/VideoListBlock/VideoListBlock';

const WIDGET_ID_HERO = 24;
const WIDGET_ID_LATEST = 25;
const WIDGET_ID_POPULAR = 26;

interface Props {
  isCurrent: boolean;
}

const selectMediatekaScreenState = (state: ArticleState) => {
  const block = state.mediatekaV2;
  return {
    refreshing: block.isFetching && block.items.length > 0,
    lastFetchTime: block.lastFetchTime,
    data: block.items,
  };
};

const isArticleNew = (itemDate?: string): boolean => {
  if (!itemDate) return false;
  const date = moment(itemDate, 'YYYY.MM.DD HH:mm');
  return Date.now() - date.toDate().getTime() < 3 * 60 * 60 * 1000; // New if within last 3 hours
};

const isArticlePopular = (readCount?: number): boolean => {
  if (!readCount) return false;
  return readCount > 5000;
};

const MediatekaScreen: React.FC<React.PropsWithChildren<Props>> = ({isCurrent}) => {
  const listRef = useRef<FlashList<any>>(null);
  const {colors, dark} = useTheme();

  const navigation = useNavigation<StackNavigationProp<MainStackParamList, 'Home'>>();

  const {fetchMediatekaV2} = useArticleStore.getState();

  const state = useArticleStore(useShallow(selectMediatekaScreenState));
  const {refreshing, lastFetchTime, data} = state;

  useEffect(() => {
    Gemius.sendPartialPageViewedEvent(Config.GEMIUS_VIEW_SCRIPT_ID, {
      page: 'mediateka',
    });
  }, []);

  useNavigationAnalytics({
    viewId: 'https://www.lrt.lt/mediateka',
    title: 'Mediateka - LRT - Mediateka - LRT',
    authors: ['Lrt.lt'],
    sections: ['Mediateka'],
  });

  useEffect(() => {
    const listener = EventRegister.addEventListener(EVENT_LOGO_PRESS, (_data) => {
      if (isCurrent) {
        listRef.current?.scrollToIndex({
          animated: true,
          index: 0,
        });
        fetchMediatekaV2();
      }
    });
    return () => {
      EventRegister.removeEventListener(listener as string);
    };
  }, [isCurrent]);

  const refresh = useCallback(() => {
    if (!refreshing && Date.now() - lastFetchTime > ARTICLE_EXPIRE_DURATION) {
      console.log('Mediateka data expired!');
      fetchMediatekaV2();
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

  const renderItem = useCallback((listItem: ListRenderItemInfo<MediatekaBlockType>) => {
    const {item} = listItem;

    if (isMediatekaBlockWidget(item)) {
      switch (item.widget_id) {
        case WIDGET_ID_HERO:
          return (
            <MediatekaHero
              block={item}
              onArticlePress={(article) => {
                navigation.push('Vodcast', {
                  articleId: article.id,
                });
              }}
            />
          );
        case WIDGET_ID_LATEST:
        case WIDGET_ID_POPULAR:
          return (
            <MediatekaHorizontalCategoryList
              categoryTitle={item.widget_id === WIDGET_ID_LATEST ? 'NAUJAUSI' : 'POPULIARIAUSI'}
              items={item['widget-data'].articles_list.map((a) => ({
                title: a.title,
                category: a.branch1_title ?? a.branch0_title,
                subtitle: a.category_title,
                imageUrl: buildImageUri(IMG_SIZE_L, a.img_path_prefix, a.img_path_postfix),
                imageAspectRatio: a.photo_aspectratio,
                isAgeRestricted: !!a.age_restriction,
                isNew: isArticleNew(a.item_date),
                isPopular: isArticlePopular(a.read_count),
              }))}
              onItemPress={(index) => {
                navigation.push('Vodcast', {
                  articleId: item['widget-data'].articles_list[index].id,
                });
              }}
              onItemPlayPress={(index) => {
                navigation.push('Vodcast', {
                  articleId: item['widget-data'].articles_list[index].id,
                });
              }}
            />
          );
      }
    }

    if (isMediatekaBlockBanner(item)) {
      return (
        <View style={{paddingBottom: 48}}>
          <EpikaBlock block={item.html_embed_mobile} />
        </View>
      );
    }

    if (isMediatekaBlockCategory(item)) {
      if (item.template_id == 52) {
        return (
          <MediatekaHorizontalCategoryList
            categoryTitle={item.category_title}
            items={item.articles_list.map((a) => ({
              title: a.title,
              category: a.branch1_title ?? a.branch0_title,
              subtitle: a.category_title,
              isAgeRestricted: !!a.age_restriction,
              isNew: isArticleNew(a.item_date),
              isPopular: isArticlePopular(a.read_count),
              imageUrl: buildImageUri(IMG_SIZE_L, a.img_path_prefix, a.img_path_postfix),
              imageAspectRatio: a.photo_aspectratio,
            }))}
            onItemPress={(index) => {
              navigation.push('Vodcast', {
                articleId: item.articles_list[index].id,
              });
            }}
            onItemPlayPress={(index) => {
              //TODO: maybe change later if needed?
              navigation.push('Vodcast', {
                articleId: item.articles_list[index].id,
              });
            }}
            onTitlePress={() => {
              navigation.push('Vodcast', {
                articleId: item.articles_list[0].id,
              });
            }}
          />
        );
      }

      if (item.template_id == 22) {
        return (
          <VideoListBlock
            block={{
              type: 'vertical_video_list',
              template_id: 22,
              data: {
                articles_list: item.articles_list,
                category_id: item.category_id,
                category_title: item.category_title,
                slug_title: item.category_url,
              },
            }}
          />
        );
      }
    }

    if (isMediatekaBlockSlug(item)) {
      return (
        <MediatekaHorizontalCategoryList
          categoryTitle={item.slug_title}
          separatorTop={false}
          keywords={
            item.select_opts.slug
              ? [
                  {
                    name: item.slug_title,
                    slug: item.select_opts.slug,
                  },
                ]
              : undefined
          }
          items={item.articles_list.map((a) => ({
            title: a.title,
            category: a.branch1_title ?? a.branch0_title,
            subtitle: a.category_title,
            isAgeRestricted: !!a.age_restriction,
            isNew: isArticleNew(a.item_date),
            isPopular: isArticlePopular(a.read_count),
            imageUrl: buildImageUri(IMG_SIZE_L, a.img_path_prefix, a.img_path_postfix),
            imageAspectRatio: a.photo_aspectratio,
          }))}
          onItemPress={(index) => {
            navigation.push('Vodcast', {
              articleId: item.articles_list[index].id,
            });
          }}
          onItemPlayPress={(index) => {
            //TODO: maybe change later if needed?
            navigation.push('Vodcast', {
              articleId: item.articles_list[index].id,
            });
          }}
          onKeywordPress={(keyword) => {
            navigation.navigate('Slug', {
              name: keyword.name,
              slugUrl: keyword.slug,
            });
          }}
          onTitlePress={() => {
            navigation.navigate('Slug', {
              name: item.slug_title,
              slugUrl: item.slug_url,
            });
          }}
        />
      );
    }

    return <View />;
  }, []);

  const {bottom} = useSafeAreaInsets();
  const extraData = useMemo(() => ({lastFetchTime: lastFetchTime}), [lastFetchTime]);

  if (!data?.length) {
    return <ScreenLoader />;
  }

  return (
    <>
      <StatusBar
        barStyle={dark ? 'light-content' : 'dark-content'}
        translucent={false}
        backgroundColor={colors.statusBar}
      />
      <View style={[styles.container, {backgroundColor: colors.radiotekaBackground}]}>
        <FlashList
          showsVerticalScrollIndicator={false}
          ref={listRef}
          extraData={extraData}
          contentContainerStyle={{paddingBottom: bottom}}
          renderItem={renderItem}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => fetchMediatekaV2()} />}
          data={data}
          removeClippedSubviews={false}
          estimatedFirstItemOffset={500}
          estimatedItemSize={300}
          keyExtractor={(item, index) => String(index) + String(item)}
        />
      </View>
    </>
  );
};

export default MediatekaScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

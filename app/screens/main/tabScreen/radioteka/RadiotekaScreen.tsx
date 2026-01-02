import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {View, RefreshControl, StyleSheet, StatusBar} from 'react-native';
import {FlashList, FlashListRef, ListRenderItemInfo} from '@shopify/flash-list';
import {ScreenLoader} from '../../../../components';
import {ARTICLE_EXPIRE_DURATION} from '../../../../constants';
import Gemius from 'react-native-gemius-plugin';
import {useTheme} from '../../../../Theme';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import useAppStateCallback from '../../../../hooks/useAppStateCallback';
import useNavigationAnalytics from '../../../../util/useNavigationAnalytics';
import {ArticleState, useArticleStore} from '../../../../state/article_store';
import {useShallow} from 'zustand/shallow';
import Config from 'react-native-config';
import {RadiotekaTemplate} from '../../../../api/Types';
import RadiotekaHero from './components/hero/RadiotekaHero';
import RadiotekaHorizontalCategoryList from './components/horizontal_list/RadiotekaHorizontalCategoryList';
import {buildImageUri, IMG_SIZE_L} from '../../../../util/ImageUtil';
import {RadiotekaHeroCarousel} from './components/hero/RadiotekaHeroCarousel';
import RadiotekaGenres from './components/genres/RadiotekaGenres';
import {useNavigation} from '@react-navigation/native';
import {MainStackParamList} from '../../../../navigation/MainStack';
import {StackNavigationProp} from '@react-navigation/stack';
import {useMediaPlayer} from '../../../../components/videoComponent/context/useMediaPlayer';
import ArticlePlaylist from '../../../../components/videoComponent/context/playlist/ArticlePlaylist';
import {pushArticle} from '../../../../util/NavigationUtils';

const WIDGET_ID_HERO = 21;
const WIDGET_ID_LATEST = 12;
const WIDGET_ID_POPULAR = 11;

interface Props {
  onScroll?: (event: any) => void;
  paddingTop?: number;
}

const selectRadiotekaScreenState = (state: ArticleState) => {
  const block = state.radioteka;
  return {
    refreshing: block.isFetching && block.data.length > 0,
    lastFetchTime: block.lastFetchTime,
    data: block.data,
  };
};

const RadiotekaScreen: React.FC<React.PropsWithChildren<Props>> = ({onScroll, paddingTop}) => {
  const listRef = useRef<FlashListRef<any>>(null);
  const {colors, dark} = useTheme();

  const navigation = useNavigation<StackNavigationProp<MainStackParamList, 'Home'>>();

  const {setPlaylist} = useMediaPlayer();
  const {fetchRadioteka} = useArticleStore.getState();

  const state = useArticleStore(useShallow(selectRadiotekaScreenState));
  const {refreshing, lastFetchTime, data} = state;

  useEffect(() => {
    Gemius.sendPartialPageViewedEvent(Config.GEMIUS_VIEW_SCRIPT_ID, {
      page: 'radioteka',
    });
  }, []);

  useNavigationAnalytics({
    viewId: 'https://www.lrt.lt/radioteka',
    title: 'Radioteka - LRT - Radioteka - LRT',
    authors: ['Lrt.lt'],
    sections: ['Radioteka'],
  });

  const refresh = useCallback(() => {
    if (!refreshing && Date.now() - lastFetchTime > ARTICLE_EXPIRE_DURATION) {
      console.log('Radioteka data expired!');
      fetchRadioteka();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshing, state.lastFetchTime]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useAppStateCallback(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  const renderItem = useCallback((listItem: ListRenderItemInfo<RadiotekaTemplate>) => {
    const {item} = listItem;
    switch (item.type) {
      case 'articles_block': {
        if (item.widget_id === WIDGET_ID_HERO) {
          return (
            <RadiotekaHero
              block={item}
              onArticlePress={(article) => {
                pushArticle(navigation, article);
              }}
            />
          );
        }

        if (item.widget_id === WIDGET_ID_LATEST || item.widget_id === WIDGET_ID_POPULAR) {
          return (
            <RadiotekaHorizontalCategoryList
              categoryTitle={
                item.widget_id === WIDGET_ID_LATEST ? 'Naujausi epizodai' : 'Populiariausi epizodai'
              }
              items={item.data.articles_list.map((a) => ({
                title: a.title,
                // category: a.channel_title,
                imageUrl: buildImageUri(IMG_SIZE_L, a.img_path_prefix, a.img_path_postfix),
                ageRestricted: !!a.age_restriction,
              }))}
              onItemPress={(index) => {
                pushArticle(navigation, item.data.articles_list[index]);
              }}
              onItemPlayPress={(index) => {
                setPlaylist(
                  new ArticlePlaylist(
                    item.data.articles_list.map((a) => a.id),
                    index,
                  ),
                );
              }}
            />
          );
        }
        break;
      }
      case 'slug': {
        if (item.template_id === 20) {
          return (
            <RadiotekaHorizontalCategoryList
              categoryTitle={item.data.slug_title}
              items={item.data.articles_list.map((a) => ({
                title: a.title,
                // category: a.channel_title,
                ageRestricted: !!a.age_restriction,
                imageUrl: buildImageUri(IMG_SIZE_L, a.img_path_prefix, a.img_path_postfix),
              }))}
              onItemPress={(index) => {
                pushArticle(navigation, item.data.articles_list[index]);
              }}
              onItemPlayPress={(index) => {
                setPlaylist(
                  new ArticlePlaylist(
                    item.data.articles_list.map((a) => a.id),
                    index,
                  ),
                );
              }}
            />
          );
        }
        break;
      }
      case 'audio_category_collection': {
        return (
          <RadiotekaHorizontalCategoryList
            variation={item.template_id === 46 ? 'minimal' : 'full'}
            // keywords={item.data.description.article_keywords}
            categoryTitle={item.data.description.article_title}
            items={item.data.category_list.map((c) => ({
              // title: c.title,
              // category:
              //   c.branch_info?.branch_level2?.branch_title ?? c.branch_info?.branch_level1?.branch_title,
              imageUrl: buildImageUri(
                IMG_SIZE_L,
                c.category_images?.img1?.img_path_prefix,
                c.category_images?.img1?.img_path_postfix,
              ),
            }))}
            onItemPress={(index) => {
              pushArticle(navigation, item.data.category_list[index].LATEST_ITEM);
            }}
            onItemPlayPress={(index) => {
              setPlaylist(
                new ArticlePlaylist(
                  item.data.category_list.map((c) => c.LATEST_ITEM.id),
                  index,
                ),
              );
            }}
            onKeywordPress={(keyword) => {
              navigation.navigate('Slug', {
                name: keyword.name,
                slugUrl: keyword.slug,
              });
            }}
          />
        );
      }
      case 'category': {
        if (item.template_id === 25) {
          return (
            <RadiotekaHeroCarousel
              items={item.data.articles_list}
              onItemPress={(index) => {
                pushArticle(navigation, item.data.articles_list[index]);
              }}
              onItemPlayPress={(index) => {
                setPlaylist(
                  new ArticlePlaylist(
                    item.data.articles_list.map((a) => a.id),
                    index,
                  ),
                );
              }}
            />
          );
        }
        if (item.template_id === 42 || item.template_id === 43) {
          return (
            <RadiotekaHorizontalCategoryList
              categoryTitle={item.data.category_title}
              items={item.data.articles_list.map((a) => ({
                title: a.title,
                // category: a.channel_title,
                ageRestricted: !!a.age_restriction,
                imageUrl: buildImageUri(IMG_SIZE_L, a.img_path_prefix, a.img_path_postfix),
              }))}
              onTitlePress={() => {
                pushArticle(navigation, item.data.articles_list[0]);
              }}
              onItemPress={(index) => {
                pushArticle(navigation, item.data.articles_list[index]);
              }}
              onItemPlayPress={(index) => {
                setPlaylist(
                  new ArticlePlaylist(
                    item.data.articles_list.map((a) => a.id),
                    index,
                  ),
                );
              }}
            />
          );
        }
        break;
      }
      case 'audio_genre_collection': {
        return (
          <RadiotekaGenres
            data={item.data.genre_list}
            title={item.data.genres_collection_description.article_title}
            onPress={(genreId: number, genreTitle: string) => {
              navigation.push('Genre', {
                genreId,
                title: genreTitle,
              });
            }}
          />
        );
      }
      case 'audio_playlist': {
        return (
          <RadiotekaHorizontalCategoryList
            onTitlePress={() => {
              navigation.push('Playlist', {
                data: item,
              });
            }}
            categoryTitle={item.data.playlist_article.article_title}
            items={item.data.playlist_items.map((a) => ({
              title: a.title,
              // subtitle: a.title,
              // category: a.branch1_title,
              ageRestricted: !!a.age_restriction,
              imageUrl: buildImageUri(IMG_SIZE_L, a.img_path_prefix, a.img_path_postfix),
            }))}
            onItemPress={(index) => {
              pushArticle(navigation, item.data.playlist_items[index]);
            }}
            onItemPlayPress={(index) => {
              setPlaylist(
                new ArticlePlaylist(
                  item.data.playlist_items.map((a) => a.id),
                  index,
                ),
              );
            }}
          />
        );
      }
      default: {
        console.warn('Unknown list item: ', JSON.stringify(item, null, 4));
        return <View />;
      }
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
          contentContainerStyle={{paddingTop: paddingTop ?? 0, paddingBottom: bottom}}
          renderItem={renderItem}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => fetchRadioteka()} />}
          data={data}
          removeClippedSubviews={false}
          keyExtractor={(item, index) => String(index) + String(item)}
          onScroll={onScroll}
        />
      </View>
    </>
  );
};

export default RadiotekaScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

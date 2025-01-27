import React, {useCallback, useEffect, useRef} from 'react';
import {View, RefreshControl, StyleSheet, StatusBar} from 'react-native';
import {FlashList, ListRenderItemInfo} from '@shopify/flash-list';
import {ScreenLoader} from '../../../../components';
import {EVENT_LOGO_PRESS, ARTICLE_EXPIRE_DURATION} from '../../../../constants';
import Gemius from 'react-native-gemius-plugin';
import {EventRegister} from 'react-native-event-listeners';
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
import {useNavigation} from '@react-navigation/native';
import {MainStackParamList} from '../../../../navigation/MainStack';
import {StackNavigationProp} from '@react-navigation/stack';

const WIDGET_ID_HERO = 21;

interface Props {
  isCurrent: boolean;
}

const selectRadiotekaScreenState = (state: ArticleState) => {
  const block = state.radioteka;
  return {
    refreshing: block.isFetching && block.data.length > 0,
    lastFetchTime: block.lastFetchTime,
    data: block.data,
  };
};

const RadiotekaScreen: React.FC<React.PropsWithChildren<Props>> = ({isCurrent}) => {
  const listRef = useRef<FlashList<any>>(null);
  const {colors, dark} = useTheme();

  const navigation = useNavigation<StackNavigationProp<MainStackParamList, 'Home'>>();

  const {fetchRadioteka} = useArticleStore.getState();
  const state = useArticleStore(useShallow(selectRadiotekaScreenState));
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
        fetchRadioteka();
      }
    });
    return () => {
      EventRegister.removeEventListener(listener as string);
    };
  });

  const refresh = useCallback(() => {
    if (!refreshing && Date.now() - lastFetchTime > ARTICLE_EXPIRE_DURATION) {
      console.log('Radioteka data expired!');
      fetchRadioteka();
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

  const renderItem = useCallback((listItem: ListRenderItemInfo<RadiotekaTemplate>) => {
    const {item} = listItem;
    switch (item.type) {
      case 'articles_block': {
        if (item.widget_id === WIDGET_ID_HERO) {
          return <RadiotekaHero block={item} />;
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
                category: a.channel_title,
                imageUrl: buildImageUri(IMG_SIZE_L, a.img_path_prefix, a.img_path_postfix),
              }))}
              onItemPress={(index) => {
                console.log('item pressed', item.data.articles_list[index].title);
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
            keywords={item.data.description.article_keywords}
            categoryTitle={item.data.description.article_title}
            items={item.data.category_list.map((c) => ({
              title: c.title,
              //TODO: need to check if this is correct
              category:
                c.branch_info?.branch_level2?.branch_title ?? c.branch_info?.branch_level1?.branch_title,
              imageUrl: buildImageUri(
                IMG_SIZE_L,
                c.category_images.img1.img_path_prefix,
                c.category_images.img1.img_path_postfix,
              ),
            }))}
            onItemPress={(index) => {
              console.log('item pressed', item.data.category_list[index].title);
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
          return <RadiotekaHeroCarousel items={item.data.articles_list} />;
        }
        if (item.template_id === 42 || item.template_id === 43) {
          return (
            <RadiotekaHorizontalCategoryList
              categoryTitle={item.data.category_title}
              items={item.data.articles_list.map((a) => ({
                title: a.title,
                category: a.channel_title,
                imageUrl: buildImageUri(IMG_SIZE_L, a.img_path_prefix, a.img_path_postfix),
              }))}
              onItemPress={(index) => {
                console.log('item pressed', item.data.articles_list[index].title);
              }}
            />
          );
        }
        break;
      }
      default: {
        // console.warn('Unknown list item: ', JSON.stringify(item, null, 4));
        return <View />;
      }
    }
    return <View />;
  }, []);

  const {bottom} = useSafeAreaInsets();

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
          ref={listRef}
          extraData={{
            lastFetchTime: lastFetchTime,
          }}
          contentContainerStyle={{paddingBottom: bottom}}
          renderItem={renderItem}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => fetchRadioteka()} />}
          data={data}
          removeClippedSubviews={false}
          estimatedFirstItemOffset={500}
          estimatedItemSize={600}
          keyExtractor={(item, index) => String(index) + String(item)}
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

import React, {useCallback, useEffect, useMemo} from 'react';
import {ActivityIndicator, ListRenderItemInfo, StyleSheet, View} from 'react-native';
import {ArticleRow, MyFlatList, ScreenError, ScreenLoader} from '../../components';
import {useTheme} from '../../Theme';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {MainStackParamList} from '../../navigation/MainStack';
import {formatArticles} from '../../util/articleFormatters';
import useNavigationAnalytics from '../../util/useNavigationAnalytics';
import {SavedArticle} from '../../state/article_storage_store';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {pushArticle} from '../../util/NavigationUtils';
import {useHistoryUserArticlesInfinite} from '../../api/hooks/useHistoryArticles';
import {ArticleSearchItem} from '../../api/Types';

type ScreenRouteProp = RouteProp<MainStackParamList, 'History'>;
type ScreenNavigationProp = StackNavigationProp<MainStackParamList, 'History'>;

type Props = {
  route: ScreenRouteProp;
  navigation: ScreenNavigationProp;
};

const mapFavoriteArticles = (article: ArticleSearchItem): SavedArticle => ({
  id: article.id,
  category_title: article.category_title,
  category_id: article.category_id,
  title: article.title,
  url: article.url,
  photo: article.photo,
  subtitle: article.subtitle,
  is_video: article.is_video,
  is_audio: article.is_audio,
});

const HistoryScreen: React.FC<React.PropsWithChildren<Props>> = ({navigation}) => {
  const {strings, colors} = useTheme();

  const {pages, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage} =
    useHistoryUserArticlesInfinite();

  // Format each page independently and concatenate, so already-loaded rows keep their
  // grouping (and identity) when a new page is appended — avoids the whole-list reflow
  // that made the list jump on scroll.
  const articles = useMemo(
    () => pages.flatMap((page) => formatArticles(-1, page.map(mapFavoriteArticles), false)),
    [pages],
  );

  const onEndReached = useCallback(() => {
    // RN can fire onEndReached repeatedly — guard so it's a no-op mid-fetch / at the end.
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: strings.history,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useNavigationAnalytics({
    viewId: 'Lrt app - History',
    title: 'Lrt app -  Istorija / Peržiūrėti straipsniai',
    sections: ['Bendra'],
  });

  const renderItem = (val: ListRenderItemInfo<SavedArticle[]>) => {
    return (
      <ArticleRow
        data={val.item}
        onArticlePress={(article) => {
          pushArticle(navigation, article);
        }}
      />
    );
  };

  const {bottom} = useSafeAreaInsets();

  if (isLoading) {
    return <ScreenLoader />;
  }
  // Full-screen error only guards the initial load. A next-page (fetchNextPage) failure
  // leaves the already-loaded list intact — the footer spinner just stops.
  if (error && pages.length === 0) {
    return <ScreenError text={error.message} />;
  }

  return (
    <View style={styles.container}>
      <MyFlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: bottom}}
        data={articles}
        windowSize={4}
        renderItem={renderItem}
        removeClippedSubviews={false}
        keyExtractor={(item, index) => `${index}-${item.map((i) => i.id)}`}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetchingNextPage ? (
            <ActivityIndicator style={styles.footer} color={colors.primary} />
          ) : null
        }
      />
    </View>
  );
};

export default HistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  footer: {
    paddingVertical: 16,
  },
});

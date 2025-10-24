import React, {useEffect, useMemo} from 'react';
import {ListRenderItemInfo, StyleSheet, View} from 'react-native';
import {ArticleRow, MyFlatList, ScreenError, ScreenLoader} from '../../components';
import {useTheme} from '../../Theme';
import {RouteProp} from '@react-navigation/native';
import {MainStackParamList} from '../../navigation/MainStack';
import {StackNavigationProp} from '@react-navigation/stack';
import {formatArticles} from '../../util/articleFormatters';
import useNavigationAnalytics from '../../util/useNavigationAnalytics';
import {SavedArticle} from '../../state/article_storage_store';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {pushArticle} from '../../util/NavigationUtils';
import {useFavoriteUserArticles} from '../../api/hooks/useFavoriteArticles';
import {ArticleSearchItem} from '../../api/Types';

type ScreenRouteProp = RouteProp<MainStackParamList, 'Favorites'>;
type ScreenNavigationProp = StackNavigationProp<MainStackParamList, 'Favorites'>;

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

const FavoritesScreen: React.FC<React.PropsWithChildren<Props>> = ({navigation}) => {
  const {data, error, isLoading} = useFavoriteUserArticles();

  const responseArticles = data?.items ?? [];

  const articles = useMemo(
    () => formatArticles(-1, responseArticles.map(mapFavoriteArticles), false),
    [responseArticles],
  );

  const {strings} = useTheme();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: strings.favorites,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderItem = (item: ListRenderItemInfo<SavedArticle[]>) => {
    return (
      <ArticleRow
        data={item.item}
        onArticlePress={(article) => {
          pushArticle(navigation, article);
        }}
      />
    );
  };

  useNavigationAnalytics({
    viewId: 'Lrt app - Favorites',
    title: 'Lrt app - Išsaugoti straipsniai',
    sections: ['Bendra'],
  });

  const {bottom} = useSafeAreaInsets();

  if (isLoading && !data) {
    return <ScreenLoader />;
  }
  if (error) {
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
        keyExtractor={(item, index) => String(index) + String(item)}
      />
    </View>
  );
};

export default FavoritesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

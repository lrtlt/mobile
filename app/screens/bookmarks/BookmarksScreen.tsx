import React, {useEffect, useMemo} from 'react';
import {ListRenderItemInfo, StyleSheet, View} from 'react-native';
import {ArticleRow, MyFlatList} from '../../components';
import {useTheme} from '../../Theme';
import {RouteProp} from '@react-navigation/native';
import {MainStackParamList} from '../../navigation/MainStack';
import {StackNavigationProp} from '@react-navigation/stack';
import {formatArticles} from '../../util/articleFormatters';
import useNavigationAnalytics from '../../util/useNavigationAnalytics';
import {SavedArticle, useArticleStorageStore} from '../../state/article_storage_store';

type ScreenRouteProp = RouteProp<MainStackParamList, 'Bookmarks'>;
type ScreenNavigationProp = StackNavigationProp<MainStackParamList, 'Bookmarks'>;

type Props = {
  route: ScreenRouteProp;
  navigation: ScreenNavigationProp;
};

const BookmarksScreen: React.FC<React.PropsWithChildren<Props>> = ({navigation}) => {
  const bookmarkedArticles = useArticleStorageStore((state) => state.savedArticles);

  const articles = useMemo(() => formatArticles(-1, bookmarkedArticles, false), [bookmarkedArticles]);

  const {strings} = useTheme();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: strings.bookmarks,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderItem = (item: ListRenderItemInfo<SavedArticle[]>) => {
    return (
      <ArticleRow
        data={item.item}
        onArticlePress={(article) => navigation.push('Article', {articleId: article.id})}
      />
    );
  };

  useNavigationAnalytics({
    viewId: 'Lrt app - Bookmarks',
    title: 'Lrt app - Išsaugoti straipsniai',
    sections: ['Bendra'],
  });

  return (
    <View style={styles.container}>
      <MyFlatList
        showsVerticalScrollIndicator={false}
        data={articles}
        windowSize={4}
        renderItem={renderItem}
        removeClippedSubviews={false}
        keyExtractor={(item, index) => String(index) + String(item)}
      />
    </View>
  );
};

export default BookmarksScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

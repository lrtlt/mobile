import React, {useMemo} from 'react';
import {View, StyleSheet, ListRenderItemInfo} from 'react-native';
import {ArticleRow, MyFlatList} from '../../components';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {mapArticleStorageData, SavedArticle, useArticleStorageStore} from '../../state/article_storage_store';
import {formatArticles} from '../../util/articleFormatters';
import {useNavigation} from '@react-navigation/native';
import {isMediaArticle} from '../../api/Types';
import {MainStackParamList} from '../../navigation/MainStack';
import {StackNavigationProp} from '@react-navigation/stack';

interface Props {
  type: 'bookmarks' | 'history';
}
const CachedArticlesScreen: React.FC<Props> = ({type}) => {
  const navigation = useNavigation<StackNavigationProp<MainStackParamList, 'Offline'>>();

  const articles = useArticleStorageStore((state) =>
    type === 'bookmarks' ? state.savedArticles : state.history,
  );

  const mappedArticles = articles.map(mapArticleStorageData);
  const formattedArticles = useMemo(() => formatArticles(-1, mappedArticles, false), [mappedArticles]);

  const renderItem = (item: ListRenderItemInfo<SavedArticle[]>) => {
    return (
      <ArticleRow
        data={item.item}
        onArticlePress={(article) => {
          const articleFromStore = articles.find((a) =>
            isMediaArticle(a) ? a.id === article.id : a.article_id === article.id,
          );
          if (articleFromStore) {
            navigation.push('CachedArticle', {
              article: articleFromStore,
            });
          }
        }}
      />
    );
  };

  const {bottom} = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <MyFlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: bottom}}
        data={formattedArticles}
        windowSize={4}
        renderItem={renderItem}
        removeClippedSubviews={false}
        keyExtractor={(item, index) => String(index) + String(item)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default CachedArticlesScreen;

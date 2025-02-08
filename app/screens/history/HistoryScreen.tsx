import React, {useEffect, useMemo} from 'react';
import {ListRenderItemInfo, StyleSheet, View} from 'react-native';
import {ArticleRow, MyFlatList} from '../../components';
import {useTheme} from '../../Theme';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {MainStackParamList} from '../../navigation/MainStack';
import {formatArticles} from '../../util/articleFormatters';
import useNavigationAnalytics from '../../util/useNavigationAnalytics';
import {SavedArticle, useArticleStorageStore} from '../../state/article_storage_store';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type ScreenRouteProp = RouteProp<MainStackParamList, 'History'>;
type ScreenNavigationProp = StackNavigationProp<MainStackParamList, 'History'>;

type Props = {
  route: ScreenRouteProp;
  navigation: ScreenNavigationProp;
};

const HistoryScreen: React.FC<React.PropsWithChildren<Props>> = ({navigation}) => {
  const {strings} = useTheme();

  const historyArticles = useArticleStorageStore((state) => state.history);
  const articles = useMemo(() => formatArticles(-1, historyArticles, false), [historyArticles]);

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
          if (article.is_audio) {
            navigation.push('Podcast', {articleId: article.id});
          } else {
            navigation.push('Article', {articleId: article.id});
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
        data={articles}
        windowSize={4}
        renderItem={renderItem}
        removeClippedSubviews={false}
        keyExtractor={(item, index) => `${index}-${item.map((i) => i.id)}`}
      />
    </View>
  );
};

export default HistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

import React, {useEffect, useMemo} from 'react';
import {ListRenderItemInfo, StyleSheet, View} from 'react-native';
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
import {useContinuePlayingArticles} from '../../api/hooks/useContinuePlayingArticles';
import {ArticleSearchItem} from '../../api/Types';

type ScreenRouteProp = RouteProp<MainStackParamList, 'ContinuePlaying'>;
type ScreenNavigationProp = StackNavigationProp<MainStackParamList, 'ContinuePlaying'>;

type Props = {
  route: ScreenRouteProp;
  navigation: ScreenNavigationProp;
};

const mapArticle = (article: ArticleSearchItem): SavedArticle => ({
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

const ContinuePlayingScreen: React.FC<React.PropsWithChildren<Props>> = ({navigation}) => {
  const {strings} = useTheme();

  const {articles: responseArticles, isLoading, error} = useContinuePlayingArticles();

  const articles = useMemo(
    () => formatArticles(-1, responseArticles.map(mapArticle), false),
    [responseArticles],
  );

  useEffect(() => {
    navigation.setOptions({
      headerTitle: strings.continuePlaying,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useNavigationAnalytics({
    viewId: 'Lrt app - Continue playing',
    title: 'Lrt app - Žiūrėti toliau',
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

  if (isLoading && responseArticles.length === 0) {
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
        keyExtractor={(item, index) => `${index}-${item.map((i) => i.id)}`}
      />
    </View>
  );
};

export default ContinuePlayingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

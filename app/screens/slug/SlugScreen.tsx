import React, {useEffect, useState} from 'react';
import {View, Button, ActivityIndicator, StyleSheet} from 'react-native';
import {ArticleRow, MyFlatList, Text} from '../../components';
import {fetchArticlesByTag} from '../../api';
import {formatArticles} from '../../util/articleFormatters';
import {ARTICLES_PER_PAGE_COUNT} from '../../constants';
import {useTheme} from '../../Theme';
import {MainStackParamList} from '../../navigation/MainStack';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {Article} from '../../../Types';
import useCancellablePromise from '../../hooks/useCancellablePromise';
import useNavigationAnalytics from '../../util/useNavigationAnalytics';

type ScreenRouteProp = RouteProp<MainStackParamList, 'Slug'>;
type ScreenNavigationProp = StackNavigationProp<MainStackParamList, 'Slug'>;

type Props = {
  route: ScreenRouteProp;
  navigation: ScreenNavigationProp;
};

type ScreenState = {
  isFetching: boolean;
  isError: boolean;
  articles: Article[][];
};

const SlugScreen: React.FC<React.PropsWithChildren<Props>> = ({navigation, route}) => {
  const {colors, strings} = useTheme();

  const [state, setState] = useState<ScreenState>({
    isFetching: false,
    isError: false,
    articles: [],
  });

  const {name, slugUrl} = route.params;

  const cancellablePromise = useCancellablePromise();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: name,
    });

    startLoading();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useNavigationAnalytics({
    viewId: `https://www.lrt.lt/${slugUrl}`,
    title: name,
    sections: ['slug'],
  });

  const startLoading = () => {
    setState({
      isFetching: true,
      isError: false,
      articles: [],
    });

    const urlSegments = slugUrl?.split('/');

    if (!urlSegments || urlSegments.length === 0) {
      setState({
        ...state,
        isFetching: false,
        isError: true,
      });
      return;
    }

    const tag = urlSegments[urlSegments.length - 1];

    cancellablePromise(fetchArticlesByTag(tag, ARTICLES_PER_PAGE_COUNT * 6))
      .then((response) => {
        const formattedArticles = formatArticles(-1, response.articles, false);
        setState({
          isFetching: false,
          isError: false,
          articles: formattedArticles,
        });
      })
      .catch((error) => {
        console.log('Error:', error);
        setState({
          ...state,
          isFetching: false,
          isError: true,
        });
      });
  };

  const renderLoading = () => {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size={'small'} animating={state.isFetching} />
      </View>
    );
  };

  const renderError = () => {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText} type="error">
          {strings.error_no_connection}
        </Text>
        <Button title={strings.tryAgain} color={colors.primary} onPress={() => startLoading()} />
      </View>
    );
  };

  const {isFetching, isError, articles} = state;

  let content;
  if (isError) {
    content = renderError();
  } else if (isFetching) {
    content = renderLoading();
  } else {
    content = (
      <MyFlatList
        showsVerticalScrollIndicator={false}
        data={articles}
        windowSize={4}
        renderItem={(item) => {
          return (
            <ArticleRow
              data={item.item}
              onArticlePress={(article) => navigation.push('Article', {articleId: article.id})}
            />
          );
        }}
        removeClippedSubviews={false}
        keyExtractor={(item, index) => String(index) + String(item)}
      />
    );
  }

  return (
    <View style={styles.root}>
      <View style={styles.container}>{content}</View>
    </View>
  );
};

export default SlugScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    marginBottom: 20,
    fontSize: 20,
  },
});

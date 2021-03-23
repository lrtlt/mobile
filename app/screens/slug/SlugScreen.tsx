import React, {useEffect, useState} from 'react';
import {View, Button, ActivityIndicator, StyleSheet, ListRenderItemInfo} from 'react-native';
import {ArticleRow, Text} from '../../components';
import {getOrientation} from '../../util/UI';
import {fetchArticlesByTag} from '../../api';
import {formatArticles} from '../../util/articleFormatters';
import {ARTICLES_PER_PAGE_COUNT} from '../../constants';
import {FlatList} from 'react-native-gesture-handler';
import {useTheme} from '../../Theme';
import {MainStackParamList} from '../../navigation/MainStack';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {Article} from '../../../Types';

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

const SlugScreen: React.FC<Props> = ({navigation, route}) => {
  const {colors, strings} = useTheme();

  const [state, setState] = useState<ScreenState>({
    isFetching: false,
    isError: false,
    articles: [],
  });

  const {name, slugUrl} = route.params;

  useEffect(() => {
    navigation.setOptions({
      headerTitle: name,
    });

    startLoading();
  }, []);

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

    fetchArticlesByTag(tag, ARTICLES_PER_PAGE_COUNT * 3)
      .then((response) => {
        const formattedArticles = formatArticles(-1, response.articles);
        setState({
          isFetching: false,
          isError: false,
          articles: formattedArticles,
        });
      })
      .catch((error) => {
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
      <FlatList
        showsVerticalScrollIndicator={false}
        data={articles}
        windowSize={4}
        extraData={{
          orientation: getOrientation(),
        }}
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
    fontFamily: 'SourceSansPro-Regular',
    marginBottom: 20,
    fontSize: 20,
  },
});

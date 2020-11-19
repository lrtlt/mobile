import React, {useEffect, useState} from 'react';
import {View, Button, ActivityIndicator, StyleSheet} from 'react-native';
import {ArticleRow, Text} from '../../components';
import {getOrientation} from '../../util/UI';
import {articleGetByTag} from '../../api';
import {formatArticles} from '../../util/articleFormatters';
import {ARTICLES_PER_PAGE_COUNT, GEMIUS_VIEW_SCRIPT_ID} from '../../constants';
import Gemius from 'react-native-gemius-plugin';
import {FlatList} from 'react-native-gesture-handler';
import {useTheme} from '../../Theme';

const SlugScreen = (props) => {
  const {colors, strings} = useTheme();

  const {navigation, route} = props;

  const [state, setState] = useState({
    isFetching: false,
    isError: false,
    articles: [],
  });

  const {category} = route.params;

  useEffect(() => {
    navigation.setOptions({
      headerTitle: category.name,
    });

    Gemius.sendPageViewedEvent(GEMIUS_VIEW_SCRIPT_ID, {
      page: 'slug',
      slugUrl: category.slug_url,
    });

    startLoading();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startLoading = () => {
    setState({
      isFetching: true,
      isError: false,
      articles: [],
    });

    callApi()
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

  const callApi = async () => {
    const urlSegments = category.slug_url.split('/');
    const tag = urlSegments[urlSegments.length - 1];
    const response = await fetch(articleGetByTag(tag, ARTICLES_PER_PAGE_COUNT * 3));
    const result = await response.json();
    console.log('ARTICLES BY TAG API RESPONSE', result);
    return result;
  };

  const renderItem = (val) => {
    return (
      <ArticleRow
        data={val.item}
        onArticlePress={(article) => navigation.push('Article', {articleId: article.id})}
      />
    );
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
  if (isError === true) {
    content = renderError();
  } else if (isFetching === true) {
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
        renderItem={renderItem}
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

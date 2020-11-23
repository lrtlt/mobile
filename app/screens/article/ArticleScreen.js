import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {saveArticle, removeArticle, addArticleToHistory} from '../../redux/actions';
import {articleGet} from '../../api';
import ArticleContent from './ArticleContent';
import {useDispatch, useSelector} from 'react-redux';
import {CommentsIcon, ShareIcon, SaveIcon} from '../../components/svg';
import Share from 'react-native-share';
import Gemius from 'react-native-gemius-plugin';
import {GEMIUS_VIEW_SCRIPT_ID} from '../../constants';
import Snackbar from 'react-native-snackbar';
import {ScreenLoader, ScreenError, AdultContentWarning, ActionButton} from '../../components';
import {selectArticleBookmarked} from '../../redux/selectors';
import {useTheme} from '../../Theme';

const STATE_LOADING = 'loading';
const STATE_ADULT_CONTENT_WARNING = 'adult-content-warning';
const STATE_ERROR = 'error';
const STATE_READY = 'ready';

const ArticleScreen = (props) => {
  const {navigation, route} = props;

  const {colors, dim, strings} = useTheme();

  const dispatch = useDispatch();

  const [state, setState] = useState({
    article: null,
    loadingState: STATE_LOADING,
  });

  const {articleId} = route.params;
  console.log('articleId', articleId);

  const {article} = state;

  const isBookmarked = useSelector(selectArticleBookmarked(articleId));

  useEffect(() => {
    loadArticle(articleId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articleId]);

  useEffect(() => {
    if (!article) {
      return;
    }

    const _saveArticlePress = () => {
      if (isBookmarked) {
        dispatch(removeArticle(article.article_id));
      } else {
        dispatch(saveArticle(article));
        Snackbar.show({
          text: strings.articleHasBeenSaved,
          duration: Snackbar.LENGTH_SHORT,
        });
      }
    };

    const _handleSharePress = () => {
      const url = `https://lrt.lt${article.article_url || article.url}`;
      Share.open({url});
    };

    const _handleCommentsPress = () => {
      if (article.article_url) {
        navigation.navigate('Comments', {url: `https://lrt.lt${article.article_url}`});
      }
    };

    navigation.setOptions({
      headerRight: () => (
        <View style={styles.row}>
          <ActionButton onPress={() => _saveArticlePress()}>
            <SaveIcon size={dim.appBarIconSize} color={colors.headerTint} filled={isBookmarked} />
          </ActionButton>
          <ActionButton onPress={() => _handleCommentsPress()}>
            <CommentsIcon size={dim.appBarIconSize} color={colors.headerTint} />
          </ActionButton>
          <ActionButton onPress={() => _handleSharePress()}>
            <ShareIcon size={dim.appBarIconSize} color={colors.headerTint} />
          </ActionButton>
        </View>
      ),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [article, isBookmarked]);

  const callApi = async () => {
    const response = await fetch(articleGet(articleId));
    const result = await response.json();
    console.log('ARTICLE API RESPONSE', result);
    return result;
  };

  const loadArticle = () => {
    try {
      Gemius.sendPageViewedEvent(GEMIUS_VIEW_SCRIPT_ID, {
        screen: 'article',
        articleId: articleId.toString(),
      });
    } catch (e) {
      console.log(e);
      setState({
        ...state,
        article: null,
        loadingState: STATE_ERROR,
      });
      return;
    }

    setState({
      ...state,
      article: null,
      loadingState: STATE_LOADING,
    });

    callApi(articleId)
      .then((a) => parseArticle(a.article))
      .catch((e) => {
        console.log(e);
        setState({
          ...state,
          article: null,
          loadingState: STATE_ERROR,
        });
      });
  };

  const parseArticle = (articleFromApi) => {
    const loadingState =
      articleFromApi === null
        ? STATE_ERROR
        : articleFromApi['n-18']
        ? STATE_ADULT_CONTENT_WARNING
        : STATE_READY;

    setState({
      ...state,
      isLoading: false,
      article: articleFromApi,
      loadingState: loadingState,
    });

    dispatch(addArticleToHistory(articleFromApi));
  };

  const renderLoading = () => (
    <View style={styles.screen}>
      <ScreenLoader />
    </View>
  );

  const renderError = () => (
    <View style={styles.screen}>
      <ScreenError text={strings.articleError} />
    </View>
  );

  const renderAdultContentWarning = () => (
    <View style={styles.screen}>
      <View style={styles.centerContainer}>
        <AdultContentWarning
          onAccept={() =>
            setState({
              ...state,
              loadingState: STATE_READY,
            })
          }
          onDecline={() => navigation.goBack()}
        />
      </View>
    </View>
  );

  const renderArticleComponent = () => {
    let articleComponent;
    if (article) {
      articleComponent = <ArticleContent article={article} itemPressHandler={_handleItemPress} />;
    } else {
      articleComponent = <View />;
    }
    return <View style={styles.screen}>{articleComponent}</View>;
  };

  const _handleItemPress = (item) => {
    switch (item.type) {
      case 'photo': {
        const images = article.article_photos;
        if (!images) {
          return;
        }

        navigation.navigate('Gallery', {
          images,
          selectedImage: item.item,
        });
        break;
      }
      case 'article': {
        navigation.push('Article', {articleId: item.item.id});
        break;
      }
      default: {
        console.warn('Unkown type selected ' + item.type);
        break;
      }
    }
  };

  switch (state.loadingState) {
    case STATE_LOADING: {
      return renderLoading();
    }
    case STATE_ERROR: {
      return renderError();
    }
    case STATE_ADULT_CONTENT_WARNING: {
      return renderAdultContentWarning();
    }
    case STATE_READY: {
      return renderArticleComponent();
    }
  }
};

export default ArticleScreen;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  screen: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

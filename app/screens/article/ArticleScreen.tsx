import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {saveArticle, removeArticle, addArticleToHistory} from '../../redux/actions';
import {fetchArticle} from '../../api';
import ArticleContentComponent from './ArticleContentComponent';
import {useDispatch, useSelector} from 'react-redux';
import {ShareIcon, SaveIcon, IconComments} from '../../components/svg';
import Share from 'react-native-share';
import Snackbar from 'react-native-snackbar';
import {ScreenLoader, ScreenError, AdultContentWarning, ActionButton} from '../../components';
import {selectArticleBookmarked} from '../../redux/selectors';
import {useTheme} from '../../Theme';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ArticleContent, isDefaultArticle} from '../../api/Types';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {MainStackParamList} from '../../navigation/MainStack';

type ScreenRouteProp = RouteProp<MainStackParamList, 'Article'>;
type ScreenNavigationProp = StackNavigationProp<MainStackParamList, 'Article'>;

type Props = {
  route: ScreenRouteProp;
  navigation: ScreenNavigationProp;
};

type ScreenState = {
  article?: ArticleContent;
  loadingState:
    | typeof STATE_LOADING
    | typeof STATE_ERROR
    | typeof STATE_READY
    | typeof STATE_ADULT_CONTENT_WARNING;
};

const STATE_LOADING = 'loading';
const STATE_ADULT_CONTENT_WARNING = 'adult-content-warning';
const STATE_ERROR = 'error';
const STATE_READY = 'ready';

const ArticleScreen: React.FC<Props> = ({navigation, route}) => {
  const {colors, dim, strings} = useTheme();

  const dispatch = useDispatch();

  const [state, setState] = useState<ScreenState>({
    article: undefined,
    loadingState: STATE_LOADING,
  });

  const {articleId} = route.params;
  console.log('articleId', articleId);

  const {article} = state;

  const isBookmarked = useSelector(selectArticleBookmarked(articleId));

  useEffect(() => {
    loadArticle();
  }, [articleId]);

  useEffect(() => {
    if (!article) {
      return;
    }

    const _saveArticlePress = () => {
      if (isBookmarked) {
        if (isDefaultArticle(article)) {
          dispatch(removeArticle(article.article_id));
        } else {
          dispatch(removeArticle(article.id));
        }
      } else {
        dispatch(saveArticle(article));
        Snackbar.show({
          text: strings.articleHasBeenSaved,
          duration: Snackbar.LENGTH_SHORT,
        });
      }
    };

    const _handleSharePress = () => {
      if (isDefaultArticle(article)) {
        const url = `https://lrt.lt${article.article_url}`;
        Share.open({url});
      } else {
        const url = `https://lrt.lt${article.url}`;
        Share.open({url});
      }
    };

    const _handleCommentsPress = () => {
      if (isDefaultArticle(article)) {
        navigation.navigate('Comments', {url: `https://lrt.lt${article.article_url}`});
      } else {
        navigation.navigate('Comments', {url: `https://lrt.lt${article.url}`});
      }
    };

    navigation.setOptions({
      headerRight: () => (
        <View style={styles.row}>
          <ActionButton onPress={() => _saveArticlePress()}>
            <SaveIcon size={dim.appBarIconSize} color={colors.headerTint} filled={isBookmarked} />
          </ActionButton>
          <ActionButton onPress={() => _handleCommentsPress()}>
            <IconComments size={dim.appBarIconSize} color={colors.headerTint} />
          </ActionButton>
          <ActionButton onPress={() => _handleSharePress()}>
            <ShareIcon size={dim.appBarIconSize} color={colors.headerTint} />
          </ActionButton>
        </View>
      ),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [article, isBookmarked]);

  const loadArticle = () => {
    setState({
      ...state,
      article: undefined,
      loadingState: STATE_LOADING,
    });

    fetchArticle(articleId)
      .then((response) => {
        const article = response.article;
        const loadingState = !article
          ? STATE_ERROR
          : article['n-18']
          ? STATE_ADULT_CONTENT_WARNING
          : STATE_READY;

        setState({
          ...state,
          article,
          loadingState: loadingState,
        });
        dispatch(addArticleToHistory(article));
      })
      .catch((e) => {
        console.log(e);
        setState({
          ...state,
          article: undefined,
          loadingState: STATE_ERROR,
        });
      });
  };

  switch (state.loadingState) {
    case STATE_LOADING: {
      return (
        <View style={styles.screen}>
          <ScreenLoader />
        </View>
      );
    }
    case STATE_ERROR: {
      return (
        <View style={styles.screen}>
          <ScreenError text={strings.articleError} />
        </View>
      );
    }
    case STATE_ADULT_CONTENT_WARNING: {
      return (
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
    }
    case STATE_READY: {
      return (
        <SafeAreaView style={styles.screen} edges={['bottom']}>
          <ArticleContentComponent
            article={article!}
            itemPressHandler={(item) => {
              switch (item.type) {
                case 'photo': {
                  const images = isDefaultArticle(article) ? article.article_photos : undefined;
                  if (images) {
                    navigation.navigate('Gallery', {
                      images,
                      selectedImage: item.item,
                    });
                  }
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
            }}
          />
        </SafeAreaView>
      );
    }
    default: {
      return (
        <View style={styles.screen}>
          <ScreenLoader />
        </View>
      );
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

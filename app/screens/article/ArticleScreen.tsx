import React, {useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import ArticleContentComponent, {ArticleSelectableItem} from './ArticleContentComponent';
import {ScreenLoader, ScreenError, AdultContentWarning} from '../../components';
import {useTheme} from '../../Theme';
import {SafeAreaView} from 'react-native-safe-area-context';
import {isDefaultArticle} from '../../api/Types';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {MainStackParamList} from '../../navigation/MainStack';
import useArticleScreenState from './useArticleScreenState';
import useArticleHeader from './useArticleHeader';

type ScreenRouteProp = RouteProp<MainStackParamList, 'Article'>;
type ScreenNavigationProp = StackNavigationProp<MainStackParamList, 'Article'>;

type Props = {
  route: ScreenRouteProp;
  navigation: ScreenNavigationProp;
};

const ArticleScreen: React.FC<Props> = ({navigation, route}) => {
  const {articleId} = route.params;
  console.log('articleId', articleId);

  const {strings} = useTheme();

  const [{article, loadingState}, acceptAdultContent] = useArticleScreenState(articleId);

  useArticleHeader(article);

  const adultContentAcceptHandler = useCallback(() => {
    acceptAdultContent(true);
  }, [acceptAdultContent]);

  const adultContentDeclineHandler = useCallback(() => {
    acceptAdultContent(false);
  }, [acceptAdultContent]);

  const articleItemPressHandler = useCallback(
    (item: ArticleSelectableItem) => {
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
    },
    [article, navigation],
  );

  switch (loadingState) {
    case 'loading': {
      return (
        <View style={styles.screen}>
          <ScreenLoader />
        </View>
      );
    }
    case 'error': {
      return (
        <View style={styles.screen}>
          <ScreenError text={strings.articleError} />
        </View>
      );
    }
    case 'adult-content-warning': {
      return (
        <View style={styles.screen}>
          <View style={styles.centerContainer}>
            <AdultContentWarning
              onAccept={adultContentAcceptHandler}
              onDecline={adultContentDeclineHandler}
            />
          </View>
        </View>
      );
    }
    case 'ready': {
      return (
        <SafeAreaView style={styles.screen} edges={['bottom']}>
          <ArticleContentComponent article={article!} itemPressHandler={articleItemPressHandler} />
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
  screen: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

import {StackNavigationProp} from '@react-navigation/stack';
import {MainStackParamList} from '../navigation/MainStack';

type ArticleNavigationProps = {
  id: number;
  is_video?: 0 | 1 | undefined;
  is_audio?: 0 | 1 | undefined;
};
type NavigationProp = StackNavigationProp<MainStackParamList>;

export const pushArticle = (navigation: NavigationProp, article: ArticleNavigationProps) => {
  if (article.is_audio) {
    navigation.push('Podcast', {articleId: article.id});
  } else if (article.is_video) {
    navigation.push('Vodcast', {articleId: article.id});
  } else {
    navigation.push('Article', {articleId: article.id});
  }
};

export const navigateArticle = (navigation: NavigationProp, article: ArticleNavigationProps) => {
  if (article.is_audio) {
    navigation.navigate('Podcast', {articleId: article.id});
  } else if (article.is_video) {
    navigation.navigate('Vodcast', {articleId: article.id});
  } else {
    navigation.navigate('Article', {articleId: article.id});
  }
};

export const replaceArticle = (navigation: NavigationProp, article: ArticleNavigationProps) => {
  if (article.is_audio) {
    navigation.replace('Podcast', {articleId: article.id});
  } else if (article.is_video) {
    navigation.replace('Vodcast', {articleId: article.id});
  } else {
    navigation.replace('Article', {articleId: article.id});
  }
};

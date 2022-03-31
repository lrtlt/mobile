import {useNavigation} from '@react-navigation/core';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import Share from 'react-native-share';
import Snackbar from 'react-native-snackbar';
import {useDispatch, useSelector} from 'react-redux';
import {ArticleContent, isDefaultArticle} from '../../api/Types';
import {ActionButton} from '../../components';
import {SaveIcon, ShareIcon} from '../../components/svg';
import {MainStackParamList} from '../../navigation/MainStack';
import {removeArticle, saveArticle} from '../../redux/actions';
import {selectArticleBookmarked} from '../../redux/selectors';
import {useTheme} from '../../Theme';

const getArticleId = (article?: ArticleContent) => {
  if (!article) {
    return -1;
  }

  if (isDefaultArticle(article)) {
    return article.article_id;
  } else {
    return article.id;
  }
};

const useArticleHeader = (article?: ArticleContent) => {
  const navigation = useNavigation<StackNavigationProp<MainStackParamList, 'Article'>>();
  const {colors, dim, strings} = useTheme();

  const dispatch = useDispatch();
  const isBookmarked = useSelector(selectArticleBookmarked(getArticleId(article)));

  useEffect(() => {
    if (!article) {
      return;
    }

    const _saveArticlePress = () => {
      if (isBookmarked) {
        dispatch(removeArticle(getArticleId(article)));
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
        Share.open({
          title: 'LRT',
          message: article.article_title,
          url,
        });
      } else {
        const url = `https://lrt.lt${article.url}`;
        Share.open({
          title: 'LRT',
          message: article.title,
          url,
        });
      }
    };

    // const _handleCommentsPress = () => {
    //   if (isDefaultArticle(article)) {
    //     navigation.navigate('Comments', {url: `https://lrt.lt${article.article_url}`});
    //   } else {
    //     navigation.navigate('Comments', {url: `https://lrt.lt${article.url}`});
    //   }
    // };

    navigation.setOptions({
      headerRight: () => (
        <View style={styles.row}>
          <ActionButton onPress={() => _saveArticlePress()}>
            <SaveIcon size={dim.appBarIconSize} color={colors.headerTint} filled={isBookmarked} />
          </ActionButton>
          {/* <ActionButton onPress={() => _handleCommentsPress()}>
            <IconComments size={dim.appBarIconSize} color={colors.headerTint} />
          </ActionButton> */}
          <ActionButton onPress={() => _handleSharePress()}>
            <ShareIcon size={dim.appBarIconSize} color={colors.headerTint} />
          </ActionButton>
        </View>
      ),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [article, isBookmarked]);
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default useArticleHeader;

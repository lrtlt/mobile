import {useNavigation} from '@react-navigation/core';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import Share from 'react-native-share';
import {ArticleContent, isDefaultArticle} from '../../api/Types';
import {ActionButton} from '../../components';
import {SaveIcon, ShareIcon} from '../../components/svg';
import {MainStackParamList} from '../../navigation/MainStack';
import {themeLight, useTheme} from '../../Theme';
import Snackbar from '../../components/snackbar/SnackBar';
import {useArticleStorageStore} from '../../state/article_storage_store';

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
  const [snackbar, setSnackbar] = React.useState<React.ReactElement>();
  const {colors, dim, strings} = useTheme();

  const articleStorage = useArticleStorageStore.getState();

  const isBookmarked = useArticleStorageStore((state) =>
    state.savedArticles.some((a) => a.id === getArticleId(article)),
  );

  useEffect(() => {
    if (!article) {
      return;
    }

    const _saveArticlePress = () => {
      if (isBookmarked) {
        articleStorage.removeArticle(getArticleId(article));
        setSnackbar(undefined);
      } else {
        articleStorage.saveArticle(article);
        setSnackbar(
          <Snackbar message={strings.articleHasBeenSaved} backgroundColor={themeLight.colors.primaryDark} />,
        );
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

  return snackbar;
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default useArticleHeader;

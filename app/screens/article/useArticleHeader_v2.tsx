import {useNavigation} from '@react-navigation/core';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useEffect} from 'react';
import {Animated, ScrollViewProps, StyleSheet, View} from 'react-native';
import Share from 'react-native-share';
import {ArticleContent, isDefaultArticle} from '../../api/Types';
import {ActionButton, AnimatedAppBar} from '../../components';
import {SaveIcon, ShareIcon} from '../../components/svg';
import {MainStackParamList} from '../../navigation/MainStack';
import {themeLight, useTheme} from '../../Theme';
import Snackbar from '../../components/snackbar/SnackBar';
import useAppBarHeight from '../../components/appBar/useAppBarHeight';
import {useArticleStorageStore} from '../../state/article_storage_store';
import {
  useAddFavoriteUserArticle,
  useDeleteFavoriteUserArticle,
  useIsFavoriteUserArticle,
} from '../../api/hooks/useFavoriteArticles';

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
  const [actions, setActions] = React.useState<React.ReactElement>();

  const {colors, dim, strings} = useTheme();

  const articleStorage = useArticleStorageStore.getState();

  const {mutate: addFavoriteArticle} = useAddFavoriteUserArticle();
  const {mutate: deleteFavoriteArticle} = useDeleteFavoriteUserArticle();
  const {data: isFavorite} = useIsFavoriteUserArticle(getArticleId(article));

  const {fullHeight: appBarHeight} = useAppBarHeight();
  const scrollY = new Animated.Value(0);
  const diffClamp = Animated.diffClamp(scrollY, 0, appBarHeight * 2);
  const translateY = diffClamp.interpolate({
    inputRange: [0, appBarHeight, appBarHeight * 2],
    outputRange: [0, 0, -appBarHeight],
  });

  const onScroll: ScrollViewProps['onScroll'] = (e) => {
    const y = e.nativeEvent.contentOffset.y;
    if (y > 0) scrollY.setValue(e.nativeEvent.contentOffset.y);
  };

  useEffect(() => {
    if (!article) {
      return;
    }

    const _saveArticlePress = () => {
      if (isFavorite) {
        articleStorage.removeArticle(getArticleId(article));
        deleteFavoriteArticle(getArticleId(article));
        setSnackbar(undefined);
      } else {
        articleStorage.saveArticle(article);
        addFavoriteArticle(getArticleId(article));
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
          // message: article.article_title,
          url,
        });
      } else {
        const url = `https://lrt.lt${article.url}`;
        Share.open({
          title: 'LRT',
          // message: article.title,
          url,
        });
      }
    };

    setActions(
      <View style={styles.row}>
        <ActionButton onPress={() => _saveArticlePress()} accessibilityLabel="Išsaugoti straipsnį">
          <SaveIcon size={dim.appBarIconSize + 4} color={colors.headerTint} filled={isFavorite} />
        </ActionButton>
        <ActionButton onPress={() => _handleSharePress()} accessibilityLabel="Dalintis straipsniu">
          <ShareIcon size={dim.appBarIconSize} color={colors.headerTint} />
        </ActionButton>
      </View>,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [article, isFavorite]);

  const appBar = (
    <AnimatedAppBar translateY={translateY} onBackPress={() => navigation.goBack()} actions={actions} />
  );

  return {
    appBar,
    snackbar,
    onScroll,
  };
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default useArticleHeader;

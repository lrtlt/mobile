import {useNavigation} from '@react-navigation/core';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useEffect} from 'react';
import {Animated, ScrollViewProps, StyleSheet, View} from 'react-native';
import Share from 'react-native-share';
import {useDispatch, useSelector} from 'react-redux';
import {ArticleContent, isDefaultArticle} from '../../api/Types';
import {ActionButton, AnimatedAppBar} from '../../components';
import {SaveIcon, ShareIcon} from '../../components/svg';
import {MainStackParamList} from '../../navigation/MainStack';
import {removeArticle, saveArticle} from '../../redux/actions';
import {selectArticleBookmarked} from '../../redux/selectors';
import {themeLight, useTheme} from '../../Theme';
import Snackbar from '../../components/snackbar/SnackBar';
import useAppBarHeight from '../../components/appBar/useAppBarHeight';

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

  const dispatch = useDispatch();
  const isBookmarked = useSelector(selectArticleBookmarked(getArticleId(article)));

  const {fullHeight: appBarHeight} = useAppBarHeight();
  const scrollY = new Animated.Value(0);
  const diffClamp = Animated.diffClamp(scrollY, 0, appBarHeight);
  const translateY = diffClamp.interpolate({
    inputRange: [0, appBarHeight],
    outputRange: [0, -appBarHeight],
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
      if (isBookmarked) {
        dispatch(removeArticle(getArticleId(article)));
        setSnackbar(undefined);
      } else {
        dispatch(saveArticle(article));
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

    setActions(
      <View style={styles.row}>
        <ActionButton onPress={() => _saveArticlePress()}>
          <SaveIcon size={dim.appBarIconSize} color={colors.headerTint} filled={isBookmarked} />
        </ActionButton>
        <ActionButton onPress={() => _handleSharePress()}>
          <ShareIcon size={dim.appBarIconSize} color={colors.headerTint} />
        </ActionButton>
      </View>,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [article, isBookmarked]);

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
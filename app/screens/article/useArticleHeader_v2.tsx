import {useIsFocused, useNavigation} from '@react-navigation/core';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useEffect} from 'react';
import {Animated, ScrollViewProps, StyleSheet, View} from 'react-native';
import Share from 'react-native-share';
import {ArticleContent, isDefaultArticle} from '../../api/Types';
import {ActionButton, AnimatedAppBar, Text, TouchableDebounce} from '../../components';
import {IconBookmarkNew, ShareIcon} from '../../components/svg';
import {MainStackParamList} from '../../navigation/MainStack';
import {useTheme} from '../../Theme';
import useAppBarHeight from '../../components/appBar/useAppBarHeight';
import {useArticleStorageStore} from '../../state/article_storage_store';
import {
  useAddFavoriteUserArticle,
  useDeleteFavoriteUserArticle,
  useIsFavoriteUserArticle,
} from '../../api/hooks/useFavoriteArticles';
import {useAuth0} from 'react-native-auth0';
import PleaseLoginModal from './PleaseLoginModal';

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
  const [actions, setActions] = React.useState<React.ReactElement>();
  const [modalVisible, setModalVisible] = React.useState(false);

  const {user} = useAuth0();
  const {colors, dim} = useTheme();
  const articleStorage = useArticleStorageStore.getState();
  const isFocused = useIsFocused();

  const {mutate: addFavoriteArticle} = useAddFavoriteUserArticle();
  const {mutate: deleteFavoriteArticle} = useDeleteFavoriteUserArticle();
  const {data: isFavorite} = useIsFavoriteUserArticle(getArticleId(article), !!user && isFocused);

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
      if (!user) {
        console.log('User not logged in, showing login modal');
        setModalVisible(true);
        return;
      }

      if (isFavorite) {
        console.log('Removing article from favorites');
        articleStorage.removeArticle(getArticleId(article));
        deleteFavoriteArticle(getArticleId(article));
      } else {
        console.log('Adding article to favorites');
        articleStorage.saveArticle(article);
        addFavoriteArticle(getArticleId(article));
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
      <View style={[styles.row, {borderColor: colors.border}]}>
        <TouchableDebounce style={{flexDirection: 'row', alignItems: 'center'}} onPress={_saveArticlePress}>
          <ActionButton onPress={_saveArticlePress} accessibilityLabel="Išsaugoti straipsnį">
            <IconBookmarkNew
              size={dim.appBarIconSize}
              color={isFavorite ? colors.iconActive : colors.headerTint}
            />
          </ActionButton>
          <Text>{isFavorite ? 'Išsaugota' : 'Saugoti'}</Text>
        </TouchableDebounce>
        <View style={[styles.divider, {backgroundColor: colors.border}]} />
        <ActionButton onPress={_handleSharePress} accessibilityLabel="Dalintis straipsniu">
          <ShareIcon size={dim.appBarIconSize} color={colors.headerTint} />
        </ActionButton>
        <PleaseLoginModal
          visible={modalVisible}
          title="Norėdami išsaugoti straipsnį, prisijunkite prie savo paskyros."
          onConfirm={() => {
            setModalVisible(false);
            navigation.navigate('User');
          }}
          onCancel={() => setModalVisible(false)}
        />
      </View>,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [article, isFavorite, user, modalVisible]);

  const appBar = (
    <AnimatedAppBar translateY={translateY} onBackPress={() => navigation.goBack()} actions={actions} />
  );

  return {
    appBar,
    onScroll,
  };
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 32,
    borderRadius: 6,
    gap: 8,
    paddingHorizontal: 8,
    marginHorizontal: 8,
    borderWidth: StyleSheet.hairlineWidth,
  },
  divider: {
    height: '100%',
    width: StyleSheet.hairlineWidth,
  },
});

export default useArticleHeader;

import {useIsFocused, useNavigation} from '@react-navigation/core';
import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {Animated, ScrollViewProps, StyleSheet, View} from 'react-native';
import Share from 'react-native-share';
import {ArticleContent, isDefaultArticle} from '../../api/Types';
import {AnimatedAppBar, Text, TouchableDebounce} from '../../components';
import {IconBookmarkNew, IconSubscribe, IconSubscribeActive, ShareIcon} from '../../components/svg';
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
import {useIsSubscribed, useUpdateSubscription} from '../../api/hooks/usePushNotifications';

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

const EXTRA_HIT_SLOP = 6;

const useArticleHeader = (article?: ArticleContent) => {
  const navigation = useNavigation<StackNavigationProp<MainStackParamList, 'Article'>>();

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

  const appBar = (
    <AnimatedAppBar
      translateY={translateY}
      onBackPress={() => navigation.goBack()}
      headerRight={() => <HeaderRight article={article} />}
    />
  );

  return {
    appBar,
    onScroll,
  };
};

const HeaderRight: React.FC<{article?: ArticleContent}> = ({article}) => {
  const [modalVisible, setModalVisible] = React.useState(false);

  const navigation = useNavigation<StackNavigationProp<MainStackParamList, 'Article'>>();

  const {user} = useAuth0();
  const isFocused = useIsFocused();

  const {colors, dim} = useTheme();
  const articleStorage = useArticleStorageStore.getState();

  const {mutate: addFavoriteArticle} = useAddFavoriteUserArticle();
  const {mutate: deleteFavoriteArticle} = useDeleteFavoriteUserArticle();

  const {mutate: updateSubscription} = useUpdateSubscription();
  const isSubscribed = useIsSubscribed(article?.category_id ?? 0, !!user && isFocused);

  const {data: isFavorite} = useIsFavoriteUserArticle(getArticleId(article), !!user && isFocused);

  const _saveArticlePress = () => {
    if (!article) {
      return;
    }

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

  const _subscribePress = () => {
    if (!article || !article.category_id) {
      return;
    }

    if (!user) {
      console.log('User not logged in, showing login modal');
      setModalVisible(true);
      return;
    }

    const category_id = article.category_id;
    const newStatus = !isSubscribed;
    const subscriptionKey = `category-${category_id}`;

    updateSubscription({
      subscription_key: subscriptionKey,
      name: article.category_title || subscriptionKey,
      is_active: newStatus,
    });
  };

  const _handleSharePress = () => {
    if (!article) {
      return;
    }

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

  return (
    <View style={[styles.row, {borderColor: colors.border}]}>
      <TouchableDebounce
        accessibilityLabel="Išsaugoti straipsnį"
        style={styles.buttonContainer}
        hitSlop={{
          top: EXTRA_HIT_SLOP,
          bottom: EXTRA_HIT_SLOP,
        }}
        onPress={_saveArticlePress}>
        <IconBookmarkNew
          size={dim.appBarIconSize - 4}
          color={isFavorite ? colors.iconActive : colors.headerTint}
        />
        <Text>{isFavorite ? 'Išsaugota' : 'Saugoti'}</Text>
      </TouchableDebounce>
      {article?.is_video || article?.is_audio ? (
        <>
          <View style={[styles.divider, {backgroundColor: colors.border}]} />
          <TouchableDebounce
            accessibilityLabel="Prenumeruoti"
            style={styles.buttonContainer}
            hitSlop={{
              top: EXTRA_HIT_SLOP,
              bottom: EXTRA_HIT_SLOP,
            }}
            onPress={_subscribePress}>
            {isSubscribed ? (
              <IconSubscribeActive size={dim.appBarIconSize - 7} color={colors.iconActive} />
            ) : (
              <IconSubscribe size={dim.appBarIconSize - 7} color={colors.headerTint} />
            )}
            <Text>{isSubscribed ? 'Prenumeruojama' : 'Prenumeruoti'}</Text>
          </TouchableDebounce>
        </>
      ) : null}

      <View style={[styles.divider, {backgroundColor: colors.border}]} />
      <TouchableDebounce
        style={styles.buttonContainer}
        hitSlop={{
          top: EXTRA_HIT_SLOP,
          bottom: EXTRA_HIT_SLOP,
        }}
        onPress={_handleSharePress}
        accessibilityLabel="Dalintis straipsniu">
        <ShareIcon size={dim.appBarIconSize} color={colors.headerTint} />
      </TouchableDebounce>
      <PleaseLoginModal
        visible={modalVisible}
        title="Norėdami išsaugoti straipsnį arba prenumeruoti rubriką, prisijunkite prie savo paskyros."
        onConfirm={() => {
          setModalVisible(false);
          navigation.navigate('User', {instantLogin: false});
        }}
        onCancel={() => setModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    marginRight: 24,
    height: 32,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 6,
    borderWidth: StyleSheet.hairlineWidth,
  },
  buttonContainer: {height: 32, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12},
  divider: {
    height: '100%',
    width: StyleSheet.hairlineWidth,
  },
});

export default useArticleHeader;

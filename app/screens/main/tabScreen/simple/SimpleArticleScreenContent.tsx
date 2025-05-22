import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useCallback, useEffect, useRef} from 'react';
import {View, StyleSheet, Button, RefreshControl} from 'react-native';
import {EventRegister} from 'react-native-event-listeners';
import {FlashList, ListRenderItemInfo} from '@shopify/flash-list';
import {Article} from '../../../../../Types';
import {
  ArticleRow,
  DefaultSectionHeader,
  ListLoader,
  ScreenLoader,
  Text,
  TouchableDebounce,
} from '../../../../components';
import {IconArrowLeft} from '../../../../components/svg';
import {EVENT_SELECT_CATEGORY_INDEX} from '../../../../constants';
import {MainStackParamList} from '../../../../navigation/MainStack';
import {useTheme} from '../../../../Theme';
import {PagingState} from '../../../../state/article_store';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface Props {
  data: PagingState;
  showTitle: boolean;
  showBackToHome?: boolean;
  requestNextPage: () => void;
  requestRefresh: () => void;
}

const SimpleArticleScreenContent: React.FC<React.PropsWithChildren<Props>> = ({
  data,
  showTitle,
  showBackToHome,
  requestNextPage,
  requestRefresh,
}) => {
  const {isError, articles, isFetching, isRefreshing, title} = data;
  const {colors, strings} = useTheme();

  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  const listRef = useRef<FlashList<any>>(null);

  const insets = useSafeAreaInsets();

  useEffect(() => {
    //Scroll to top when it's finished refreshing
    if (!isRefreshing) {
      listRef.current?.scrollToOffset({animated: true, offset: 0});
    }
  }, [isRefreshing]);

  const openArticleHandler = useCallback(
    (article: Article) => {
      if (article.is_audio) {
        navigation.push('Podcast', {articleId: article.id});
      } else if (article.is_video) {
        navigation.push('Vodcast', {articleId: article.id});
      } else {
        navigation.push('Article', {articleId: article.id});
      }
    },
    [navigation],
  );

  const renderItem = useCallback(
    (val: ListRenderItemInfo<Article[]>) => (
      <ArticleRow data={val.item} onArticlePress={openArticleHandler} />
    ),
    [openArticleHandler],
  );

  const keyExtractor = useCallback((item: any, index: number) => String(index) + String(item), []);

  const onListEndReached = useCallback(() => {
    if (isFetching === false) {
      requestNextPage();
    }
  }, [isFetching, requestNextPage]);

  const renderTitle = useCallback(() => {
    return (
      <View>
        {showBackToHome && (
          <TouchableDebounce
            style={styles.backContainer}
            onPress={() => {
              EventRegister.emit(EVENT_SELECT_CATEGORY_INDEX, {index: 0});
            }}>
            <IconArrowLeft color={colors.primary} size={16} />
            <Text style={{color: colors.primary, ...styles.backText}}>Atgal į pagrindinį</Text>
          </TouchableDebounce>
        )}
        <DefaultSectionHeader title={title} />
      </View>
    );
  }, [colors.primary, showBackToHome, title]);

  //Handle error state
  if (isError === true) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText} type="error">
          {strings.error_no_connection}
        </Text>
        <Button title={strings.tryAgain} color={colors.primary} onPress={requestRefresh} />
      </View>
    );
  }

  //Handle loading state
  if (isFetching === true && !articles?.length) {
    return <ScreenLoader />;
  }

  //Handle article data
  return (
    <View style={styles.container}>
      <FlashList
        ref={listRef}
        showsVerticalScrollIndicator={false}
        //style={styles.container}
        data={articles}
        contentContainerStyle={{paddingBottom: insets.bottom}}
        ListHeaderComponent={showTitle ? renderTitle() : null}
        //windowSize={4}
        estimatedItemSize={320}
        onEndReachedThreshold={0.3}
        ListFooterComponent={isFetching ? <ListLoader /> : null}
        onEndReached={onListEndReached}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={Boolean(isRefreshing)} onRefresh={requestRefresh} />}
        removeClippedSubviews={false}
        keyExtractor={keyExtractor}
      />
    </View>
  );
};

export default SimpleArticleScreenContent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    marginBottom: 20,
    fontSize: 20,
  },
  backContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
    marginTop: 24,
  },
  backText: {
    marginLeft: 6,
  },
});

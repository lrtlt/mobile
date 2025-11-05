import React, {useCallback, useEffect} from 'react';
import {View, Button, StyleSheet, Animated, ListRenderItemInfo, ScrollViewProps} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {Text, ScreenLoader, AnimatedAppBar, ArticleFeedItem, ActionButton} from '../../components';
import {IconFilter} from '../../components/svg';
import {useTheme} from '../../Theme';
import {FlatList} from 'react-native-gesture-handler';
import {CompositeNavigationProp, RouteProp} from '@react-navigation/native';
import {MainStackParamList, SearchDrawerParamList} from '../../navigation/MainStack';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {Article} from '../../../Types';
import useSearch from './context/useSearch';
import {defaultSearchFilter} from './context/SearchContext';
import useNavigationAnalytics from '../../util/useNavigationAnalytics';
import useAppBarHeight from '../../components/appBar/useAppBarHeight';
import {SafeAreaView} from 'react-native-safe-area-context';
import SearchAISummary from './SearchAISummary';
import {pushArticle} from '../../util/NavigationUtils';
import {useArticleSearch} from '../../api/hooks/useSearch';
import SearchBar from './SearchBar';
import {useAISummary} from '../../api/hooks/useAISummary';
import {SearchCategorySuggestion} from '../../api/Types';
import SearchSuggestions from './SearchSuggestions';

type ScreenRouteProp = RouteProp<SearchDrawerParamList, 'SearchScreen'>;

type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<MainStackParamList, 'Search'>,
  DrawerNavigationProp<SearchDrawerParamList, 'SearchScreen'>
>;

type Props = {
  route: ScreenRouteProp;
  navigation: ScreenNavigationProp;
};

const SearchScreen: React.FC<React.PropsWithChildren<Props>> = ({navigation, route}) => {
  const {query, setQuery, filter, setFilter} = useSearch();
  const {
    data: aiSummary,
    isLoading: aiSummaryLoading,
    isEnabled: aiSummaryEnabled,
    refetch: retryAISummary,
  } = useAISummary(query);
  const {
    data: searchResponse,
    isLoading,
    isFetched,
    error,
    refetch: retrySearch,
  } = useArticleSearch(query, filter);
  const {items: searchResults = [], similar_categories = []} = searchResponse ?? {};

  const {colors, strings, dim} = useTheme();

  useEffect(() => {
    const initialQuery = route?.params?.q ?? '';
    const initialFilter = route?.params?.filter ?? defaultSearchFilter;
    setQuery(initialQuery);
    setFilter(initialFilter);
  }, []);

  useNavigationAnalytics({
    viewId: 'https://www.lrt.lt/paieska',
    title: 'Paieška - LRT',
    sections: ['Bendra'],
  });

  const {fullHeight, subHeaderHeight} = useAppBarHeight();
  const scrollY = new Animated.Value(0);
  const diffClamp = Animated.diffClamp(scrollY, 0, subHeaderHeight * 2);
  const translateY = diffClamp.interpolate({
    inputRange: [0, subHeaderHeight, subHeaderHeight * 2],
    outputRange: [0, 0, -subHeaderHeight],
  });

  const onScroll: ScrollViewProps['onScroll'] = (e) => {
    const y = e.nativeEvent.contentOffset.y;
    if (y > 0) scrollY.setValue(e.nativeEvent.contentOffset.y);
  };

  const articlePressHandler = useCallback(
    (article: Article) => {
      pushArticle(navigation, article);
    },
    [navigation],
  );

  const searchSuggestionPressHandler = useCallback(
    (suggestion: SearchCategorySuggestion) => {
      if (suggestion.category_id) {
        navigation.navigate('Category', {
          id: suggestion.category_id,
          name: suggestion.category_title,
          url: 'missing category url on suggestion',
        });
      }
    },
    [navigation],
  );
  const renderItem = useCallback(
    (item: ListRenderItemInfo<Article>) => {
      return <ArticleFeedItem article={item.item} onPress={articlePressHandler} />;
    },
    [articlePressHandler],
  );

  let content;
  if (error) {
    content = (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText} type="error">
          {strings.error_no_connection}
        </Text>
        <Button
          title={strings.tryAgain}
          color={colors.primary}
          onPress={() => {
            retrySearch();
            retryAISummary();
          }}
        />
      </View>
    );
  } else if (isLoading || (!isFetched && searchResults.length === 0)) {
    content = <ScreenLoader />;
  } else {
    content = (
      <FlatList
        onScroll={onScroll}
        contentContainerStyle={{padding: 12, paddingTop: fullHeight + subHeaderHeight - 12, gap: 24}}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={1}
        data={searchResults}
        ListHeaderComponentStyle={{flex: 1}}
        ListHeaderComponent={
          <View style={{flex: 1}}>
            {aiSummaryEnabled && (
              <View style={{paddingTop: 12}}>
                <SearchAISummary isLoading={aiSummaryLoading} summary={aiSummary} />
              </View>
            )}
            <SearchSuggestions
              suggestions={similar_categories}
              onSearchSuggestionClick={searchSuggestionPressHandler}
            />
          </View>
        }
        // ListFooterComponent={
        //   hasMore ? (
        //     <View>
        //       {loadingState.isFetching && <ScreenLoader />}
        //       {!loadingState.isFetching && !loadingState.isError && (
        //         <MoreArticlesButton onPress={loadMore} customText="Daugiau rezultatų" />
        //       )}
        //     </View>
        //   ) : null
        // }
        ListEmptyComponent={
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsText} fontFamily="PlayfairDisplay-Regular">
              {strings.no_search_results}
            </Text>
          </View>
        }
        numColumns={1}
        renderItem={renderItem}
        keyExtractor={(item, index) => String(index) + String(item)}
      />
    );
  }

  return (
    <View style={styles.root}>
      <AnimatedAppBar
        onBackPress={() => {
          navigation.goBack();
        }}
        translateY={translateY}
        actions={
          <ActionButton onPress={() => navigation.toggleDrawer()} accessibilityLabel={'šoninis meniu'}>
            <IconFilter size={dim.appBarIconSize} color={colors.headerTint} />
          </ActionButton>
        }
        subHeader={<SearchBar onQueryChange={setQuery} subHeaderHeight={subHeaderHeight} />}
      />
      <SafeAreaView edges={['bottom']}>{content}</SafeAreaView>
    </View>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
  },
  article: {
    padding: 8,
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
  noResultsContainer: {
    paddingVertical: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noResultsText: {
    fontSize: 20,
  },
});

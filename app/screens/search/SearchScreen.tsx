import React, {useCallback, useEffect} from 'react';
import {
  View,
  Button,
  TextInput,
  StyleSheet,
  Animated,
  ListRenderItemInfo,
  ScrollViewProps,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {ArticleComponent, ActionButton, Text, ScreenLoader, AnimatedAppBar} from '../../components';
import {IconFilter, IconSearch} from '../../components/svg';
import {useTheme} from '../../Theme';
import {BorderlessButton, FlatList} from 'react-native-gesture-handler';
import {CompositeNavigationProp, RouteProp} from '@react-navigation/native';
import {MainStackParamList, SearchDrawerParamList} from '../../navigation/MainStack';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {Article} from '../../../Types';
import useSearch from './context/useSearch';
import useSearchApi from './useSearchApi';
import SearchSuggestions from './SearchSuggestions';
import {defaultSearchFilter} from './context/SearchContext';
import {SearchCategorySuggestion} from '../../api/Types';
import useNavigationAnalytics from '../../util/useNavigationAnalytics';
import useAppBarHeight from '../../components/appBar/useAppBarHeight';
import {SafeAreaView} from 'react-native-safe-area-context';

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
  const {loadingState, searchResults, searchSuggestions, callSearchApi} = useSearchApi();
  const {colors, strings, dim} = useTheme();

  useEffect(() => {
    const initialQuery = route?.params?.q ?? '';
    const initialFilter = route?.params?.filter ?? defaultSearchFilter;

    setQuery(initialQuery);
    setFilter(initialFilter);

    callSearchApi(initialQuery, initialFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    callSearchApi(query, filter);
  }, [filter]);

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
      console.log('Article pressed:', article);
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
      return (
        <ArticleComponent
          style={styles.article}
          article={item.item}
          dateEnabled={true}
          onPress={articlePressHandler}
          styleType={'multi'}
        />
      );
    },
    [articlePressHandler],
  );

  const renderSearchBar = useCallback(() => {
    return (
      <View style={{...styles.searchBar, backgroundColor: colors.card}}>
        <View style={{...styles.searchInputHolder, backgroundColor: colors.background}}>
          <TextInput
            style={{...styles.searchInput, color: colors.text}}
            multiline={false}
            placeholder={'Paieška'}
            numberOfLines={1}
            autoCorrect={false}
            onSubmitEditing={() => callSearchApi(query, filter)}
            returnKeyType="search"
            placeholderTextColor={colors.textDisbled}
            onChangeText={setQuery}
            value={query}
          />
          <BorderlessButton style={styles.searchButton} onPress={() => callSearchApi(query, filter)}>
            <IconSearch size={dim.appBarIconSize} color={colors.headerTint} />
          </BorderlessButton>
        </View>
      </View>
    );
  }, [setQuery, query, callSearchApi, filter]);

  let content;
  if (loadingState.isError) {
    content = (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText} type="error">
          {strings.error_no_connection}
        </Text>
        <Button
          title={strings.tryAgain}
          color={colors.primary}
          onPress={() => callSearchApi(query, filter)}
        />
      </View>
    );
  } else if (loadingState.isFetching || loadingState.idle) {
    content = <ScreenLoader />;
  } else {
    content = (
      <FlatList
        onScroll={onScroll}
        contentContainerStyle={{paddingTop: fullHeight + subHeaderHeight}}
        showsVerticalScrollIndicator={false}
        data={searchResults}
        windowSize={4}
        ListHeaderComponent={
          <SearchSuggestions
            suggestions={searchSuggestions}
            onSearchSuggestionClick={searchSuggestionPressHandler}
          />
        }
        ListEmptyComponent={
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsText} fontFamily="PlayfairDisplay-Regular">
              {strings.no_search_results}
            </Text>
          </View>
        }
        numColumns={2}
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
        subHeader={renderSearchBar()}
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

  searchBar: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  searchInputHolder: {
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 2,
  },
  searchInput: {
    padding: 8,
    fontSize: 17,
    flex: 1,
  },
  searchButton: {
    height: '100%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
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

import React, {useCallback, useEffect, useState} from 'react';
import {View, Button, TextInput, StyleSheet, Animated, ListRenderItemInfo} from 'react-native';
import {HeaderBackButton, StackNavigationProp} from '@react-navigation/stack';
import {ArticleComponent, ActionButton, Text, ScreenLoader} from '../../components';
import {IconFilter, IconSearch} from '../../components/svg';
import {useTheme} from '../../Theme';
import {CollapsibleSubHeaderAnimator, useCollapsibleSubHeader} from 'react-navigation-collapsible';
import {BorderlessButton} from 'react-native-gesture-handler';
import {checkEqual} from '../../util/LodashEqualityCheck';
import {CompositeNavigationProp, RouteProp} from '@react-navigation/native';
import {MainStackParamList, SearchDrawerParamList} from '../../navigation/MainStack';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {Article} from '../../../Types';
import useSearch from './context/useSearch';
import useSearchApi from './useSearchApi';

type ScreenRouteProp = RouteProp<SearchDrawerParamList, 'SearchScreen'>;

type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<MainStackParamList, 'Search'>,
  DrawerNavigationProp<SearchDrawerParamList, 'SearchScreen'>
>;

type Props = {
  route: ScreenRouteProp;
  navigation: ScreenNavigationProp;
};

const SearchScreen: React.FC<Props> = ({navigation, route}) => {
  const [useNavigationPropFilter, setUseNavigationPropFilter] = useState(
    Boolean(route?.params?.filter || route?.params?.q),
  );

  const {query, setQuery, filter, setFilter} = useSearch();
  const {loadingState, searchResults, callSearch} = useSearchApi(query, filter);
  const {colors, strings, dim} = useTheme();

  useEffect(() => {
    if (route?.params?.q) {
      setQuery(route.params.q);
    }

    if (route?.params?.filter) {
      setFilter(route.params.filter);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: '',

      headerRight: () => (
        <View style={styles.row}>
          <ActionButton onPress={() => navigation.toggleDrawer()}>
            <IconFilter size={dim.appBarIconSize} color={colors.headerTint} />
          </ActionButton>
        </View>
      ),

      headerLeft: () => (
        <HeaderBackButton
          labelVisible={false}
          tintColor={colors.headerTint}
          onPress={() => navigation.goBack()}
        />
      ),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (useNavigationPropFilter) {
      if (!checkEqual(filter, route?.params?.filter) || query !== route?.params?.q) {
        return;
      } else {
        setUseNavigationPropFilter(false);
      }
    }
    callSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const articlePressHandler = useCallback(
    (article: Article) => {
      navigation.navigate('Article', {articleId: article.id});
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

  const handleQueryInput = useCallback(
    (text) => {
      setQuery(text);
    },
    [setQuery],
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
            onSubmitEditing={callSearch}
            returnKeyType="search"
            placeholderTextColor={colors.textDisbled}
            onChangeText={handleQueryInput}
            value={query}
          />
          <BorderlessButton style={styles.searchButton} onPress={callSearch}>
            <IconSearch size={dim.appBarIconSize} color={colors.headerTint} />
          </BorderlessButton>
        </View>
      </View>
    );
  }, [
    colors.background,
    colors.card,
    colors.headerTint,
    colors.text,
    colors.textDisbled,
    dim.appBarIconSize,
    handleQueryInput,
    query,
    callSearch,
  ]);

  const {onScroll, containerPaddingTop, scrollIndicatorInsetTop, translateY} = useCollapsibleSubHeader();

  let content;
  if (loadingState.isError) {
    content = (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText} type="error">
          {strings.error_no_connection}
        </Text>
        <Button title={strings.tryAgain} color={colors.primary} onPress={callSearch} />
      </View>
    );
  } else if (loadingState.isFetching) {
    content = <ScreenLoader />;
  } else {
    content = (
      <Animated.FlatList
        onScroll={onScroll}
        contentContainerStyle={{paddingTop: containerPaddingTop}}
        scrollIndicatorInsets={{top: scrollIndicatorInsetTop}}
        showsVerticalScrollIndicator={false}
        data={searchResults}
        windowSize={4}
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
      {content}
      <CollapsibleSubHeaderAnimator translateY={translateY}>{renderSearchBar()}</CollapsibleSubHeaderAnimator>
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
    paddingVertical: 12,
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
    elevation: 4,
  },
  searchInput: {
    padding: 12,

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

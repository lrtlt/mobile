import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Button,
  ActivityIndicator,
  TextInput,
  StyleSheet,
  Animated,
  ListRenderItemInfo,
} from 'react-native';
import {HeaderBackButton, StackNavigationProp} from '@react-navigation/stack';
import {useSelector, useDispatch} from 'react-redux';
import {resetSearchFilter} from '../../redux/actions';
import {ArticleComponent, ActionButton, Text, ScreenLoader} from '../../components';
import {IconFilter, IconSearch} from '../../components/svg';
import {fetchArticleSearch} from '../../api';
import {selectSearchFilter} from '../../redux/selectors';
import {useTheme} from '../../Theme';
import {CollapsibleSubHeaderAnimator, useCollapsibleSubHeader} from 'react-navigation-collapsible';
import {BorderlessButton} from 'react-native-gesture-handler';
import {checkEqual} from '../../util/LodashEqualityCheck';
import {CompositeNavigationProp, RouteProp} from '@react-navigation/native';
import {MainStackParamList, SearchDrawerParamList} from '../../navigation/MainStack';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {Article} from '../../../Types';

type ScreenRouteProp = RouteProp<SearchDrawerParamList, 'SearchScreen'>;

type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<MainStackParamList, 'Search'>,
  DrawerNavigationProp<SearchDrawerParamList, 'SearchScreen'>
>;

type Props = {
  route: ScreenRouteProp;
  navigation: ScreenNavigationProp;
};

const SearchScreen: React.FC<Props> = ({navigation}) => {
  const [query, setQuery] = useState<string>('');
  const [articles, setArticles] = useState<Article[]>([]);
  const [loadingState, setLoadingState] = useState({
    isFetching: false,
    isError: false,
  });

  const searchFilter = useSelector(selectSearchFilter, checkEqual);

  const {colors, strings, dim} = useTheme();
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(resetSearchFilter());
    };
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
    search();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchFilter]);

  const search = useCallback(() => {
    setLoadingState({isFetching: true, isError: false});
    fetchArticleSearch(query, searchFilter)
      .then((response) => {
        setLoadingState({
          isFetching: false,
          isError: false,
        });
        setArticles(response.items);
      })
      .catch(() => {
        setLoadingState({
          isFetching: false,
          isError: true,
        });
      });
  }, [query, searchFilter]);

  const articlePressHandler = useCallback((article: Article) => {
    navigation.navigate('Article', {articleId: article.id});
  }, []);

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

  const renderError = () => {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText} type="error">
          {strings.error_no_connection}
        </Text>
        <Button title={strings.tryAgain} color={colors.primary} onPress={search} />
      </View>
    );
  };

  const renderSearchBar = () => {
    return (
      <View style={{...styles.searchBar, backgroundColor: colors.card}}>
        <View style={{...styles.searchInputHolder, backgroundColor: colors.background}}>
          <TextInput
            style={{...styles.searchInput, color: colors.text}}
            multiline={false}
            placeholder={'Paieška'}
            numberOfLines={1}
            onSubmitEditing={() => search()}
            returnKeyType="search"
            placeholderTextColor={colors.textDisbled}
            onChangeText={(text) => setQuery(text)}
            value={query}
          />
          <BorderlessButton style={styles.searchButton} onPress={() => search()}>
            <IconSearch size={dim.appBarIconSize} color={colors.headerTint} />
          </BorderlessButton>
        </View>
      </View>
    );
  };

  const {onScroll, containerPaddingTop, scrollIndicatorInsetTop, translateY} = useCollapsibleSubHeader();

  let content;
  if (loadingState.isError) {
    content = renderError();
  } else if (loadingState.isFetching) {
    content = <ScreenLoader />;
  } else {
    content = (
      <Animated.FlatList
        onScroll={onScroll}
        contentContainerStyle={{paddingTop: containerPaddingTop}}
        scrollIndicatorInsets={{top: scrollIndicatorInsetTop}}
        showsVerticalScrollIndicator={false}
        data={articles}
        windowSize={4}
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
    fontFamily: 'SourceSansPro-Regular',
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
    fontFamily: 'SourceSansPro-Regular',
    marginBottom: 20,
    fontSize: 20,
  },
});

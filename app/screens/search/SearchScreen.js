import React, {useCallback, useEffect, useState} from 'react';
import {View, Button, ActivityIndicator, TextInput, StyleSheet, Animated} from 'react-native';
import {HeaderBackButton} from '@react-navigation/stack';
import {useSelector, useDispatch} from 'react-redux';
import {resetSearchFilter} from '../../redux/actions';
import {Article, ActionButton, Text} from '../../components';
import {IconFilter, IconSearch} from '../../components/svg';
import {searchArticles} from '../../api';
import {GEMIUS_VIEW_SCRIPT_ID} from '../../constants';
import Gemius from 'react-native-gemius-plugin';
import {selectSearchFilter} from '../../redux/selectors';
import {useTheme} from '../../Theme';
import {CollapsibleSubHeaderAnimator, useCollapsibleSubHeader} from 'react-navigation-collapsible';
import {BorderlessButton} from 'react-native-gesture-handler';

const SearchScreen = (props) => {
  const {navigation} = props;
  const searchFilter = useSelector(selectSearchFilter);

  const {colors, strings, dim} = useTheme();

  const [loadingState, setLoadingState] = useState({
    isFetching: false,
    isError: false,
  });

  const [query, setQuery] = useState('');
  const [articles, setArticles] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    Gemius.sendPageViewedEvent(GEMIUS_VIEW_SCRIPT_ID, {
      page: 'search',
    });

    return () => dispatch(resetSearchFilter());
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
    search();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchFilter]);

  const search = useCallback(() => {
    setLoadingState({isFetching: true, isError: false});

    const callApi = async () => {
      const response = await fetch(searchArticles(query, searchFilter));
      console.log(response);
      const result = await response.json();
      console.log('SEARCH ARTICLES RESPONSE', result);
      return result;
    };

    callApi()
      .then((response) => {
        setLoadingState({
          isFetching: false,
          isError: false,
        });
        setArticles(response.items);
      })
      .catch((error) => {
        setLoadingState({
          isFetching: false,
          isError: true,
        });
      });
  }, [query, searchFilter]);

  const renderItem = (val) => {
    return (
      <Article
        style={styles.article}
        data={val.item}
        showDate={true}
        onPress={(article) => navigation.navigate('Article', {articleId: article.id})}
        type={'multi'}
      />
    );
  };

  const renderLoading = () => {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size={'small'} animating={loadingState.isFetching} />
      </View>
    );
  };

  const renderError = () => {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText} type="error">
          {strings.error_no_connection}
        </Text>
        <Button title={strings.tryAgain} color={colors.primary} onPress={() => search(query, searchFilter)} />
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
    content = renderLoading();
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
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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

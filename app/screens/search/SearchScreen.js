import React, {useEffect, useState} from 'react';
import {View, Button, ActivityIndicator, TextInput, StyleSheet} from 'react-native';
import {HeaderBackButton} from '@react-navigation/stack';
import {useSelector, useDispatch} from 'react-redux';
import {resetSearchFilter} from '../../redux/actions';
import {Article, ActionButton, Text} from '../../components';
import {SearchIcon, FilterIcon} from '../../components/svg';
import {getOrientation, getSmallestDim} from '../../util/UI';
import {searchArticles} from '../../api';
import {GEMIUS_VIEW_SCRIPT_ID} from '../../constants';
import Gemius from 'react-native-gemius-plugin';
import {FlatList} from 'react-native-gesture-handler';
import {selectSearchFilter} from '../../redux/selectors';
import {useTheme} from '../../Theme';

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
      headerTitle: () => (
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
      ),
      headerRight: () => (
        <View style={styles.row}>
          <ActionButton onPress={() => search()}>
            <SearchIcon size={dim.appBarIconSize} color={colors.headerTint} />
          </ActionButton>
          <ActionButton onPress={() => navigation.toggleDrawer()}>
            <FilterIcon size={dim.appBarIconSize} color={colors.headerTint} />
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
  }, [query, searchFilter, colors]);

  useEffect(() => {
    search();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchFilter]);

  const callApi = async () => {
    const response = await fetch(searchArticles(query, searchFilter));
    console.log(response);
    const result = await response.json();
    console.log('SEARCH ARTICLES RESPONSE', result);
    return result;
  };

  const search = () => {
    setLoadingState({isFetching: true, isError: false});
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
  };

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

  let content;
  if (loadingState.isError) {
    content = renderError();
  } else if (loadingState.isFetching) {
    content = renderLoading();
  } else {
    content = (
      <FlatList
        showsVerticalScrollIndicator={false}
        statusBarHeight={0}
        data={articles}
        windowSize={4}
        numColumns={2}
        extraData={{
          orientation: getOrientation(),
        }}
        renderItem={renderItem}
        removeClippedSubviews={false}
        keyExtractor={(item, index) => String(index) + String(item)}
      />
    );
  }

  return <View style={styles.root}>{content}</View>;
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
  searchInput: {
    paddingBottom: 2,
    paddingTop: 2,
    margin: 4,
    width: getSmallestDim() * 0.5,
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
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

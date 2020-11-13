import React, {useEffect, useState} from 'react';
import {View, Text, Button, ActivityIndicator, TextInput} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {resetSearchFilter} from '../../redux/actions';
import {Article, ActionButton} from '../../components';
import {SearchIcon, FilterIcon} from '../../components/svg';
import Styles from './styles';
import {getOrientation} from '../../util/UI';
import EStyleSheet from 'react-native-extended-stylesheet';
import {searchArticles} from '../../api';
import {GEMIUS_VIEW_SCRIPT_ID} from '../../constants';
import Gemius from 'react-native-gemius-plugin';
import {FlatList} from 'react-native-gesture-handler';
import {selectSearchFilter} from '../../redux/selectors';

const SearchScreen = (props) => {
  const {navigation} = props;
  const searchFilter = useSelector(selectSearchFilter);

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
    navigation.dangerouslyGetParent().setOptions({
      headerTitle: () => (
        <TextInput
          style={Styles.searchInput}
          multiline={false}
          placeholder={'Paieška'}
          numberOfLines={1}
          onSubmitEditing={() => search()}
          returnKeyType="search"
          placeholderTextColor={EStyleSheet.value('$textColorDisabled')}
          onChangeText={(text) => setQuery(text)}
          value={query}
        />
      ),
      headerRight: () => (
        <View style={Styles.row}>
          <ActionButton onPress={() => search()}>
            <SearchIcon
              size={EStyleSheet.value('$navBarIconSize')}
              color={EStyleSheet.value('$headerTintColor')}
            />
          </ActionButton>
          <ActionButton onPress={() => navigation.toggleDrawer()}>
            <FilterIcon
              size={EStyleSheet.value('$navBarIconSize')}
              color={EStyleSheet.value('$headerTintColor')}
            />
          </ActionButton>
        </View>
      ),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, searchFilter]);

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
        style={Styles.article}
        data={val.item}
        showDate={true}
        onPress={(article) => navigation.navigate('Article', {articleId: article.id})}
        type={'multi'}
      />
    );
  };

  const renderLoading = () => {
    return (
      <View style={Styles.loadingContainer}>
        <ActivityIndicator size={'small'} animating={loadingState.isFetching} />
      </View>
    );
  };

  const renderError = () => {
    return (
      <View style={Styles.errorContainer}>
        <Text style={Styles.errorText}>{EStyleSheet.value('$error_no_connection')}</Text>
        <Button
          title={EStyleSheet.value('$tryAgain')}
          color={EStyleSheet.value('$primary')}
          onPress={() => search(query, searchFilter)}
        />
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

  return (
    <View style={Styles.root}>
      <View style={Styles.container}>{content}</View>
    </View>
  );
};

export default SearchScreen;

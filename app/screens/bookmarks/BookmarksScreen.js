import React, {useEffect} from 'react';
import {View} from 'react-native';
import Styles from './styles';
import {ArticleRow} from '../../components';
import {useSelector} from 'react-redux';
import {getOrientation} from '../../util/UI';
import {GEMIUS_VIEW_SCRIPT_ID} from '../../constants';
import Gemius from 'react-native-gemius-plugin';
import {FlatList} from 'react-native-gesture-handler';
import EStyleSheet from 'react-native-extended-stylesheet';
import {selectBookmarksScreenState} from '../../redux/selectors';

const BookmarksScreen = (props) => {
  const {navigation} = props;
  const state = useSelector(selectBookmarksScreenState);
  const {articles} = state;

  useEffect(() => {
    navigation.setOptions({
      headerTitle: EStyleSheet.value('$bookmarks'),
    });

    Gemius.sendPageViewedEvent(GEMIUS_VIEW_SCRIPT_ID, {
      page: 'bookmarks',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderItem = (val) => {
    return (
      <ArticleRow
        data={val.item}
        onArticlePress={(article) => navigation.push('Article', {articleId: article.id})}
      />
    );
  };

  return (
    <View style={Styles.container}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={articles}
        windowSize={4}
        extraData={{
          orientation: getOrientation(),
        }}
        renderItem={renderItem}
        removeClippedSubviews={false}
        keyExtractor={(item, index) => String(index) + String(item)}
      />
    </View>
  );
};

export default BookmarksScreen;

import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {ArticleRow} from '../../components';
import {useSelector} from 'react-redux';
import {getOrientation} from '../../util/UI';
import {GEMIUS_VIEW_SCRIPT_ID} from '../../constants';
import Gemius from 'react-native-gemius-plugin';
import {FlatList} from 'react-native-gesture-handler';
import {selectBookmarksScreenState} from '../../redux/selectors';
import {useTheme} from '../../Theme';

const BookmarksScreen = (props) => {
  const {navigation} = props;
  const state = useSelector(selectBookmarksScreenState);
  const {articles} = state;

  const {strings} = useTheme();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: strings.bookmarks,
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
    <View style={styles.container}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

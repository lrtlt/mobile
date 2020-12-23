import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {ArticleRow} from '../../components';
import {useSelector} from 'react-redux';
import {getOrientation} from '../../util/UI';
import {FlatList} from 'react-native-gesture-handler';
import {selectHistoryScreenState} from '../../redux/selectors';
import {useTheme} from '../../Theme';

const HistoryScreen = (props) => {
  const {navigation} = props;
  const state = useSelector(selectHistoryScreenState);
  const {articles} = state;

  const {strings} = useTheme();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: strings.history,
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

export default HistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

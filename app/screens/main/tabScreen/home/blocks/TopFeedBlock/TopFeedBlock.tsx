import {useNavigation} from '@react-navigation/core';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useCallback, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {Article} from '../../../../../../../Types';
import {HomeBlockTopFeedBlock} from '../../../../../../api/Types';
import {CoverImage, MyScrollView, Text, TouchableDebounce} from '../../../../../../components';
import {MainStackParamList} from '../../../../../../navigation/MainStack';
import {useTheme} from '../../../../../../Theme';
import {buildArticleImageUri, buildImageUri, IMG_SIZE_S} from '../../../../../../util/ImageUtil';

interface TopFeedBlockProps {
  block: HomeBlockTopFeedBlock;
}

const TopFeedBlock: React.FC<TopFeedBlockProps> = ({block}) => {
  const {articles} = block;

  const {colors} = useTheme();

  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();

  const articlePressHandler = useCallback(
    (article: Article) => {
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

  const articleList = useMemo(
    () =>
      articles?.map((article, index) => {
        let imgUri;
        if (article.img_path_prefix && article.img_path_postfix) {
          imgUri = buildImageUri(IMG_SIZE_S, article.img_path_prefix, article.img_path_postfix);
        } else if (article.photo) {
          imgUri = buildArticleImageUri(IMG_SIZE_S, article.photo);
        }

        const isLast = index === articles.length - 1;
        const borderRightWidth = isLast ? 0 : 1;

        let timeText: string | undefined;
        if (article.time_diff) {
          timeText = `Prieš ${article.time_diff} min.`;
        } else if (article.time_diff_hour) {
          timeText = `Prieš ${article.time_diff_hour} val.`;
        } else if (article.time_diff_day) {
          timeText = `Prieš ${article.time_diff_day} d.`;
        } else {
          timeText = article.date;
        }

        return (
          <TouchableDebounce key={article.id} debounceTime={500} onPress={() => articlePressHandler(article)}>
            <View
              style={{
                ...styles.listItemContainer,
                borderColor: colors.listSeparator,
                borderRightWidth,
              }}>
              <Text style={styles.timeText} type="secondary">
                {timeText}
              </Text>
              <View style={styles.articleContainer}>
                <CoverImage
                  style={styles.image}
                  source={{
                    uri: imgUri,
                  }}
                />
                <Text style={styles.titleText} type="primary" numberOfLines={3}>
                  {article.title}
                </Text>
              </View>
            </View>
          </TouchableDebounce>
        );
      }),
    [articlePressHandler, articles, colors.listSeparator],
  );

  return (
    <View style={{...styles.container, borderColor: colors.listSeparator}}>
      <MyScrollView
        contentContainerStyle={styles.scrollContent}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        {articleList}
      </MyScrollView>
    </View>
  );
};

export default TopFeedBlock;

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    marginVertical: 8,
  },
  scrollContent: {
    paddingVertical: 12,
  },
  listItemContainer: {
    width: 290,
    paddingHorizontal: 16,
  },
  articleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 54,
    overflow: 'hidden',
  },
  timeText: {
    fontSize: 12,
    marginBottom: 4,
  },
  titleText: {
    fontSize: 15,
    letterSpacing: 0.4,
    flex: 1,
    marginLeft: 16,
  },
});

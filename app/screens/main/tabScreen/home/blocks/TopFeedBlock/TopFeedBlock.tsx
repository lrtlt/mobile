import {useNavigation} from '@react-navigation/core';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useCallback, useMemo} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Article} from '../../../../../../../Types';
import {HomeBlockTopFeedBlock} from '../../../../../../api/Types';
import {CoverImage, Text, TouchableDebounce} from '../../../../../../components';
import {MainStackParamList} from '../../../../../../navigation/MainStack';
import {useTheme} from '../../../../../../Theme';
import {buildArticleImageUri, buildImageUri, getImageSizeForWidth} from '../../../../../../util/ImageUtil';

interface TopFeedBlockProps {
  block: HomeBlockTopFeedBlock;
}

const TopFeedBlock: React.FC<TopFeedBlockProps> = ({block}) => {
  const {articles} = block;

  const {colors} = useTheme();

  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();

  const articlePressHandler = useCallback(
    (article: Article) => {
      navigation.navigate('Article', {articleId: article.id});
    },
    [navigation],
  );

  const articleList = useMemo(
    () =>
      articles.map((article, index) => {
        let imgUri;
        if (article.img_path_prefix && article.img_path_postfix) {
          imgUri = buildImageUri(getImageSizeForWidth(80), article.img_path_prefix, article.img_path_postfix);
        } else if (article.photo) {
          imgUri = buildArticleImageUri(getImageSizeForWidth(80), article.photo);
        }

        const isLast = index === articles.length - 1;
        const borderRightWidth = isLast ? 0 : 1;

        let timeText: string | undefined;
        if (article.time_diff) {
          timeText = `Prieš ${article.time_diff} MIN.`;
        } else if (article.time_diff_hour) {
          timeText = `Prieš ${article.time_diff_hour} VAL.`;
        } else if (article.time_diff_day) {
          timeText = `Prieš ${article.time_diff_day} D.`;
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
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        {articleList}
      </ScrollView>
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
    paddingVertical: 16,
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

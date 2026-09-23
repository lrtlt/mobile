import React from 'react';
import {StyleSheet, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {HomeV3Article, HomeV3BlockTopFeed} from '../../../../../../api/Types';
import {Text, TouchableDebounce} from '../../../../../../components';
import {IMG_SIZE_XXS} from '../../../../../../util/ImageUtil';
import ArticleImage from '../../components/ArticleImage';
import MoreButton from '../../components/MoreButton';
import useArticlePress from '../../components/useArticlePress';
import useHomeColors from '../../components/useHomeColors';
import {getRelativeTimeText, openMoreUrl} from '../../util';

interface TopFeedBlockProps {
  block: HomeV3BlockTopFeed;
}

/** "Naujienų srautas": horizontal strip of the newest articles. */
const TopFeedBlock: React.FC<TopFeedBlockProps> = ({block}) => {
  const {articles} = block.data;
  const colors = useHomeColors();
  const onPress = useArticlePress();

  if (!articles?.length) {
    return null;
  }

  const moreArticle = articles.find((a) => a._MORE_BUTTON && a._MORE_BUTTON_URL);

  return (
    <View style={{...styles.root, borderColor: colors.separator}}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.content}>
        {articles.map((article, index) => (
          <TouchableDebounce
            key={article.id}
            onPress={() => onPress(article)}
            accessibilityRole="link"
            activeOpacity={0.8}>
            <View
              style={{
                ...styles.item,
                borderColor: colors.separator,
                borderRightWidth: index === articles.length - 1 && !moreArticle ? 0 : 1,
              }}>
              <TimeText article={article} />
              <View style={styles.row}>
                <ArticleImage
                  article={article}
                  imageSize={IMG_SIZE_XXS}
                  showBadges={false}
                  style={styles.image}
                />
                <Text style={{...styles.title, color: colors.text}} numberOfLines={3}>
                  {article.title}
                </Text>
              </View>
            </View>
          </TouchableDebounce>
        ))}
        {moreArticle ? (
          <View style={styles.more}>
            <MoreButton
              title={moreArticle._MORE_BUTTON_TITLE ?? undefined}
              onPress={() => openMoreUrl(moreArticle._MORE_BUTTON_URL)}
            />
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
};

/** "Prieš 3 min." with the number in bold, as on the web feed. */
const TimeText: React.FC<{article: HomeV3Article}> = ({article}) => {
  const colors = useHomeColors();
  const text = getRelativeTimeText(article) ?? '';
  const match = text.match(/^(Prieš )(.*)$/);

  return (
    <Text style={{...styles.time, color: colors.textSecondary}}>
      {match ? (
        <>
          {match[1]}
          <Text style={{...styles.time, color: colors.textSecondary}} fontFamily="SourceSansPro-SemiBold">
            {match[2]}
          </Text>
        </>
      ) : (
        text
      )}
    </Text>
  );
};

export default TopFeedBlock;

const styles = StyleSheet.create({
  root: {
    borderBottomWidth: 1,
  },
  content: {
    paddingVertical: 4,
  },
  item: {
    width: 272,
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  image: {
    width: 80,
  },
  time: {
    fontSize: 12,
    lineHeight: 24,
    paddingStart: 8,
  },
  title: {
    flex: 1,
    fontSize: 16,
    lineHeight: 18,
  },
  more: {
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
});

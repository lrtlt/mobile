import React from 'react';
import {StyleSheet, View, ViewStyle} from 'react-native';
import {Text} from '../../../../../components';
import {HomeV3Article} from '../../../../../api/Types';
import {getRelativeTimeText} from '../util';
import useHomeColors from './useHomeColors';

interface Props {
  article: HomeV3Article;
  showCategory?: boolean;
  /** Show the publish date ("2026.09.20 14:53") instead of "Prieš 3 val.". */
  absoluteDate?: boolean;
  style?: ViewStyle;
}

/** "Pasaulyje  Prieš 1 val." row above the article title. */
const ArticleInfo: React.FC<Props> = ({article, showCategory = true, absoluteDate, style}) => {
  const colors = useHomeColors();

  // Epika items carry a blank " " date.
  const category = showCategory ? article.category_title?.trim() : undefined;
  const time = (absoluteDate ? article.item_date : getRelativeTimeText(article))?.trim();

  if (!category && !time) {
    return null;
  }

  return (
    <View style={[styles.container, style]} importantForAccessibility="no-hide-descendants">
      {category ? (
        <Text
          style={{...styles.category, color: colors.text}}
          fontFamily="SourceSansPro-SemiBold"
          numberOfLines={1}>
          {category}
        </Text>
      ) : null}
      {time ? <Text style={{...styles.time, color: colors.textSecondary}}>{time}</Text> : null}
    </View>
  );
};

export default ArticleInfo;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    columnGap: 8,
  },
  category: {
    fontSize: 12,
    flexShrink: 1,
  },
  time: {
    fontSize: 12,
  },
});

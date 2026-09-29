import React, {useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import {HomeV3BlockCategory} from '../../../../../../api/Types';
import {TouchableDebounce} from '../../../../../../components';
import {useNavigationStore} from '../../../../../../state/navigation_store';
import {IMG_SIZE_XS} from '../../../../../../util/ImageUtil';
import ArticleImage from '../../components/ArticleImage';
import ArticleInfo from '../../components/ArticleInfo';
import ArticleTitle from '../../components/ArticleTitle';
import ArticleSubtitle from '../../components/ArticleSubtitle';
import ArticleListItem from '../../components/ArticleListItem';
import SectionTitle from '../../components/SectionTitle';
import useArticlePress from '../../components/useArticlePress';
import useHomeColors from '../../components/useHomeColors';
import {hasImage} from '../../util';

/** Author photo size, shared by the lead and the rows so all photos match. */
const PHOTO_SIZE = 90;

interface OpinionsBlockProps {
  block: HomeV3BlockCategory;
}

/**
 * "Nuomonės" (template 17) on a grey panel: a lead opinion with a rounded author photo,
 * two rows with same-size photos and two text-only columns.
 */
const OpinionsBlock: React.FC<OpinionsBlockProps> = ({block}) => {
  const {category_id, category_title, articles_list: articles} = block.data;
  const colors = useHomeColors();
  const onPress = useArticlePress();

  const onHeaderPress = useCallback(() => {
    useNavigationStore.getState().openCategoryById(category_id, category_title);
  }, [category_id, category_title]);

  if (!articles?.length) {
    return null;
  }

  const [lead, ...rest] = articles;
  const rows = rest.slice(0, 2);
  const columns = rest.slice(2, 4);

  return (
    <View style={{...styles.root, backgroundColor: colors.sectionBackground}}>
      <SectionTitle title={category_title} onPress={onHeaderPress} />
      <TouchableDebounce onPress={() => onPress(lead)} accessibilityRole="link" activeOpacity={0.8}>
        <View style={{...styles.lead, borderColor: colors.separator}}>
          <View style={styles.leadContent}>
            <ArticleInfo article={lead} showCategory={false} />
            <ArticleTitle article={lead} serif fontSize={22} lineHeight={28} />
            <ArticleSubtitle article={lead} />
          </View>
          {hasImage(lead) ? (
            <ArticleImage
              article={lead}
              imageSize={IMG_SIZE_XS}
              aspectRatio={1}
              borderRadius={16}
              showBadges={false}
              style={styles.leadImage}
            />
          ) : null}
        </View>
      </TouchableDebounce>
      {rows.map((article) => (
        <ArticleListItem
          key={article.id}
          article={article}
          thumbnail="left"
          thumbnailWidth={PHOTO_SIZE}
          thumbnailRadius={16}
          thumbnailAspectRatio={1}
          showCategory={false}
          titleSerif
          titleFontSize={16}
          titleLineHeight={20}
          style={{...styles.row, borderColor: colors.separator}}
        />
      ))}
      {columns.length > 0 ? (
        <View style={styles.columns}>
          {columns.map((article, index) => (
            <View
              key={article.id}
              style={{
                ...styles.column,
                borderColor: colors.separator,
                borderLeftWidth: index > 0 ? 1 : 0,
                paddingStart: index > 0 ? 16 : 0,
              }}>
              <ArticleListItem
                article={article}
                thumbnail="none"
                showCategory={false}
                titleSerif
                titleFontSize={16}
                titleLineHeight={20}
              />
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
};

export default OpinionsBlock;

const styles = StyleSheet.create({
  root: {
    marginHorizontal: 8,
    padding: 16,
    gap: 16,
  },
  lead: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  leadContent: {
    flex: 1,
    gap: 8,
  },
  leadImage: {
    width: PHOTO_SIZE,
  },
  row: {
    paddingBottom: 16,
    borderBottomWidth: 1,
    gap: 24,
  },
  columns: {
    flexDirection: 'row',
  },
  column: {
    flex: 1,
    paddingEnd: 16,
  },
});

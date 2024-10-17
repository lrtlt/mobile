import React, {useCallback, useMemo} from 'react';
import {View, StyleSheet} from 'react-native';
import {Article} from '../../../../Types';
import TextComponent from '../../text/Text';
import TouchableDebounce from '../../touchableDebounce/TouchableDebounce';
import ArticleBadges from '../article/ArticleBadges';
import Badge from '../../badge/Badge';
import {IconNumber1, IconNumber2, IconNumber3, IconNumber4, IconNumber5} from '../../svg';

interface Props {
  article: Article;
  index: number;
  onPress: (article: Article) => void;
}

const ArticleTextOnlyItem: React.FC<React.PropsWithChildren<Props>> = (props) => {
  const {article, index, onPress} = props;

  const onPressHandler = useCallback(() => {
    onPress(article);
  }, [article, onPress]);

  const date = Boolean(article.item_date) ? (
    <TextComponent style={styles.categoryTitle} type="secondary">
      {article.item_date}
    </TextComponent>
  ) : null;

  const badge = Boolean(article.badge_title) && (
    <Badge style={{marginTop: 2}} label={article.badge_title!!} type={article.badge_class} size="small" />
  );

  const icon = useMemo(() => {
    switch (index) {
      case 0:
        return <IconNumber1 />;
      case 1:
        return <IconNumber2 />;
      case 2:
        return <IconNumber3 />;
      case 3:
        return <IconNumber4 />;
      case 4:
        return <IconNumber5 />;
      default:
        return <IconNumber1 />;
    }
  }, [index]);

  return (
    <TouchableDebounce onPress={onPressHandler} debounceTime={500} activeOpacity={0.4}>
      <View style={{flexDirection: 'row'}}>
        <View style={{marginTop: 16}}>{icon}</View>
        <View style={{...styles.container}}>
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
            <TextComponent style={styles.categoryTitle}>{article.category_title}</TextComponent>
            {date ? <View style={styles.dateContainer}>{date}</View> : null}
          </View>
          {badge}
          <TextComponent style={styles.title} fontFamily="SourceSansPro-Regular">
            {article.title}
          </TextComponent>
          {Boolean(article.subtitle) && (
            <TextComponent style={styles.subtitle} type="error">
              {article.subtitle}
            </TextComponent>
          )}
          <ArticleBadges style={{paddingTop: 4}} article={article} />
        </View>
      </View>
    </TouchableDebounce>
  );
};

export default React.memo(ArticleTextOnlyItem, (prevProps, nextProps) => {
  return prevProps.article.title === nextProps.article.title;
});

const styles = StyleSheet.create({
  container: {
    maxWidth: 160,
    flex: 1,
    paddingLeft: 12,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    gap: 4,
  },
  title: {
    fontSize: 15,
  },
  timeText: {
    marginTop: 4,
    fontSize: 13,
  },
  image: {
    width: 110,
  },
  categoryTitle: {
    fontSize: 11,
    paddingEnd: 6,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 11,
  },
});

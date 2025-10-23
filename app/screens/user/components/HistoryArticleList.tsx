import {StyleSheet, View} from 'react-native';
import {ArticleSearchItem} from '../../../api/Types';
import {useCallback} from 'react';
import {CoverImage, MediaIcon, TouchableDebounce} from '../../../components';
import TextComponent from '../../../components/text/Text';

import {DEFAULT_ARTICLE_IMAGE} from '../../../constants';
import {SavedArticle} from '../../../state/article_storage_store';
import {getArticleImageUri, IMG_SIZE_M} from '../../../util/ImageUtil';
import {Article} from '../../../../Types';
import {ScrollView} from 'react-native-gesture-handler';
import {useTheme} from '../../../Theme';
import {useNavigation} from '@react-navigation/native';
import {MainStackParamList} from '../../../navigation/MainStack';
import {StackNavigationProp} from '@react-navigation/stack';

interface Props {
  articles: ArticleSearchItem[];
}

const HistoryArticleList: React.FC<React.PropsWithChildren<Props>> = ({articles}) => {
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  const {colors} = useTheme();

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={{flexDirection: 'row', gap: 12, padding: 12}}>
        {articles.map((article, i) => (
          <View
            key={article.id}
            style={{
              paddingRight: 12,
              borderRightWidth: i < articles.length - 1 ? StyleSheet.hairlineWidth : 0,
              borderColor: colors.border,
            }}>
            <Item
              article={article}
              onPress={(article) => {
                navigation.push('Article', {articleId: article.id});
              }}
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default HistoryArticleList;

const Item: React.FC<
  React.PropsWithChildren<{
    article: ArticleSearchItem;
    onPress: (article: SavedArticle) => void;
  }>
> = ({article, onPress}) => {
  const onPressHandler = useCallback(() => {
    onPress(article);
  }, [article, onPress]);

  const imgUri = getArticleImageUri(article as unknown as Article, IMG_SIZE_M);

  const mediaIcon =
    article.is_video || article.is_audio ? (
      <View style={{paddingRight: 8}}>
        <MediaIcon
          size={16}
          is_video={article?.is_video}
          is_audio={article?.is_audio}
          //   channel_id={article?.channel_id}
        />
      </View>
    ) : undefined;

  return (
    <TouchableDebounce onPress={onPressHandler} debounceTime={500} activeOpacity={0.4}>
      <View style={{flexDirection: 'row', width: 300}}>
        <CoverImage
          style={{...styles.image, aspectRatio: article.img_w_h}}
          source={{uri: imgUri ?? DEFAULT_ARTICLE_IMAGE}}
        />
        <View style={styles.container}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            {mediaIcon}
            <TextComponent style={styles.categoryTitle} fontFamily="SourceSansPro-SemiBold">
              {article.category_title}
            </TextComponent>
            {/* {date ? <View style={styles.dateContainer}>{date}</View> : null} */}
          </View>
          <TextComponent style={styles.title} numberOfLines={3}>
            {article.title}
          </TextComponent>
          {Boolean(article.subtitle) && (
            <TextComponent style={styles.subtitle} type="error">
              {article.subtitle}
            </TextComponent>
          )}
        </View>
      </View>
    </TouchableDebounce>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 12,
    gap: 2,
  },
  title: {
    flex: 1,
    fontSize: 16,
  },
  timeText: {
    fontSize: 13,
  },
  image: {
    width: 80,
  },
  categoryTitle: {
    fontSize: 12,
    paddingEnd: 6,
  },
  subtitle: {
    fontSize: 12,
  },
});

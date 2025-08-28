import React, {PropsWithChildren, useCallback, useState} from 'react';
import {ArticleContentMedia} from '../../../api/Types';
import {StyleSheet, View} from 'react-native';
import {useTheme} from '../../../Theme';
import TextComponent from '../../../components/text/Text';
import Divider from '../../../components/divider/Divider';
import {IconAudioReadCount} from '../../../components/svg';
import {TouchableDebounce} from '../../../components';
import FastImage from '@d11/react-native-fast-image';
import {buildArticleImageUri, IMG_SIZE_M} from '../../../util/ImageUtil';
import ArticleParagraph from '../../../components/articleParagraphs/paragraph/ArticleParagraph';
import ArticleKeywords from '../../article/keywords/ArticleKeywords';
import LRTArchivesBadge from '../../../components/lrtArchivesBadge/LRTArchivesBadge';

interface Props {
  article: ArticleContentMedia;
  isVodcast?: boolean;
}

const getMediaDurationMinutes = (mediaDuration?: string) => {
  if (!mediaDuration) {
    return '0';
  }
  const splits = mediaDuration.split(':');
  if (splits.length > 1) {
    return splits[1];
  }
  return '0';
};

type ContentType = 'episode' | 'show';

const PodcastAbout: React.FC<PropsWithChildren<Props>> = ({article, isVodcast = false}) => {
  const [selectedContent, setSelectedContent] = useState<ContentType>('episode');

  const {strings, colors} = useTheme();

  const onEpisodePressHandler = useCallback(() => {
    setSelectedContent('episode');
  }, []);

  const onShowPressHandler = useCallback(() => {
    setSelectedContent('show');
  }, []);

  const Tab = useCallback(
    ({label, selected}: {label: string; selected: boolean}) => (
      <View style={[styles.tab, {backgroundColor: selected ? colors.background : 'transparent'}]}>
        <TextComponent style={styles.tabLabel}>{label}</TextComponent>
      </View>
    ),
    [],
  );

  const EpisodeInfo = useCallback(() => {
    return (
      <>
        <View style={[styles.row, {gap: 4, marginVertical: 12, paddingTop: 12, paddingBottom: 8}]}>
          <IconAudioReadCount size={16} color={colors.text} />
          <TextComponent style={[styles.caption, {color: colors.text}]} fontFamily="SourceSansPro-SemiBold">
            {article.read_count}
          </TextComponent>
          <View
            style={{
              height: '100%',
              width: 1,
              marginHorizontal: 8,
              backgroundColor: colors.text,
            }}
          />
          <TextComponent style={[styles.caption, {color: colors.text}]} fontFamily="SourceSansPro-SemiBold">
            {getMediaDurationMinutes(article.media_duration)} min.
          </TextComponent>
        </View>
        <View pointerEvents="none">
          <TextComponent style={styles.title} fontFamily="PlayfairDisplay-Regular">
            {article.title}
          </TextComponent>
          <ArticleParagraph htmlText={article.content} textSize={16} />
        </View>
      </>
    );
  }, [article]);

  const ShowInfoPodcast = useCallback(() => {
    const aspectRatio = (article.category_img_info?.w_h && Number(article.category_img_info?.w_h)) ?? 1;
    return (
      <>
        <View style={[styles.row, {gap: 8, marginVertical: 8, alignItems: 'flex-start'}]}>
          <FastImage
            style={{...styles.podcastDetailsImage, aspectRatio: aspectRatio}}
            source={{
              uri: buildArticleImageUri(IMG_SIZE_M, article.category_img_info?.path),
            }}
          />
          <View style={{flex: 1}}>
            <ArticleParagraph htmlText={article.category_decription} textSize={16} />
          </View>
        </View>
      </>
    );
  }, [article]);

  const ShowInfoVodcast = useCallback(() => {
    const aspectRatio = (article.category_img_info?.w_h && Number(article.category_img_info?.w_h)) ?? 1;
    return (
      <>
        <View style={[{gap: 8, marginVertical: 8, alignItems: 'flex-start'}]}>
          {article.category_img_info && (
            <FastImage
              style={{...styles.podcastDetailsImage, aspectRatio: aspectRatio}}
              source={{
                uri: buildArticleImageUri(IMG_SIZE_M, article.category_img_info?.path),
              }}
            />
          )}
          <View>
            <TextComponent style={styles.title} fontFamily="PlayfairDisplay-Regular">
              {article.category_title}
            </TextComponent>
          </View>
          <View style={{flex: 1}}>
            <ArticleParagraph htmlText={article.category_decription} textSize={16} />
          </View>
        </View>
      </>
    );
  }, [article]);

  return (
    <View style={styles.root}>
      <View style={[styles.row, {gap: 8, marginVertical: 12}]}>
        <TouchableDebounce onPress={onEpisodePressHandler}>
          <Tab label={strings.about_episode} selected={selectedContent == 'episode'} />
        </TouchableDebounce>
        <TouchableDebounce onPress={onShowPressHandler}>
          <Tab label={strings.about_show} selected={selectedContent == 'show'} />
        </TouchableDebounce>
      </View>
      <Divider />
      {article.article_is_heritage === 1 && <LRTArchivesBadge />}
      {selectedContent === 'episode' ? (
        <EpisodeInfo />
      ) : isVodcast ? (
        <ShowInfoVodcast />
      ) : (
        <ShowInfoPodcast />
      )}
      <ArticleKeywords keywords={article.keywords} />
    </View>
  );
};

export default PodcastAbout;

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tab: {
    padding: 10,
    borderRadius: 4,
  },
  tabLabel: {
    fontSize: 13,
  },
  title: {
    fontSize: 20,
  },
  caption: {
    fontSize: 12,
  },
  podcastDetailsImage: {
    width: 100,
    marginTop: 12,
    borderRadius: 4,
    borderColor: '#FFF',
    borderWidth: 2,
  },
});

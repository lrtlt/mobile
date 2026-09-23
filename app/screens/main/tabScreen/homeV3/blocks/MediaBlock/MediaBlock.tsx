import React, {useCallback} from 'react';
import {Image, Linking, StyleSheet, View} from 'react-native';
import FastImage from '@d11/react-native-fast-image';
import {HomeV3BlockWithTitle, HomeV3MediaArticle} from '../../../../../../api/Types';
import {TouchableDebounce} from '../../../../../../components';
import {useNavigationStore} from '../../../../../../state/navigation_store';
import {getArticleImageUri, IMG_SIZE_L, IMG_SIZE_XS} from '../../../../../../util/ImageUtil';
import ArticleImage from '../../components/ArticleImage';
import ArticleInfo from '../../components/ArticleInfo';
import ArticleTitle from '../../components/ArticleTitle';
import ArticleSubtitle from '../../components/ArticleSubtitle';
import DurationBadge from '../../components/DurationBadge';
import MediaCta, {MEDIA_ACCENTS, MediaAccent} from '../../components/MediaCta';
import SectionTitle from '../../components/SectionTitle';
import useArticlePress from '../../components/useArticlePress';
import useHomeColors from '../../components/useHomeColors';
import {getMediaKind} from '../../util';

interface MediaBlockProps {
  block: HomeV3BlockWithTitle;
}

/**
 * Mediateka, Radioteka and Epika shelves: a lead with a media image and a colored
 * "Žiūrėti" / "Klausyti" button, then two rows with thumbnails, on a grey panel.
 */
const MediaBlock: React.FC<MediaBlockProps> = ({block}) => {
  const {block_title, block_url, articles_list: articles} = block.data;
  const kind = getMediaKind(block);
  const accent = MEDIA_ACCENTS[kind];
  const colors = useHomeColors();
  const pushArticle = useArticlePress();

  const onHeaderPress = useCallback(() => {
    switch (kind) {
      case 'video':
        useNavigationStore.getState().openMediatekaRoute();
        break;
      case 'audio':
        useNavigationStore.getState().openRadiotekaRoute();
        break;
      case 'epika':
        Linking.openURL(block_url).catch((e) => console.warn(e));
        break;
    }
  }, [block_url, kind]);

  const onArticlePress = useCallback(
    (article: HomeV3MediaArticle) => {
      if (kind === 'epika') {
        // Epika titles live on epika.lrt.lt, they are not app articles.
        Linking.openURL(article.href ?? article.url).catch((e) => console.warn(e));
      } else {
        pushArticle(article);
      }
    },
    [kind, pushArticle],
  );

  if (!articles?.length) {
    return null;
  }

  const [lead, ...rest] = articles;
  const isAudio = kind === 'audio';

  return (
    <View style={styles.root}>
      <SectionTitle style={styles.title} title={block_title} onPress={onHeaderPress} />
      <View style={{...styles.panel, backgroundColor: colors.sectionBackground}}>
        <TouchableDebounce onPress={() => onArticlePress(lead)} accessibilityRole="link" activeOpacity={0.8}>
          <View style={{...styles.lead, borderColor: colors.separator}}>
            {isAudio ? (
              <AudioCover article={lead} accent={accent} />
            ) : (
              <ArticleImage
                article={lead}
                imageUri={lead.image}
                imageSize={IMG_SIZE_L}
                aspectRatio={16 / 9}
                showBadges={false}
                showDuration
                style={styles.leadImage}>
                <MediaCta accent={accent} />
              </ArticleImage>
            )}
            <View style={styles.leadContent}>
              <ArticleInfo article={lead} absoluteDate />
              <ArticleTitle article={lead} serif fontSize={24} lineHeight={30} playPrefix="none" />
              <ArticleSubtitle article={lead} />
            </View>
          </View>
        </TouchableDebounce>
        {rest.map((article) => (
          <TouchableDebounce
            key={article.url}
            onPress={() => onArticlePress(article)}
            accessibilityRole="link"
            activeOpacity={0.8}>
            <View style={styles.row}>
              <View style={[styles.thumbShadow, isAudio ? styles.thumbAudio : styles.thumbVideo]}>
                <ArticleImage
                  article={article}
                  imageUri={article.image}
                  imageSize={IMG_SIZE_XS}
                  aspectRatio={isAudio ? 1 : 16 / 9}
                  borderRadius={isAudio ? 6 : 8}
                  showBadges={false}
                  showDuration
                  style={styles.thumb}
                />
              </View>
              <View style={styles.rowContent}>
                <ArticleInfo article={article} absoluteDate />
                <ArticleTitle article={article} fontSize={18} lineHeight={22} playPrefix={accent} />
                <ArticleSubtitle article={article} />
              </View>
            </View>
          </TouchableDebounce>
        ))}
      </View>
    </View>
  );
};

/** Radioteka lead: the square show cover centered on a blurred copy of itself. */
const AudioCover: React.FC<{article: HomeV3MediaArticle; accent: MediaAccent}> = ({article, accent}) => {
  const colors = useHomeColors();
  const uri = getArticleImageUri(article, IMG_SIZE_L);

  return (
    <View style={{...styles.audioCover, backgroundColor: colors.separator}}>
      {uri && article._add_blur_img ? (
        <Image style={StyleSheet.absoluteFill} source={{uri}} resizeMode="cover" blurRadius={30} />
      ) : null}
      <View style={styles.audioSquare}>
        {uri ? <FastImage style={styles.audioSquareImage} source={{uri}} resizeMode="cover" /> : null}
      </View>
      {article.media_duration ? <DurationBadge duration={article.media_duration} /> : null}
      <MediaCta accent={accent} />
    </View>
  );
};

export default MediaBlock;

const THUMB_SHADOW = {
  shadowColor: '#02030D',
  shadowOffset: {width: 0, height: 4},
  shadowOpacity: 0.32,
  shadowRadius: 4,
  elevation: 3,
};

const styles = StyleSheet.create({
  root: {
    marginHorizontal: 8,
  },
  title: {
    marginBottom: 16,
  },
  panel: {
    borderRadius: 8,
    paddingBottom: 16,
    gap: 24,
  },
  lead: {
    paddingBottom: 24,
    marginHorizontal: 16,
    borderBottomWidth: 1,
  },
  leadImage: {
    // The lead image spans the whole panel, past the 16pt side padding.
    width: 'auto',
    marginHorizontal: -16,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  leadContent: {
    paddingTop: 8,
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 24,
    marginHorizontal: 16,
  },
  thumbShadow: {
    borderRadius: 8,
    ...THUMB_SHADOW,
  },
  thumbVideo: {
    width: 156,
  },
  thumbAudio: {
    width: 96,
  },
  thumb: {
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  rowContent: {
    flex: 1,
    gap: 8,
  },
  audioCover: {
    marginHorizontal: -16,
    aspectRatio: 16 / 9,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  audioSquare: {
    height: '94%',
    aspectRatio: 1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    ...THUMB_SHADOW,
  },
  audioSquareImage: {
    flex: 1,
    borderRadius: 7,
  },
});

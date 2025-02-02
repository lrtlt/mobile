import {PropsWithChildren, useCallback} from 'react';
import {ArticleContentMedia} from '../../../api/Types';
import {StyleSheet, View} from 'react-native';
import {Text, TouchableDebounce} from '../../../components';
import {IconPlay} from '../../../components/svg';
import {useMediaPlayer} from '../../../components/videoComponent/context/useMediaPlayer';
import {buildArticleImageUri, IMG_SIZE_M} from '../../../util/ImageUtil';
import {MediaType} from '../../../components/videoComponent/context/PlayerContext';
import {useTheme} from '../../../Theme';

interface Props {
  article: ArticleContentMedia;
}

const PodcastEpisode: React.FC<PropsWithChildren<Props>> = ({article}) => {
  const {setMediaData} = useMediaPlayer();

  const {colors} = useTheme();

  const play = useCallback(() => {
    setMediaData({
      uri: article.stream_url,
      title: article.title,
      poster: buildArticleImageUri(IMG_SIZE_M, article.main_photo.path),
      mediaType: article.is_video ? MediaType.VIDEO : MediaType.AUDIO,
      isLiveStream: false,
    });
  }, [setMediaData, article]);

  return (
    <View style={[styles.root, {backgroundColor: colors.tabBarBackground}]}>
      <TouchableDebounce style={styles.playButton} onPress={play}>
        <IconPlay size={14} />
      </TouchableDebounce>
      <View style={{flex: 1, gap: 6}}>
        <View style={{flexDirection: 'row', gap: 8}}>
          <Text style={styles.caption}>{article.category_title}</Text>
          <Text style={styles.caption}>{article.date}</Text>
        </View>
        <Text style={styles.title}>{article.title}</Text>
      </View>
    </View>
  );
};

export default PodcastEpisode;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    gap: 16,
    margin: 12,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  playButton: {
    backgroundColor: '#FFD600',
    flexDirection: 'row',
    width: 40,
    gap: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    aspectRatio: 1,
  },
  title: {
    fontSize: 15,
  },
  caption: {
    fontSize: 12,
  },
});

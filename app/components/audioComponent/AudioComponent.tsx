import React, {useCallback, useState} from 'react';
import {View, ViewStyle} from 'react-native';
import {buildArticleImageUri, IMG_SIZE_L} from '../../util/ImageUtil';
import {ArticleContentMedia, ArticlePhotoType} from '../../api/Types';
import TheoMediaPlayer from '../videoComponent/TheoMediaPlayer';
import {MediaType} from '../videoComponent/context/PlayerContext';
import {useArticle} from '../../api/hooks/useArticle';
import {PlaybackTrackingMeta} from '../videoComponent/usePlaybackProgressTracker';
import {usePlaybackProgressStore} from '../../state/playback_progress_store';
import {PLAYBACK_PROGRESS_MIN_POSITION_SEC} from '../../constants';

interface AudioComponentProps {
  id?: number;
  style?: ViewStyle;
  streamUri: string;
  title: string;
  isLiveStream: boolean;
  cover?: ArticlePhotoType;
  autoStart: boolean;
  startTime?: number;
  progressTracking?: PlaybackTrackingMeta;
}

const MAX_ERROR_COUNT = 3;
const ERROR_DELAY = 300;

const resolveResumeStartTime = (articleId: number | undefined): number | undefined => {
  if (articleId == null) return undefined;
  const entry = usePlaybackProgressStore.getState().entries[articleId];
  if (!entry || entry.completed) return undefined;
  if (entry.positionSec < PLAYBACK_PROGRESS_MIN_POSITION_SEC) return undefined;
  return entry.positionSec;
};

const AudioComponent: React.FC<AudioComponentProps> = ({
  id,
  style,
  title,
  cover,
  autoStart,
  isLiveStream,
  startTime,
  streamUri,
  progressTracking,
}) => {
  const [errorCount, setErrorCount] = useState(0);

  const needsToryFetchArticle = !cover && !!id;
  const {data: articleReponse} = useArticle(needsToryFetchArticle ? id : undefined);
  const article = articleReponse?.article;

  const onPlayerError = useCallback(() => {
    setTimeout(() => {
      if (errorCount < MAX_ERROR_COUNT) {
        setErrorCount(errorCount + 1);
        console.log('Audio error count:', errorCount + 1);
      } else {
        console.log('Max error count reached!');
      }
    }, errorCount * ERROR_DELAY);
  }, [errorCount]);

  const poster = cover
    ? buildArticleImageUri(IMG_SIZE_L, cover.path)
    : article?.main_photo
    ? buildArticleImageUri(IMG_SIZE_L, article.main_photo?.path) ??
      buildArticleImageUri(IMG_SIZE_L, (article as ArticleContentMedia)?.category_img_info?.path)
    : undefined;
  return (
    <View style={style}>
      <TheoMediaPlayer
        key={`${streamUri}-${errorCount}`}
        streamUri={streamUri}
        title={title}
        isLiveStream={isLiveStream}
        mediaType={MediaType.AUDIO}
        autoStart={autoStart}
        poster={poster}
        startTime={startTime ?? resolveResumeStartTime(progressTracking?.articleId)}
        progressTracking={progressTracking}
        onError={onPlayerError}
      />
    </View>
  );
};

export default AudioComponent;

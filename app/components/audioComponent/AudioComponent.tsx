import React, {useCallback, useState} from 'react';
import {View, ViewStyle} from 'react-native';
import {buildArticleImageUri, IMG_SIZE_L} from '../../util/ImageUtil';
import {ArticlePhotoType} from '../../api/Types';
import TheoMediaPlayer from '../videoComponent/TheoMediaPlayer';
import {MediaType} from '../videoComponent/context/PlayerContext';

interface AudioComponentProps {
  style?: ViewStyle;
  streamUri: string;
  title: string;
  isLiveStream: boolean;
  cover?: ArticlePhotoType;
  autoStart: boolean;
  startTime?: number;
}

const MAX_ERROR_COUNT = 3;
const ERROR_DELAY = 300;

const AudioComponent: React.FC<AudioComponentProps> = ({
  style,
  title,
  cover,
  autoStart,
  isLiveStream,
  startTime,
  streamUri,
}) => {
  const [errorCount, setErrorCount] = useState(0);

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

  return (
    <View style={style}>
      <TheoMediaPlayer
        key={`${streamUri}-${errorCount}`}
        streamUri={streamUri}
        title={title}
        isLiveStream={isLiveStream}
        mediaType={MediaType.AUDIO}
        autoStart={autoStart}
        poster={cover ? buildArticleImageUri(IMG_SIZE_L, cover.path) : undefined}
        startTime={startTime}
        onError={onPlayerError}
      />
    </View>
  );
};

export default AudioComponent;

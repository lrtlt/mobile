import React, {useCallback, useState} from 'react';
import {View, ViewStyle} from 'react-native';
import {buildArticleImageUri, IMG_SIZE_L} from '../../util/ImageUtil';
import {ArticlePhotoType} from '../../api/Types';
import TheoMediaPlayer from '../videoComponent/TheoMediaPlayer';
import {MediaType} from '../videoComponent/context/VideoContext';

interface AudioComponentProps {
  style?: ViewStyle;
  streamUri: string;
  mediaId: string;
  title: string;
  cover?: ArticlePhotoType;
  autoStart: boolean;
  startTime?: number;
}

const MAX_ERROR_COUNT = 3;
const ERROR_DELAY = 300;

const AudioComponent: React.FC<AudioComponentProps> = ({
  style,
  mediaId: _,
  title,
  cover,
  autoStart,
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
        style={style}
        streamUri={streamUri}
        title={title}
        mediaType={MediaType.AUDIO}
        autoStart={autoStart}
        poster={cover ? buildArticleImageUri(IMG_SIZE_L, cover.path) : undefined}
        startTime={startTime}
        onError={onPlayerError}
      />
    </View>
  );
};

AudioComponent.defaultProps = {
  mediaId: '-1',
};

export default AudioComponent;

import React, {useCallback, useEffect, useState} from 'react';
import {View, ViewStyle} from 'react-native';
import {buildArticleImageUri, IMG_SIZE_L} from '../../util/ImageUtil';
import Gemius from 'react-native-gemius-plugin';
import {ArticlePhotoType} from '../../api/Types';
import Player from '../videoComponent/Player';

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
  mediaId,
  title,
  cover,
  autoStart,
  startTime,
  streamUri,
}) => {
  const [errorCount, setErrorCount] = useState(0);

  useEffect(() => {
    Gemius.setProgramData(mediaId, title, 0, false);
  }, [mediaId, title]);

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
      <Player
        key={`${streamUri}-${errorCount}`}
        style={style}
        title={title}
        uri={streamUri}
        autostart={autoStart}
        startTime={startTime}
        poster={cover ? buildArticleImageUri(IMG_SIZE_L, cover.path) : undefined}
        onError={onPlayerError}
      />
    </View>
  );
};

AudioComponent.defaultProps = {
  mediaId: '-1',
};

export default AudioComponent;

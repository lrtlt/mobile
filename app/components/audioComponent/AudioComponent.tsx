import React, {useCallback, useEffect, useState} from 'react';
import {View, ViewStyle} from 'react-native';
import JWPlayerNative from '../videoComponent/JWPlayerNative';
import {buildArticleImageUri, IMG_SIZE_L} from '../../util/ImageUtil';
import Gemius from 'react-native-gemius-plugin';
import {ArticlePhotoType} from '../../api/Types';

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
  ...restProps
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
      <JWPlayerNative
        key={`${restProps.streamUri}-${errorCount}`}
        style={style}
        mediaId={mediaId}
        title={title}
        autoStart={autoStart}
        startTime={startTime}
        backgroundImage={cover ? buildArticleImageUri(IMG_SIZE_L, cover.path) : undefined}
        onError={onPlayerError}
        {...restProps}
      />
    </View>
  );
};

AudioComponent.defaultProps = {
  mediaId: '-1',
};

export default AudioComponent;

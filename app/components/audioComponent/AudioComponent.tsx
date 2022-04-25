import React, {useEffect} from 'react';
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

const AudioComponent: React.FC<AudioComponentProps> = ({
  style,
  mediaId,
  title,
  cover,
  autoStart,
  startTime,
  ...restProps
}) => {
  useEffect(() => {
    Gemius.setProgramData(mediaId, title, 0, false);
  }, [mediaId, title]);

  return (
    <View style={style}>
      <JWPlayerNative
        style={style}
        mediaId={mediaId}
        title={title}
        autoStart={autoStart}
        startTime={startTime}
        backgroundImage={cover ? buildArticleImageUri(IMG_SIZE_L, cover.path) : undefined}
        {...restProps}
      />
    </View>
  );
};

AudioComponent.defaultProps = {
  mediaId: '-1',
};

export default AudioComponent;

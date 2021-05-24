import React, {useEffect} from 'react';
import {View, useWindowDimensions, ViewStyle} from 'react-native';
import JWPlayerNative from '../videoComponent/JWPlayerNative';
import {getImageSizeForWidth, buildArticleImageUri} from '../../util/ImageUtil';
import Gemius from 'react-native-gemius-plugin';
import {ArticlePhoto} from '../../api/Types';

interface AudioComponentProps {
  style?: ViewStyle;
  streamUri: string;
  mediaId: string;
  title: string;
  cover?: ArticlePhoto;
  autoStart: boolean;
}

const AudioComponent: React.FC<AudioComponentProps> = ({
  style,
  mediaId,
  title,
  cover,
  autoStart,
  ...restProps
}) => {
  useEffect(() => {
    Gemius.setProgramData(mediaId, title, 0, false);
  }, [mediaId]);

  return (
    <View style={style}>
      <JWPlayerNative
        style={style}
        mediaId={mediaId}
        title={title}
        autoStart={autoStart}
        backgroundImage={
          cover
            ? buildArticleImageUri(getImageSizeForWidth(useWindowDimensions().width), cover.path)
            : undefined
        }
        {...restProps}
      />
    </View>
  );
};

AudioComponent.defaultProps = {
  mediaId: '-1',
};

export default AudioComponent;

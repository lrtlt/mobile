import React from 'react';
import {View, Dimensions} from 'react-native';
import JWPlayerNative from '../videoComponent/JWPlayerNative';
import {getImageSizeForWidth, buildArticleImageUri} from '../../util/ImageUtil';
import Gemius from 'react-native-gemius-plugin';

const AudioComponent = (props) => {
  const mediaId = props.mediaId || '0';

  Gemius.setProgramData(mediaId, props.title, 0, false);

  const imgSize = getImageSizeForWidth(Dimensions.get('window').width);
  const imgUri = props.cover ? buildArticleImageUri(imgSize, props.cover.path) : null;

  return (
    <View {...props}>
      <JWPlayerNative {...props} backgroundImage={imgUri} />
    </View>
  );
};

AudioComponent.propTypes = {
  ...JWPlayerNative.propTypes,
};

AudioComponent.defaultProps = {
  isAudioOnly: true,
  autoPlay: false,
};

export default AudioComponent;

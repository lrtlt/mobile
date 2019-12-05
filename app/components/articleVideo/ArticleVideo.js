import React from 'react';
import { View } from 'react-native';
import Image from '../coverImage/CoverImage';
import Styles from './styles';
import { getImageSizeForWidth, buildImageUri } from '../../util/ImageUtil';
import MediaIndicator from '../mediaIndicator/MediaIndicator';
import VideoContainer from '../videoContainer/VideoContainer';

const renderCover = props => {
  const { data } = props;
  const imgSize = getImageSizeForWidth(props.expectedWidth);
  //const aspectRatio = parseFloat(data.photo_aspectratio);
  const aspectRatio = 16 / 9;

  return (
    <View {...props} style={{ ...props.style, ...Styles.container }}>
      <Image
        style={{ ...Styles.image, aspectRatio }}
        source={{
          uri: buildImageUri(imgSize, data.img_path_prefix, data.img_path_postfix),
        }}
      />
      <MediaIndicator style={Styles.mediaIndicator} />
    </View>
  );
};

const articleVideo = props => {
  return (
    <View style={Styles.playerContainer}>
      <VideoContainer
        style={Styles.player}
        isLiveStream={false}
        coverComponent={renderCover(props)}
        autoPlay={false}
        videoUrl={props.data.get_playlist_url || props.data.get_streams_url}
      />
    </View>
  );
};

export default articleVideo;

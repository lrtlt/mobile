import React from 'react';
import { View, Text } from 'react-native';
import Styles from './styles';
import CoverImage from '../../coverImage/CoverImage';
import LiveBadge from '../../liveBadge/LiveBadge';
import TouchableDebounce from '../../touchableDebounce/TouchableDebounce';
import { getImageSizeForWidth, buildArticleImageUri } from '../../../util/ImageUtil';
import MediaIcon from '../../mediaIndicator/MediaIndicator';

const liveChannel = props => {
  const data = props.data;

  const imgSize = getImageSizeForWidth(Styles.container.width);

  const imgUri = buildArticleImageUri(imgSize, data.photo);

  return (
    <TouchableDebounce debounceTime={500} onPress={() => props.onPress(props.data)}>
      <View style={Styles.container}>
        <View style={Styles.imageContainer}>
          <CoverImage
            style={Styles.image}
            source={{
              uri: imgUri,
            }}
          />
          <MediaIcon style={Styles.mediaIndicator} />
          <LiveBadge style={Styles.liveBadge} />
        </View>
        <Text style={Styles.title}>{data.title}</Text>
      </View>
    </TouchableDebounce>
  );
};

export default React.memo(liveChannel);

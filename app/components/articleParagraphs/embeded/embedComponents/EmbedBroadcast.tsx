import React, {useCallback} from 'react';
import {View, StyleSheet} from 'react-native';
import {ArticleEmbedBroadcastType} from '../../../../api/Types';
import {VIDEO_ASPECT_RATIO} from '../../../../constants';
import {getSmallestDim} from '../../../../util/UI';
import VideoComponent from '../../../videoComponent/VideoComponent';

interface Props {
  data: ArticleEmbedBroadcastType[];
}

const EmbedBroadcast: React.FC<Props> = ({data}) => {
  return (
    <View>
      {data.map(
        useCallback((item, i) => {
          return (
            <View style={styles.container} key={i}>
              <VideoComponent
                style={styles.player}
                cover={item.el}
                streamUrl={item.el.get_streams_url}
                autoPlay={false}
                title={item.el.title}
              />
            </View>
          );
        }, []),
      )}
    </View>
  );
};

export default EmbedBroadcast;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  player: {
    width: '100%',
    aspectRatio: VIDEO_ASPECT_RATIO,
    maxHeight: getSmallestDim() - 62,
  },
});

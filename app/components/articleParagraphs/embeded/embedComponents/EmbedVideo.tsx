import React, {useCallback} from 'react';
import {View, StyleSheet} from 'react-native';
import {ArticleEmbedVideoType} from '../../../../api/Types';
import {VIDEO_ASPECT_RATIO} from '../../../../constants';
import {getSmallestDim} from '../../../../util/UI';
import VideoComponent from '../../../videoComponent/VideoComponent';

interface Props {
  data: ArticleEmbedVideoType[];
}

const EmbedVideo: React.FC<React.PropsWithChildren<Props>> = ({data}) => {
  return (
    <View>
      {data.map(
        useCallback((item, i) => {
          return (
            <View style={styles.container} key={i}>
              <VideoComponent
                style={styles.player}
                cover={item.el}
                streamUrl={(item.el.get_playlist_url || item.el.get_streams_url)!}
                mediaId={item.el.article_id?.toString()}
                autoPlay={false}
                startTime={item.el.record_offset}
                title={item.el.title}
              />
            </View>
          );
        }, []),
      )}
    </View>
  );
};

export default EmbedVideo;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  player: {
    width: '100%',
    aspectRatio: VIDEO_ASPECT_RATIO,
    maxHeight: getSmallestDim() - 62,
  },
});

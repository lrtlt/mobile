import React, {useCallback} from 'react';
import {View, StyleSheet} from 'react-native';
import {ArticleEmbedAudioType} from '../../../../api/Types';
import {VIDEO_ASPECT_RATIO} from '../../../../constants';
import {getSmallestDim} from '../../../../util/UI';
import AudioComponent from '../../../audioComponent/AudioComponent';

interface Props {
  data: ArticleEmbedAudioType[];
}

const EmbedAudio: React.FC<React.PropsWithChildren<Props>> = ({data}) => {
  return (
    <View>
      {data.map(
        useCallback((item) => {
          const {stream_url, id, title, record_offset} = item.el;
          return (
            <View key={`audio-${id}`} style={styles.container}>
              <AudioComponent
                id={id}
                style={styles.player}
                streamUri={stream_url}
                isLiveStream={false}
                title={title}
                autoStart={false}
                startTime={record_offset}
              />
            </View>
          );
        }, []),
      )}
    </View>
  );
};

export default EmbedAudio;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    aspectRatio: VIDEO_ASPECT_RATIO,
  },
  player: {
    width: '100%',
    aspectRatio: VIDEO_ASPECT_RATIO,
    maxHeight: getSmallestDim() - 62,
  },
});

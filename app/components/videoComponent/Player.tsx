import React from 'react';
import Video from 'react-native-video';

interface Props {
  uri: string;
}
const Player: React.FC<Props> = ({uri}) => {
  return (
    <Video
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        aspectRatio: 16 / 9,
      }}
      resizeMode="contain"
      paused={false}
      audioOnly={false}
      fullscreen={true}
      controls={true}
      muted={false}
      rate={1.0}
      playInBackground={true}
      // onLoadStart={onLoadStart}
      // onProgress={onProgress}
      // onError={onError}
      // onLoad={onLoadHandler}
      // onEnd={onFinished}
      // onSeek={onSeek}
      progressUpdateInterval={250}
      ignoreSilentSwitch={'ignore'}
      automaticallyWaitsToMinimizeStalling={false}
      source={{
        uri: uri,
      }}
    />
  );
};

export default Player;

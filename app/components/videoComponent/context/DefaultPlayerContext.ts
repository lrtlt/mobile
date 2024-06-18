import {PlayerContextType} from './PlayerContext';
import TrackPlayer, {PitchAlgorithm, TrackType} from 'react-native-track-player';

const defaultPlayerContext: PlayerContextType = {
  setPlaylist: async (data, current) => {
    await TrackPlayer.setQueue(
      data.map((item) => ({
        url: item.uri,
        artwork: item.poster,
        title: item.title,
        pitchAlgorithm: PitchAlgorithm.Voice,
        type: TrackType.HLS,
        isLiveStream: item.isLiveStream,
      })),
    );

    if (current !== undefined) {
      await TrackPlayer.skip(current);
    }
    await TrackPlayer.play();
  },
  playNext: () => console.log('playNext'),
  playPrevious: () => console.log('playPrevious'),
  close: () => TrackPlayer.reset(),
};

export default defaultPlayerContext;

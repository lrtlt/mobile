import {useEffect} from 'react';
import TrackPlayer, {Capability, IOSCategory, IOSCategoryMode, RepeatMode} from 'react-native-track-player';

let _isReady = false;

export const setupTrackPlayer = async () => {
  if (_isReady) {
    return;
  }
  _isReady = true;

  await TrackPlayer.setupPlayer({
    iosCategory: IOSCategory.Playback,
    iosCategoryMode: IOSCategoryMode.SpokenAudio,
    autoHandleInterruptions: true,
    autoUpdateMetadata: true,
    //androidAudioContentType: 'music',
  });
  await TrackPlayer.updateOptions({
    capabilities: [
      Capability.Play,
      Capability.Pause,
      Capability.SkipToNext,
      Capability.SkipToPrevious,
      Capability.JumpBackward,
      Capability.JumpForward,
      Capability.SeekTo,
      Capability.Stop,
    ],
    notificationCapabilities: [
      Capability.Play,
      Capability.Pause,
      Capability.SkipToNext,
      Capability.SkipToPrevious,
      Capability.JumpBackward,
      Capability.JumpForward,
      Capability.SeekTo,
    ],
    compactCapabilities: [
      Capability.Play,
      Capability.Pause,
      Capability.SkipToNext,
      Capability.SkipToPrevious,
      Capability.JumpBackward,
      Capability.JumpForward,
      Capability.SeekTo,
    ],
  });
  await TrackPlayer.setRepeatMode(RepeatMode.Queue);
  console.log('### TrackPlayer ready!');
};

const useTrackPlayerSetup = () => {
  useEffect(() => {
    setupTrackPlayer();
  }, []);
};

export default useTrackPlayerSetup;

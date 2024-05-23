import {useCallback, useEffect} from 'react';
import TrackPlayer, {Capability, IOSCategory, IOSCategoryMode, RepeatMode} from 'react-native-track-player';

const useTrackPlayerSetup = () => {
  const setup = useCallback(async () => {
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
    console.log('TrackPlayer ready!');
  }, []);

  useEffect(() => {
    setup();
  }, []);
};

export default useTrackPlayerSetup;

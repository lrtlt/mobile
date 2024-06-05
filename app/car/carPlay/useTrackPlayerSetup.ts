import {useCallback, useEffect} from 'react';
import TrackPlayer, {
  AndroidAutoContentStyle,
  Capability,
  IOSCategory,
  IOSCategoryMode,
  MediaItemPlayable,
  RepeatMode,
} from 'react-native-track-player';
import mediaBrowser from './browsable';

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

    TrackPlayer.setBrowseTree(mediaBrowser);
    TrackPlayer.setBrowseTreeStyle(AndroidAutoContentStyle.CategoryList, AndroidAutoContentStyle.Grid);
  }, []);

  useEffect(() => {
    setup();
  }, []);
};

export default useTrackPlayerSetup;

import {useEffect} from 'react';
import TrackPlayer, {
  AndroidAudioContentType,
  AndroidAutoContentStyle,
  Capability,
  IOSCategory,
  IOSCategoryMode,
  RepeatMode,
} from 'react-native-track-player';
import mediaBrowser from './mediaBrowser';

let _isReady = false;

export const setupTrackPlayer = async () => {
  if (_isReady && __DEV__ === false) {
    return;
  }

  console.log('TrackPlayer: setup starting...');
  _isReady = true;

  try {
    await TrackPlayer.setupPlayer({
      iosCategory: IOSCategory.Playback,
      iosCategoryMode: IOSCategoryMode.SpokenAudio,
      androidAudioContentType: AndroidAudioContentType.Speech,
      autoHandleInterruptions: true,
      autoUpdateMetadata: true,
    });
  } catch (e) {
    console.log('TrackPlayer setup error: ', e);
  }

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

  await TrackPlayer.setBrowseTree(mediaBrowser);
  await TrackPlayer.setBrowseTreeStyle(AndroidAutoContentStyle.CategoryList, AndroidAutoContentStyle.Grid);

  console.log('TrackPlayer ready!');
};

const useTrackPlayerSetup = () => {
  useEffect(() => {
    setupTrackPlayer();
  }, []);
};

export default useTrackPlayerSetup;

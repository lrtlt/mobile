import TrackPlayer, {Event, PlaybackState, State} from 'react-native-track-player';
import {tracker} from './app/components/videoComponent/useMediaTracking';
import Gemius from 'react-native-gemius-plugin';

const PlaybackService = async () => {
  TrackPlayer.addEventListener(Event.RemotePause, () => {
    console.log('Event.RemotePause');
    TrackPlayer.pause();
  });
  TrackPlayer.addEventListener(Event.RemotePlay, () => {
    console.log('Event.RemotePlay');
    TrackPlayer.play();
  });
  TrackPlayer.addEventListener(Event.RemoteStop, () => {
    console.log('Event.RemoteStop');
    TrackPlayer.stop();
  });
  TrackPlayer.addEventListener(Event.RemoteNext, () => {
    console.log('Event.RemoteNext');
    TrackPlayer.skipToNext();
  });
  TrackPlayer.addEventListener(Event.RemotePrevious, () => {
    console.log('Event.RemotePrevious');
    TrackPlayer.skipToPrevious();
  });
  TrackPlayer.addEventListener(Event.RemoteJumpForward, async (event) => {
    console.log('Event.RemoteJumpForward', event);
    await TrackPlayer.seekBy(event.interval);

    const activeTrack = await TrackPlayer.getActiveTrack();
    if (!activeTrack) {
      console.warn('No active track');
      return;
    }
    const progress = await TrackPlayer.getProgress();
    tracker.trackSeek(activeTrack.url, progress.position);
  });
  TrackPlayer.addEventListener(Event.RemoteJumpBackward, async (event) => {
    console.log('Event.RemoteJumpBackward', event);
    await TrackPlayer.seekBy(-event.interval);

    const activeTrack = await TrackPlayer.getActiveTrack();
    if (!activeTrack) {
      console.warn('No active track');
      return;
    }
    const progress = await TrackPlayer.getProgress();
    tracker.trackSeek(activeTrack.url, progress.position);
  });
  TrackPlayer.addEventListener(Event.RemoteSeek, async (event) => {
    console.log('Event.RemoteSeek', event);
    TrackPlayer.seekTo(event.position);

    const activeTrack = await TrackPlayer.getActiveTrack();
    if (!activeTrack) {
      console.log('PlaybackService: no active track. Skipping analytics tracking.');
      return;
    }
    tracker.trackSeek(activeTrack.url, event.position);
  });
  // TrackPlayer.addEventListener(Event.RemoteDuck, async (event) => {
  //   console.log('Event.RemoteDuck', event);
  // });
  // TrackPlayer.addEventListener(Event.PlaybackQueueEnded, (event) => {
  //   console.log('Event.PlaybackQueueEnded', event);
  // });
  // TrackPlayer.addEventListener(Event.PlaybackActiveTrackChanged, (event) => {
  //   console.log('Event.PlaybackActiveTrackChanged', event);
  // });
  // TrackPlayer.addEventListener(Event.PlaybackProgressUpdated, (event) => {
  //   console.log('Event.PlaybackProgressUpdated', event);
  // });
  // TrackPlayer.addEventListener(Event.PlaybackPlayWhenReadyChanged, (event) => {
  //   console.log('Event.PlaybackPlayWhenReadyChanged', event);
  // });
  TrackPlayer.addEventListener(Event.PlaybackState, async (event) => {
    console.log('Event.PlaybackState', event);
    const activeTrack = await TrackPlayer.getActiveTrack();
    if (!activeTrack) {
      console.log('PlaybackService: no active track. Skipping analytics tracking.');
      return;
    }

    const progress = await TrackPlayer.getProgress();
    switch (event.state) {
      case State.Ready:
        Gemius.setProgramData(activeTrack.url, activeTrack.title ?? '', progress.duration, false);
        break;
      case State.Playing:
        tracker.trackPlay(activeTrack.url, progress.position);
        break;
      case State.Paused:
        tracker.trackPause(activeTrack.url, progress.position);
        break;
      case State.Stopped:
        tracker.trackClose(activeTrack.url, progress.position);
        break;
      case State.Buffering:
        tracker.trackBuffer(activeTrack.url, progress.position);
        break;
      case State.Ended:
        tracker.trackComplete(activeTrack.url, progress.position);
        break;
    }
  });
  // TrackPlayer.addEventListener(Event.PlaybackMetadataReceived, (event) => {
  //   console.log('[Deprecated] Event.PlaybackMetadataReceived', event);
  // });
  // TrackPlayer.addEventListener(Event.MetadataChapterReceived, (event) => {
  //   console.log('Event.MetadataChapterReceived', event);
  // });
  // TrackPlayer.addEventListener(Event.MetadataTimedReceived, (event) => {
  //   console.log('Event.MetadataTimedReceived', event);
  // });
  // TrackPlayer.addEventListener(Event.MetadataCommonReceived, (event) => {
  //   console.log('Event.MetadataCommonReceived', event);
  // });
  // TrackPlayer.addEventListener(Event.PlaybackProgressUpdated, (event) => {
  //   console.log('Event.PlaybackProgressUpdated', event);
  // });
  // TrackPlayer.addEventListener(Event.MetadataCommonReceived, async ({metadata}) => {
  //   const activeTrack = await TrackPlayer.getActiveTrack();
  //   console.log('Event.MetadataCommonReceived', metadata, activeTrack);
  //   TrackPlayer.updateNowPlayingMetadata({
  //     artist: [metadata.title, metadata.artist].filter(Boolean).join(' - '),
  //     title: activeTrack?.title ?? metadata.title,
  //     artwork: activeTrack?.artwork ?? metadata.artworkUri,
  //     duration: activeTrack?.duration,
  //     isLiveStream: activeTrack?.isLiveStream,
  //   });
  // });
};

export default PlaybackService;

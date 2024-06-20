import TrackPlayer, {Event, State} from 'react-native-track-player';
import {tracker} from './app/components/videoComponent/useMediaTracking';
import Gemius from 'react-native-gemius-plugin';
import {Platform} from 'react-native';
import {
  TAB_LIVE,
  TAB_NEWEST,
  TAB_PODCASTS,
  TAB_RECOMMENDED,
  onItemSelected,
  onLiveTabOpened,
  onNewestTabOpened,
  onPodcastSelect,
  onPodcastsTabOpened,
  onRecommendedTabOpened,
} from './app/car/AndroidAuto';

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

  if (Platform.OS === 'android') {
    setupAndroidAuto();
  }
};

function setupAndroidAuto() {
  TrackPlayer.addEventListener(Event.RemotePlayId, async (event) => {
    console.log('Event.RemotePlayId', event);
    onItemSelected(event.id, (event as any)['android.media.browse.CONTENT_STYLE_GROUP_TITLE_HINT']);
  });

  TrackPlayer.addEventListener(Event.RemotePlaySearch, (event) => {
    console.log('Event.RemotePlaySearch', event);
    // For demonstration purposes, code below searches if queue contains "soul"; then
    // TrackPlayer plays the 2nd song (Soul Searching) in the queue. users must build their own search-playback
    // methods to handle this event.
    if (event.query.toLowerCase().includes('soul')) {
      TrackPlayer.skip(1).then(() => TrackPlayer.play());
    }
  });

  TrackPlayer.addEventListener(Event.RemoteSkip, (event) => {
    // As far as I can tell, Event.RemoteSkip is an android only event that handles the "queue" button (top right)
    // clicks in android auto. it simply emits an index in the current queue to be played.
    console.log('Event.RemoteSkip', event);
    TrackPlayer.skip(event.index).then(() => TrackPlayer.play());
  });

  TrackPlayer.addEventListener(Event.RemoteBrowse, (event) => {
    // This event is emitted when onLoadChildren is called. the mediaId is returned to allow RNTP to handle any
    // content updates.
    console.log('Event.RemoteBrowse', event);
    switch (true) {
      case event.mediaId === '/':
        onRecommendedTabOpened();
      case event.mediaId === TAB_RECOMMENDED:
        onRecommendedTabOpened();
        break;
      case event.mediaId === TAB_LIVE:
        onLiveTabOpened();
        break;
      case event.mediaId === TAB_NEWEST:
        onNewestTabOpened();
        break;
      case event.mediaId === TAB_PODCASTS:
        onPodcastsTabOpened();
        break;
      case event.mediaId.startsWith('podcast-'):
        onPodcastSelect(event.mediaId);
        break;
      default:
        console.warn('Unhandled browse event', event);
    }
  });
}

export default PlaybackService;

import {debounce} from 'lodash';
import Gemius from 'react-native-gemius-plugin';

type MediaAnalyticsTracker = {
  trackPlay: (mediaId: string, time: number) => void;
  trackPause: (mediaId: string, time: number) => void;
  trackClose: (mediaId: string, time: number) => void;
  trackBuffer: (mediaId: string, time: number) => void;
  trackComplete: (mediaId: string, time: number) => void;
  trackSeek: (mediaId: string, time: number) => void;
};

const EVENT_DEBOUNCE_DURATION = 200;

const trackPlay = debounce((mediaId: string, time: number) => {
  console.log('MediaAnalyticsTracker event: play', time);
  Gemius.sendPlay(mediaId, time ? time : 0);
}, EVENT_DEBOUNCE_DURATION);

const trackPause = debounce((mediaId: string, time: number) => {
  console.log('MediaAnalyticsTracker event: pause', time);
  Gemius.sendPause(mediaId, time ? time : 0);
}, EVENT_DEBOUNCE_DURATION);

const trackClose = debounce((mediaId: string, time: number) => {
  console.log('MediaAnalyticsTracker event: close', time);
  Gemius.sendClose(mediaId, time ? time : 0);
}, EVENT_DEBOUNCE_DURATION);

const trackBuffer = debounce((mediaId: string, time: number) => {
  console.log('MediaAnalyticsTracker event: buffering');
  Gemius.sendBuffer(mediaId, time ? time : 0);
}, EVENT_DEBOUNCE_DURATION);

const trackComplete = debounce((mediaId: string, time: number) => {
  console.log('MediaAnalyticsTracker event: complete');
  Gemius.sendComplete(mediaId, time ? time : 0);
}, EVENT_DEBOUNCE_DURATION);

const trackSeek = debounce((mediaId: string, time: number) => {
  console.log('MediaAnalyticsTracker event: seek ' + time);
  Gemius.sendSeek(mediaId, time);
}, EVENT_DEBOUNCE_DURATION);

export const tracker: MediaAnalyticsTracker = {
  trackPlay,
  trackPause,
  trackClose,
  trackBuffer,
  trackComplete,
  trackSeek,
};

const useMediaTracking = (): MediaAnalyticsTracker => {
  return tracker;
};

export default useMediaTracking;

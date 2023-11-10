import {debounce} from 'lodash';
import {useMemo} from 'react';
import Gemius from 'react-native-gemius-plugin';

type ReturnType = {
  trackPlay: (mediaId: string, time: number) => void;
  trackPause: (mediaId: string, time: number) => void;
  trackClose: (mediaId: string, time: number) => void;
  trackBuffer: (mediaId: string, time: number) => void;
  trackComplete: (mediaId: string, time: number) => void;
  trackSeek: (mediaId: string, time: number) => void;
};

const EVENT_DEBOUNCE_DURATION = 200;

const useMediaTracking = (): ReturnType => {
  const sendPlay = useMemo(
    () =>
      debounce((mediaId: string, time: number) => {
        console.log('MediaPlayer event: play');
        Gemius.sendPlay(mediaId, time ? time : 0);
      }, EVENT_DEBOUNCE_DURATION),
    [],
  );

  const sendPause = useMemo(
    () =>
      debounce((mediaId: string, time: number) => {
        console.log('MediaPlayer event: pause');
        Gemius.sendPause(mediaId, time ? time : 0);
      }, EVENT_DEBOUNCE_DURATION),
    [],
  );

  const sendClose = useMemo(
    () =>
      debounce((mediaId: string, time: number) => {
        console.log('MediaPlayer event: close');
        Gemius.sendClose(mediaId, time ? time : 0);
      }, EVENT_DEBOUNCE_DURATION),
    [],
  );

  const sendBuffer = useMemo(
    () =>
      debounce((mediaId: string, time: number) => {
        console.log('MediaPlayer event: buffering');
        Gemius.sendBuffer(mediaId, time ? time : 0);
      }, EVENT_DEBOUNCE_DURATION),
    [],
  );

  const sendComplete = useMemo(
    () =>
      debounce((mediaId: string, time: number) => {
        console.log('MediaPlayer event: complete');
        Gemius.sendComplete(mediaId, time ? time : 0);
      }, EVENT_DEBOUNCE_DURATION),
    [],
  );

  const sendSeek = useMemo(
    () =>
      debounce((mediaId: string, time: number) => {
        console.log('MediaPlayer event: seek ' + time);
        Gemius.sendSeek(mediaId, time);
      }, EVENT_DEBOUNCE_DURATION),
    [],
  );

  return {
    trackPlay: sendPlay,
    trackPause: sendPause,
    trackSeek: sendSeek,
    trackBuffer: sendBuffer,
    trackClose: sendClose,
    trackComplete: sendComplete,
  };
};

export default useMediaTracking;

import React from 'react';
import {FullScreenListener} from './VideoProvider';

// eslint-disable-next-line no-shadow
export enum MediaType {
  AUDIO,
  VIDEO,
}

export type VideoBaseData = {
  uri?: string;
  title?: string;
  poster?: string;
  mediaType: MediaType;
};

export type VideoContextType = VideoBaseData & {
  getCurrentTime: () => number;
  setCurrentTime: (time: number) => void;

  isFullScreen?: boolean;

  isMuted?: boolean;
  setIsMuted: (muted: boolean) => void;

  isPausedByUser?: boolean;
  setIsPausedByUser: (paused: boolean) => void;

  setVideoBaseData: (data: VideoBaseData) => void;
  setIsFullScreen: (fullScreen: boolean) => void;

  registerFullScreenListener: (key: string, listener: FullScreenListener) => void;
  unregisterFullScreenListener: (key: string) => void;
};

const noOp = (): any => {
  console.warn('VideoContext: NO OP CALLED!');
};

export const VideoContext = React.createContext<VideoContextType>({
  mediaType: MediaType.VIDEO,
  setCurrentTime: noOp,
  getCurrentTime: noOp,
  setVideoBaseData: noOp,
  setIsMuted: noOp,
  setIsPausedByUser: noOp,
  setIsFullScreen: noOp,
  registerFullScreenListener: noOp,
  unregisterFullScreenListener: noOp,
});

import React from 'react';
import {FullScreenListener} from './VideoProvider';

export type VideoBaseData = {
  uri?: string;
  title?: string;
  poster?: string;
};

export type VideoContextType = VideoBaseData & {
  getCurrentTime: () => number;
  setCurrentTime: (time: number) => void;

  isFullScreen?: boolean;

  isMuted?: boolean;
  setIsMuted: (muted: boolean) => void;

  setVideoBaseData: (data: VideoBaseData) => void;
  setIsFullScreen: (fullScreen: boolean) => void;

  registerFullScreenListener: (key: string, listener: FullScreenListener) => void;
  unregisterFullScreenListener: (key: string) => void;
};

const noOp = (): any => {
  console.log('VideoContext: NO OP CALLED!');
};

export const VideoContext = React.createContext<VideoContextType>({
  setCurrentTime: noOp,
  getCurrentTime: noOp,
  setVideoBaseData: noOp,
  setIsMuted: noOp,
  setIsFullScreen: noOp,
  registerFullScreenListener: noOp,
  unregisterFullScreenListener: noOp,
});

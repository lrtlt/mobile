import React from 'react';

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
  isLiveStream?: boolean;
};

export type VideoContextType = VideoBaseData & {
  getCurrentTime: () => number;
  setCurrentTime: (time: number) => void;
  setVideoBaseData: (data: VideoBaseData) => void;
};

const noOp = (): any => {
  console.warn('VideoContext: NO OP CALLED!');
};

export const VideoContext = React.createContext<VideoContextType>({
  mediaType: MediaType.VIDEO,
  setCurrentTime: noOp,
  getCurrentTime: noOp,
  setVideoBaseData: noOp,
});

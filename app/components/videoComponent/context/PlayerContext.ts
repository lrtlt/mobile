import React from 'react';
import {VideoTextTrack} from '../../../api/Types';

export enum MediaType {
  AUDIO,
  VIDEO,
}

export type MediaBaseData = {
  uri: string;
  title?: string;
  poster?: string;
  mediaType: MediaType;
  isLiveStream: boolean;
  startTime?: number;
  tracks?: VideoTextTrack[];
};

export type PlayerContextType = {
  mediaData?: MediaBaseData;
  setMediaData: (data: MediaBaseData) => void;
  close: () => void;
};

const _noOp = () => {};

export const PlayerContext = React.createContext<PlayerContextType>({
  setMediaData: _noOp,
  close: _noOp,
});

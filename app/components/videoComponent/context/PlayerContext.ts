import React from 'react';
import {VideoTextTrack} from '../../../api/Types';
import {Playlist} from './playlist/Playlist';

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
  setPlaylist: (playlist: Playlist) => void;
  close: () => void;
};

const _noOp = () => {};

export const PlayerContext = React.createContext<PlayerContextType>({
  setMediaData: _noOp,
  setPlaylist: _noOp,
  close: _noOp,
});

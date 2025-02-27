import {MediaBaseData} from '../PlayerContext';

export type PlaylistItem = {
  id: string | number;
  data?: MediaBaseData;
};

export interface Playlist {
  getCurrent(): PlaylistItem | null;
  load(): Promise<MediaBaseData | null>;
  next(): PlaylistItem | null;
  previous(): PlaylistItem | null;
  getCurrentIndex(): number;
}

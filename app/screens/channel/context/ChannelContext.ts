import React from 'react';
import {ChannelResponse} from '../../../api/Types';
import {StreamData} from '../../../components/videoComponent/useStreamData';

const STATE_LOADING = 'loading';
const STATE_ERROR = 'error';
const STATE_READY = 'ready';

export type ChannelContextType = {
  loadChannel: (channelId: string | number) => void;
  reloadProgram: () => void;
  channelData?: ChannelResponse;
  streamData?: StreamData;
  audioStreamData?: StreamData;
  lastFetchTime: number;
  loadingState: typeof STATE_LOADING | typeof STATE_ERROR | typeof STATE_READY;
};

const noOp = (): any => {
  console.warn('ChannelContext: NO OP CALLED!');
};

export const ChannelContext = React.createContext<ChannelContextType>({
  loadChannel: noOp,
  reloadProgram: noOp,
  lastFetchTime: 0,
  loadingState: STATE_LOADING,
});

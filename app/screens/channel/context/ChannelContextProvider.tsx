import React, {useCallback, useState} from 'react';
import {ChannelContext, ChannelContextType} from './ChannelContext';
import useCancellablePromise from '../../../hooks/useCancellablePromise';
import {fetchChannel, fetchVideoData} from '../../../api';
import {isVideoLiveStream} from '../../../api/Types';
import {StreamData} from '../../../components/videoComponent/useStreamData';
import {LRT_KLASIKA, LRT_OPUS, LRT_RADIJAS} from '../../../constants';

const getPosterByChannelId = (channelId: string) => {
  switch (channelId) {
    case '5': {
      return LRT_KLASIKA;
    }
    case '6': {
      return LRT_OPUS;
    }
    default: {
      return LRT_RADIJAS;
    }
  }
};

const ChannelProvider: React.FC<React.PropsWithChildren<{}>> = ({children}) => {
  const [state, setState] = useState<Omit<ChannelContextType, 'loadChannel' | 'reloadProgram'>>({
    channelData: undefined,
    lastFetchTime: 0,
    loadingState: 'loading',
  });

  const cancellablePromise = useCancellablePromise();

  const loadChannel = useCallback((channelId: string | number) => {
    cancellablePromise(fetchChannel(channelId))
      .then((channelResponse) => {
        cancellablePromise(fetchVideoData(channelResponse.channel_info.get_streams_url)).then(
          (streamResponse) => {
            if (isVideoLiveStream(streamResponse)) {
              const {data} = streamResponse.response;
              const streamData: StreamData = {
                channelTitle: channelResponse.channel_info.channel,
                isLiveStream: true,
                streamUri: data.content.trim(),
                title: channelResponse.channel_info?.title ?? 'untitled-live-stream',
                mediaId: data.content,
                offset: undefined,
              };

              let audioStreamData: StreamData | undefined;
              if (data.audio) {
                audioStreamData = {
                  ...streamData,
                  streamUri: data.audio.trim(),
                  poster: getPosterByChannelId(String(channelId)),
                };
              }

              setState({
                channelData: channelResponse,
                streamData,
                audioStreamData,
                lastFetchTime: Date.now(),
                loadingState: channelResponse.channel_info && streamData ? 'ready' : 'error',
              });
            }
          },
        );
      })
      .catch(() =>
        setState({
          channelData: undefined,
          streamData: undefined,
          audioStreamData: undefined,
          lastFetchTime: 0,
          loadingState: 'error',
        }),
      );
  }, []);

  const reloadProgram = useCallback(() => {
    if (!state.channelData) {
      return;
    }
    cancellablePromise(fetchChannel(state.channelData.channel_info.channel_id)).then((response) =>
      setState({
        ...state,
        channelData: {
          ...state.channelData!,
          prog: response.prog,
        },
        lastFetchTime: Date.now(),
      }),
    );
  }, []);

  return (
    <ChannelContext.Provider
      value={{
        ...state,
        loadChannel,
        reloadProgram,
      }}>
      {children}
    </ChannelContext.Provider>
  );
};

export default ChannelProvider;

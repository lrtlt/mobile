import {useEffect, useState} from 'react';
import CastContext, {
  CastState,
  MediaHlsSegmentFormat,
  MediaHlsVideoSegmentFormat,
  MediaInfo,
  MediaStatus,
  MediaStreamType,
  RemoteMediaClient,
} from 'react-native-google-cast';
import {THEOplayer} from 'react-native-theoplayer';
import {MediaType} from './context/PlayerContext';

type Props = {
  player?: THEOplayer;
  streamUri: string;
  isLiveStream: boolean;
  mediaType: MediaType;
  title?: string;
  poster: string;
};

const useChromecast = ({player, mediaType, isLiveStream, poster, streamUri, title}: Props) => {
  const [client, setClient] = useState<RemoteMediaClient>();
  const [mediaStatus, setMediaStatus] = useState<MediaStatus | null>(null);

  useEffect(() => {
    const subscription = client?.onMediaStatusUpdated((status) => {
      setMediaStatus(status);
    });

    return () => subscription?.remove();
  }, [client]);

  useEffect(() => {
    if (!player) {
      return;
    }

    const subscription = CastContext.onCastStateChanged((castState) => {
      if (castState === CastState.CONNECTED) {
        CastContext.sessionManager.getCurrentCastSession().then((session) => {
          const client = session?.client;
          const isAudio = mediaType === MediaType.AUDIO;
          const isLRT1 = streamUri.includes('lrt-portal-prod-01');

          console.log('streamUri', streamUri);
          console.log('isAudio', isAudio);
          console.log('isLRT1', isLRT1);

          setClient(client);
          player.pause();

          const startTime = player.currentTime / 1000;
          const mediaInfo: MediaInfo = {
            hlsSegmentFormat: isLRT1
              ? MediaHlsSegmentFormat.AAC
              : isLiveStream
              ? isAudio
                ? MediaHlsSegmentFormat.TS_AAC
                : MediaHlsSegmentFormat.TS
              : MediaHlsSegmentFormat.AAC,
            hlsVideoSegmentFormat: MediaHlsVideoSegmentFormat.MPEG2_TS,
            contentId: streamUri,
            contentUrl: streamUri,
            streamType: isLiveStream ? MediaStreamType.LIVE : MediaStreamType.BUFFERED,
            contentType: 'application/vnd.apple.mpegurl',
            metadata: {
              type: isAudio ? 'musicTrack' : 'generic',
              title: title,
              images: [
                {
                  url: poster,
                },
              ],
            },
          };

          client?.loadMedia({
            autoplay: true,
            startTime: startTime,
            mediaInfo: mediaInfo,
          });
        });
      } else {
        setClient(undefined);
        setMediaStatus(null);
      }
    });
    return () => subscription.remove();
  }, [player]);

  return {client, mediaStatus};
};

export default useChromecast;

import {useEffect, useState} from 'react';
import CastContext, {
  CastState,
  MediaHlsSegmentFormat,
  MediaHlsVideoSegmentFormat,
  MediaStatus,
  MediaStreamType,
  RemoteMediaClient,
} from 'react-native-google-cast';
import {THEOplayer} from 'react-native-theoplayer';
import {useVideo} from './context/useVideo';
import {MediaType} from './context/VideoContext';

type Props = {
  player?: THEOplayer;
  streamUri: string;
  isLiveStream: boolean;
  mediaType: MediaType;
  title?: string;
  poster: string;
};

const useChromecast = ({player, mediaType, isLiveStream, poster, streamUri, title}: Props) => {
  const {getCurrentTime} = useVideo();
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
          console.log('streamUri', streamUri);
          const client = session?.client;
          setClient(client);
          player.pause();
          client?.loadMedia({
            autoplay: true,
            startTime: getCurrentTime() / 1000,
            mediaInfo: {
              hlsSegmentFormat: isLiveStream ? MediaHlsSegmentFormat.TS : MediaHlsSegmentFormat.AAC,
              hlsVideoSegmentFormat: MediaHlsVideoSegmentFormat.MPEG2_TS,
              contentId: streamUri,
              contentUrl: streamUri,
              streamType: isLiveStream ? MediaStreamType.LIVE : MediaStreamType.BUFFERED,
              contentType: 'application/vnd.apple.mpegurl',
              metadata: {
                type: mediaType == MediaType.AUDIO ? 'musicTrack' : 'generic',
                title: title,
                images: [
                  {
                    url: poster,
                  },
                ],
              },
            },
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

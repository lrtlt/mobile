import {useCallback, useEffect, useRef} from 'react';
import {sendSearchUserEvent} from '../../api';

const useMediaUserEvents = (mediaId: string | undefined) => {
  const isPlayEventSent = useRef(false);
  const isCompleteEventSent = useRef(false);

  useEffect(() => {
    // Reset the flags when mediaId changes
    isPlayEventSent.current = false;
    isCompleteEventSent.current = false;
  }, [mediaId]);

  const sendMediaPlayEvent = useCallback(() => {
    if (mediaId && !isPlayEventSent.current) {
      sendSearchUserEvent({
        type: 'media-play',
        data: {
          documentId: mediaId,
          attributes: {
            source: 'mobile_app',
          },
        },
      });
      isPlayEventSent.current = true;
    }
  }, [mediaId]);

  const sendMediaCompleteEvent = useCallback(() => {
    if (mediaId && isPlayEventSent.current && !isCompleteEventSent.current) {
      sendSearchUserEvent({
        type: 'media-complete',
        data: {
          documentId: mediaId,
          attributes: {
            source: 'mobile_app',
          },
        },
      });
      isCompleteEventSent.current = true;
    }
  }, [mediaId]);

  useEffect(() => {
    return sendMediaCompleteEvent;
  }, [sendMediaCompleteEvent]);

  return {
    sendMediaPlayEvent,
  };
};

export default useMediaUserEvents;

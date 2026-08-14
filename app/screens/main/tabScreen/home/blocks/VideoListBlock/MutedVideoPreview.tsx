import {useCallback, useEffect, useRef, useState} from 'react';
import {AppState, AppStateStatus, Dimensions, StyleSheet, View} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {
  AspectRatio,
  PlayerConfiguration,
  PlayerEventType,
  THEOplayer,
  THEOplayerView,
} from 'react-native-theoplayer';
import Config from 'react-native-config';
import {isMediaArticle} from '../../../../../../api/Types';
import {useArticle} from '../../../../../../api/hooks/useArticle';
import {useStreamInfo} from '../../../../../../api/hooks/useStream';
import {useMediaPlayer} from '../../../../../../components/videoComponent/context/useMediaPlayer';
import usePlayerLoop from '../../../../../../components/videoComponent/usePlayerLoop';

const previewConfig: PlayerConfiguration = {
  license: Config.THEO_PLAYER_LICENCE,
  mediaControl: {
    mediaSessionEnabled: false,
  },
};

const useIsOnScreen = (enabled: boolean) => {
  const ref = useRef<View>(null);
  const [isOnScreen, setIsOnScreen] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setIsOnScreen(false);
      return;
    }

    let mounted = true;
    const check = () => {
      ref.current?.measureInWindow((x, y, width, height) => {
        if (!mounted) {
          return;
        }
        if (width <= 0 || height <= 0) {
          setIsOnScreen(false);
          return;
        }
        const {width: screenWidth, height: screenHeight} = Dimensions.get('window');
        setIsOnScreen(y < screenHeight && y + height > 0 && x < screenWidth && x + width > 0);
      });
    };

    const raf = requestAnimationFrame(check);
    const interval = setInterval(check, 400);
    return () => {
      mounted = false;
      cancelAnimationFrame(raf);
      clearInterval(interval);
    };
  }, [enabled]);

  return {ref, isOnScreen};
};

const useIsAppActive = () => {
  const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', setAppState);
    return () => subscription.remove();
  }, []);

  return appState === 'active';
};

const MutedVideoPreview: React.FC<{articleId: number}> = ({articleId}) => {
  const isFocused = useIsFocused();
  const isAppActive = useIsAppActive();
  const {mediaData} = useMediaPlayer();
  const canPlay = isFocused && isAppActive && !mediaData;
  const {ref, isOnScreen} = useIsOnScreen(canPlay);

  const {data} = useArticle(articleId, true);
  const article = data?.article;
  const streamUrl = isMediaArticle(article) ? article.get_playlist_url : undefined;
  const {data: stream} = useStreamInfo({
    streamUrl,
    title: article && isMediaArticle(article) ? article.title : undefined,
  });

  const streamUri = stream?.streamUri;
  const shouldMountPlayer = canPlay && isOnScreen && !!streamUri;

  const [player, setPlayer] = useState<THEOplayer>();

  usePlayerLoop({player, loop: true});

  const onPlayerReady = useCallback((instance: THEOplayer) => {
    instance.muted = true;
    instance.autoplay = true;
    instance.preload = 'auto';
    instance.aspectRatio = AspectRatio.ASPECT_FILL;
    instance.backgroundAudioConfiguration = {
      enabled: false,
      shouldResumeAfterInterruption: false,
      stopOnBackground: true,
    };
    instance.pipConfiguration = {
      startsAutomatically: false,
    };
    setPlayer(instance);
  }, []);

  useEffect(() => {
    if (!player || !streamUri) {
      return;
    }
    player.muted = true;
    player.source = {sources: [{src: streamUri}]};
  }, [player, streamUri]);

  useEffect(() => {
    if (!player) {
      return;
    }
    const keepMuted = () => {
      player.muted = true;
    };
    player.addEventListener(PlayerEventType.SOURCE_CHANGE, keepMuted);
    player.addEventListener(PlayerEventType.PLAY, keepMuted);
    return () => {
      player.removeEventListener(PlayerEventType.SOURCE_CHANGE, keepMuted);
      player.removeEventListener(PlayerEventType.PLAY, keepMuted);
    };
  }, [player]);

  useEffect(() => {
    if (!shouldMountPlayer) {
      setPlayer(undefined);
    }
  }, [shouldMountPlayer]);

  return (
    <View ref={ref} style={styles.container} pointerEvents="none">
      {shouldMountPlayer && (
        <THEOplayerView style={styles.player} config={previewConfig} onPlayerReady={onPlayerReady} />
      )}
    </View>
  );
};

export default MutedVideoPreview;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
  },
  player: {
    ...StyleSheet.absoluteFill,
  },
});

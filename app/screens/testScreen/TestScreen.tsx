import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Platform,
  ViewStyle,
  BackHandler,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {Text} from '../../components';
import {
  PlayerConfiguration,
  PresentationMode,
  SourceDescription,
  THEOplayer,
  THEOplayerView,
} from 'react-native-theoplayer';

export interface Props {}

const config: PlayerConfiguration = {
  license: undefined,
  chromeless: true,
  useMedia3: false,
};

const source: SourceDescription = {
  sources: [
    {
      src: 'https://cdn.theoplayer.com/video/dash/bbb_30fps/bbb_with_multiple_tiled_thumbnails.mpd',
      type: 'application/dash+xml',
    },
  ],
  poster: 'https://cdn.theoplayer.com/video/big_buck_bunny/poster.jpg',
  metadata: {
    title: 'Big Buck Bunny',
    subtitle: 'DASH - Thumbnails in manifest',
    album: 'React-Native THEOplayer demos',
    mediaUri: 'https://theoplayer.com',
    displayIconUri: 'https://cdn.theoplayer.com/video/big_buck_bunny/poster.jpg',
    artist: 'THEOplayer',
  },
};

const TestScreen: React.FC<React.PropsWithChildren<Props>> = (props) => {
  const [player, setPlayer] = useState<THEOplayer>();

  useEffect(() => {
    const handler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (player && player.presentationMode === PresentationMode.fullscreen) {
        player.presentationMode = PresentationMode.inline;
        return true;
      }
      return false;
    });
    return () => handler.remove();
  }, [player]);

  const onPlayerReady = (player: THEOplayer) => {
    setPlayer(player);
    player.source = source;
  };

  const fullScreenHandler = useCallback(() => {
    if (!player) return;

    if (player.presentationMode === PresentationMode.fullscreen) {
      console.log('inline');
      player.presentationMode = PresentationMode.inline;
    } else {
      console.log('fullscreen');
      player.presentationMode = PresentationMode.fullscreen;
    }
  }, [player]);

  const needsBorder = Platform.OS === 'ios';
  const PLAYER_CONTAINER_STYLE: ViewStyle = {
    position: 'absolute',
    top: needsBorder ? 0 : 0,
    left: needsBorder ? 2 : 0,
    bottom: 0,
    right: needsBorder ? 2 : 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
  };

  return (
    <SafeAreaView style={[StyleSheet.absoluteFill, {backgroundColor: 'white'}]}>
      <View style={PLAYER_CONTAINER_STYLE}>
        <THEOplayerView config={config} onPlayerReady={onPlayerReady}></THEOplayerView>
      </View>
      <TouchableOpacity
        style={{
          padding: 8,
          marginTop: 40,
          backgroundColor: 'yellow',
        }}
        onPress={fullScreenHandler}>
        <Text>Enter fullscreen</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default TestScreen;

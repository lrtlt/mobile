import {useCallback, useEffect, useState} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {MediaTrack, PlayerEventType, THEOplayer} from 'react-native-theoplayer';
import {IconLanguage} from '../svg';
import {HIT_SLOP, ICON_COLOR, ICON_SIZE} from './MediaControls';

type Options = {
  player?: THEOplayer;
};

const usePlayerLanguage = ({player}: Options) => {
  const [audioTracks, setAudioTracks] = useState<MediaTrack[]>([]);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    if (!!player) {
      player.addEventListener(PlayerEventType.MEDIA_TRACK_LIST, (_) => {
        setAudioTracks(player.audioTracks);
      });
    }
  }, [player]);

  const selectAudioTrack = useCallback(
    (track: MediaTrack) => {
      if (!!player) {
        player.selectedAudioTrack = track.uid;
      }
      setShowMenu(false);
    },
    [player],
  );

  const handleLanguageButtonPress = useCallback(() => {
    setShowMenu(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setShowMenu(false);
  }, []);

  const renderAudioTrackItem = useCallback(
    ({item}: {item: MediaTrack}) => {
      return (
        <TouchableOpacity
          key={item.uid}
          style={{...styles.center, backgroundColor: '#a8d2ff', padding: 12, margin: 4}}
          activeOpacity={0.9}
          onPress={() => selectAudioTrack(item)}>
          <Text>{item.language}</Text>
        </TouchableOpacity>
      );
    },
    [selectAudioTrack],
  );

  const renderBackButton = useCallback(() => {
    return (
      <TouchableOpacity
        key={'close'}
        style={{...styles.center, backgroundColor: '#F4F6F8', padding: 12, margin: 4}}
        activeOpacity={0.9}
        onPress={() => handleModalClose()}>
        <Text>Uždaryti</Text>
      </TouchableOpacity>
    );
  }, []);

  return {
    LanguageButton: (
      <LanguageButton key={'btn-language'} audioTracks={audioTracks} onPress={handleLanguageButtonPress} />
    ),
    LanguageMenu: showMenu ? (
      <View key={'menu-language'} style={{...styles.menuContainer, backgroundColor: '#222222'}}>
        {audioTracks.map((track) => renderAudioTrackItem({item: track}))}
        {renderBackButton()}
      </View>
    ) : null,
  };
};

export default usePlayerLanguage;

type Props = {
  audioTracks: MediaTrack[];
  onPress: () => void;
};

const LanguageButton: React.FC<React.PropsWithChildren<Props>> = ({audioTracks, onPress}: Props) => {
  if (audioTracks.length < 2) {
    return null;
  } else {
    return (
      <TouchableOpacity
        style={[styles.center]}
        onPress={() => onPress()}
        hitSlop={HIT_SLOP}
        activeOpacity={0.6}>
        <IconLanguage size={ICON_SIZE - 2} color={ICON_COLOR} />
      </TouchableOpacity>
    );
  }
};

const styles = StyleSheet.create({
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'stretch',
    padding: 64,
    ...StyleSheet.absoluteFillObject,
  },
});

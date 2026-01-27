import {useCallback, useEffect, useState} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {MediaTrack, PlayerEventType, THEOplayer} from 'react-native-theoplayer';
import {IconLanguage} from '../../../svg';
import {PlayerButton} from '../components/playerButton/PlayerButton';
import {HIT_SLOP, ICON_COLOR, ICON_SIZE} from '../MediaControls.constants';

type Options = {
  player?: THEOplayer;
};

export const getLanguageName = (language: string) => {
  switch (language.toLowerCase()) {
    case 'lt':
    case 'lit':
      return 'Lietuvių';
    case 'org':
      return 'Originalo';
    case 'ru':
    case 'rus':
      return 'Rusų';
    case 'en':
    case 'eng':
      return 'Anglų';
    case 'pl':
    case 'pol':
      return 'Lenkų';
    case 'uk':
      return 'Ukrainiečių';
    default:
      return language;
  }
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
        <PlayerButton
          key={item.uid}
          style={{...styles.center, ...styles.rounded, backgroundColor: '#FFFFFFEE', padding: 8}}
          activeOpacity={0.9}
          onPress={() => selectAudioTrack(item)}>
          <Text>{getLanguageName(item.language)}</Text>
        </PlayerButton>
      );
    },
    [selectAudioTrack],
  );

  const renderBackButton = useCallback(() => {
    return (
      <PlayerButton
        key={'close'}
        style={{...styles.center, ...styles.rounded, backgroundColor: '#FFFFFF99', padding: 8}}
        activeOpacity={0.9}
        onPress={() => handleModalClose()}>
        <Text>Uždaryti</Text>
      </PlayerButton>
    );
  }, []);

  return {
    LanguageButton: (
      <LanguageButton key={'btn-language'} audioTracks={audioTracks} onPress={handleLanguageButtonPress} />
    ),
    LanguageMenu: showMenu ? (
      <View key={'menu-language'} style={{...styles.menuContainer}}>
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
      <PlayerButton style={styles.center} onPress={onPress} hitSlop={HIT_SLOP} activeOpacity={0.6}>
        <IconLanguage size={ICON_SIZE - 2} color={ICON_COLOR} />
      </PlayerButton>
    );
  }
};

const styles = StyleSheet.create({
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  rounded: {
    borderRadius: 4,
  },
  menuContainer: {
    gap: 8,
    backgroundColor: '#222222CC',
    justifyContent: 'center',
    alignItems: 'stretch',
    padding: 32,
    ...StyleSheet.absoluteFill,
  },
});

import {useCallback, useEffect, useRef, useState} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {PlayerEventType, TextTrack, TextTrackKind, THEOplayer} from 'react-native-theoplayer';
import {ScrollView} from 'react-native-gesture-handler';
import {getAnalytics, logEvent} from '@react-native-firebase/analytics';
import {HIT_SLOP, ICON_COLOR, ICON_SIZE} from '../MediaControls.constants';
import {IconSubtitles} from '../../../svg';
import {getLanguageName} from './usePlayerLanguage';
import {PlayerButton} from '../components/playerButton/PlayerButton';
import {useSettingsStore} from '../../../../state/settings_store';
import {findPreferredTextTrack} from './subtitlePreference';

type Options = {
  player?: THEOplayer;
};

const usePlayerSubtitles = ({player}: Options) => {
  const [textTracks, setTextTracks] = useState<TextTrack[]>([]);
  const [showMenu, setShowMenu] = useState(false);

  const setSubtitlePreference = useSettingsStore((state) => state.setSubtitlePreference);

  // The Subtitle Preference is applied at most once per source. Closing the latch also
  // stops us from overriding a track the user picked themselves while more tracks are
  // still arriving.
  const preferenceApplied = useRef(false);

  useEffect(() => {
    if (!player) {
      return;
    }

    const applyPreference = () => {
      const tracks = player.textTracks.filter(
        (track) => track.kind === TextTrackKind.subtitles && !!track.language,
      );
      setTextTracks(tracks);

      if (preferenceApplied.current) {
        return;
      }

      // Read at apply-time rather than subscribing: the value is only needed here, and
      // a mid-stream change must not re-register the player listeners.
      const preferred = findPreferredTextTrack(tracks, useSettingsStore.getState().subtitlePreference);
      if (preferred) {
        player.selectedTextTrack = preferred.uid;
        preferenceApplied.current = true;
      } else {
        // No preference yet, subtitles explicitly off, or the preferred language is
        // missing from this source. In every case the stream's own `default: true`
        // track must not switch itself on - see docs/adr/0003-subtitle-preference.md.
        player.selectedTextTrack = undefined;
      }
    };

    const onSourceChange = () => {
      preferenceApplied.current = false;
      setTextTracks([]);
    };

    player.addEventListener(PlayerEventType.SOURCE_CHANGE, onSourceChange);
    player.addEventListener(PlayerEventType.TEXT_TRACK_LIST, applyPreference);
    // TEXT_TRACK_LIST fires once per track, so the first one can arrive well before the
    // full list is known. LOADED_METADATA gives a second, later pass without a timer.
    player.addEventListener(PlayerEventType.LOADED_METADATA, applyPreference);

    return () => {
      player.removeEventListener(PlayerEventType.SOURCE_CHANGE, onSourceChange);
      player.removeEventListener(PlayerEventType.TEXT_TRACK_LIST, applyPreference);
      player.removeEventListener(PlayerEventType.LOADED_METADATA, applyPreference);
    };
  }, [player]);

  const selectTextTrack = useCallback(
    (track: TextTrack) => {
      if (!!player) {
        player.selectedTextTrack = track.uid;
      }
      preferenceApplied.current = true;
      setSubtitlePreference({kind: 'language', language: track.language});
      setShowMenu(false);
    },
    [player, setSubtitlePreference],
  );

  const disableTextTrack = useCallback(() => {
    if (!!player) {
      player.selectedTextTrack = undefined;
    }
    preferenceApplied.current = true;
    setSubtitlePreference({kind: 'off'});
    setShowMenu(false);
  }, [player, setSubtitlePreference]);

  const handleSubtitlesButtonPress = useCallback(() => {
    setShowMenu(true);
  }, []);

  const renderTextTrackItem = useCallback(
    ({item}: {item: TextTrack}) => {
      return (
        <PlayerButton
          key={item.uid}
          style={{
            ...styles.center,
            ...styles.rounded,
            backgroundColor: '#FFFFFFEE',
            padding: 8,
            flexDirection: 'row',
          }}
          activeOpacity={0.9}
          onPress={() => {
            selectTextTrack(item);
            logEvent(getAnalytics(), 'lrt_lt_subtitles_selected', {
              language: item.language,
              source: 'app',
            });
          }}>
          <Text style={{flex: 1, textAlign: 'center'}}>{getLanguageName(item.language)}</Text>
        </PlayerButton>
      );
    },
    [selectTextTrack],
  );

  const renderBackButton = useCallback(() => {
    return (
      <PlayerButton
        key={'close'}
        style={{...styles.center, ...styles.rounded, backgroundColor: '#FFFFFF99', padding: 8}}
        activeOpacity={0.9}
        onPress={disableTextTrack}>
        <Text>Išjungti</Text>
      </PlayerButton>
    );
  }, [disableTextTrack]);

  return {
    SubtitlesButton: (
      <SubtitlesButton key={'btn-subtitles'} textTracks={textTracks} onPress={handleSubtitlesButtonPress} />
    ),
    SubtitlesMenu: showMenu ? (
      <View key={'menu-subtitles'} style={{...styles.menuContainer}}>
        <ScrollView style={{flex: 1}} contentContainerStyle={{gap: 8, flexGrow: 1, justifyContent: 'center'}}>
          <>
            {textTracks.map((track) => renderTextTrackItem({item: track}))}
            {renderBackButton()}
          </>
        </ScrollView>
      </View>
    ) : null,
  };
};

export default usePlayerSubtitles;

type Props = {
  textTracks: TextTrack[];
  onPress: () => void;
};

const SubtitlesButton: React.FC<React.PropsWithChildren<Props>> = ({textTracks, onPress}: Props) => {
  if (textTracks.length === 0) {
    return null;
  } else {
    return (
      <PlayerButton style={styles.center} onPress={onPress} hitSlop={HIT_SLOP} activeOpacity={0.6}>
        <IconSubtitles size={ICON_SIZE + 6} color={ICON_COLOR} />
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
    backgroundColor: '#222222CC',
    justifyContent: 'center',
    alignItems: 'stretch',
    padding: 32,
    ...StyleSheet.absoluteFill,
  },
});

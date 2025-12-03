import {useCallback, useEffect, useRef, useState} from 'react';
import {StyleSheet, View, Text, Platform} from 'react-native';
import {PlayerEventType, TextTrack, TextTrackKind, THEOplayer} from 'react-native-theoplayer';
import {IconSubtitles} from '../svg';
import {HIT_SLOP, ICON_COLOR, ICON_SIZE} from './MediaControls';
import TouchableDebounce from '../touchableDebounce/TouchableDebounce';
import {ScrollView} from 'react-native-gesture-handler';
import {getLanguageName} from './usePlayerLanguage';
import {getAnalytics, logEvent} from '@react-native-firebase/analytics';

type Options = {
  player?: THEOplayer;
};

const usePlayerSubtitles = ({player}: Options) => {
  const [textTracks, setTextTracks] = useState<TextTrack[]>([]);
  const [showMenu, setShowMenu] = useState(false);

  const initialSubtitleDisabled = useRef(false);

  useEffect(() => {
    if (!!player) {
      player.addEventListener(PlayerEventType.TEXT_TRACK_LIST, (_) => {
        setTextTracks(
          player.textTracks.filter((track) => track.kind === TextTrackKind.subtitles && !!track.language),
        );
        if (!initialSubtitleDisabled.current) {
          initialSubtitleDisabled.current = true;
          setTimeout(() => {
            player.selectedTextTrack = undefined;
          }, Platform.select({ios: 300}) || 0);
        }
      });
    }
  }, [player]);

  const selectTextTrack = useCallback(
    (track: TextTrack) => {
      if (!!player) {
        player.selectedTextTrack = track.uid;
      }
      setShowMenu(false);
    },
    [player],
  );

  const handleSubtitlesButtonPress = useCallback(() => {
    setShowMenu(true);
  }, []);

  const renderTextTrackItem = useCallback(
    ({item}: {item: TextTrack}) => {
      return (
        <TouchableDebounce
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
        </TouchableDebounce>
      );
    },
    [selectTextTrack],
  );

  const renderBackButton = useCallback(() => {
    return (
      <TouchableDebounce
        key={'close'}
        style={{...styles.center, ...styles.rounded, backgroundColor: '#FFFFFF99', padding: 8}}
        activeOpacity={0.9}
        onPress={() => {
          if (!!player) {
            player.selectedTextTrack = undefined;
          }
          setShowMenu(false);
        }}>
        <Text>Išjungti</Text>
      </TouchableDebounce>
    );
  }, [player]);

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
      <TouchableDebounce
        style={[styles.center]}
        onPress={() => onPress()}
        hitSlop={HIT_SLOP}
        activeOpacity={0.6}>
        <IconSubtitles size={ICON_SIZE + 6} color={ICON_COLOR} />
      </TouchableDebounce>
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

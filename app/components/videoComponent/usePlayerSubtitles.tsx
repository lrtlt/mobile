import {useCallback, useEffect, useRef, useState} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {PlayerEventType, TextTrack, TextTrackMode, THEOplayer} from 'react-native-theoplayer';
import {IconSubtitles} from '../svg';
import {HIT_SLOP, ICON_COLOR, ICON_SIZE} from './MediaControls';

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
        console.log('TEXT_TRACK_LIST', player.textTracks);
        setTextTracks(
          player.textTracks.filter(
            (track) => track.kind === 'subtitles' && track.mode != TextTrackMode.disabled,
          ),
        );
        if (!initialSubtitleDisabled.current && !player?.selectedTextTrack) {
          initialSubtitleDisabled.current = true;
          player.selectedTextTrack = undefined;
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
        <TouchableOpacity
          key={item.uid}
          style={{...styles.center, backgroundColor: '#a8d2ff', padding: 12, margin: 4}}
          activeOpacity={0.9}
          onPress={() => selectTextTrack(item)}>
          <Text>{item.label}</Text>
        </TouchableOpacity>
      );
    },
    [selectTextTrack],
  );

  const renderBackButton = useCallback(() => {
    return (
      <TouchableOpacity
        key={'close'}
        style={{...styles.center, backgroundColor: '#F4F6F8', padding: 12, margin: 4}}
        activeOpacity={0.9}
        onPress={() => {
          if (!!player) {
            player.selectedTextTrack = undefined;
          }
          setShowMenu(false);
        }}>
        <Text>Išjungti</Text>
      </TouchableOpacity>
    );
  }, [player]);

  return {
    SubtitlesButton: (
      <SubtitlesButton key={'btn-subtitles'} textTracks={textTracks} onPress={handleSubtitlesButtonPress} />
    ),
    SubtitlesMenu: showMenu ? (
      <View key={'menu-subtitles'} style={{...styles.menuContainer, backgroundColor: '#222222'}}>
        {textTracks.map((track) => renderTextTrackItem({item: track}))}
        {renderBackButton()}
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
      <TouchableOpacity
        style={[styles.center]}
        onPress={() => onPress()}
        hitSlop={HIT_SLOP}
        activeOpacity={0.6}>
        <IconSubtitles size={ICON_SIZE + 6} color={ICON_COLOR} />
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

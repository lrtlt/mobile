import {useCallback, useEffect, useState} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {
  MediaTrack,
  MediaTrackType,
  PlayerEventType,
  Quality,
  THEOplayer,
  VideoQuality,
} from 'react-native-theoplayer';
import {IconSettings2} from '../../../svg';
import {PlayerButton} from '../components/playerButton/PlayerButton';
import {HIT_SLOP, ICON_COLOR, ICON_SIZE} from '../MediaControls.constants';

type Options = {
  player?: THEOplayer;
};

const isVideoQuality = (quality: Quality): quality is VideoQuality =>
  typeof (quality as VideoQuality).height === 'number';

export const getQualityLabel = (quality: Quality) => {
  if (isVideoQuality(quality) && quality.height > 0) {
    return `${quality.height}p`;
  }
  return quality.label || quality.name || '';
};

const getActiveVideoTrack = (player: THEOplayer): MediaTrack | undefined =>
  player.videoTracks.find((track) => track.enabled) ?? player.videoTracks[0];

const usePlayerQuality = ({player}: Options) => {
  const [qualities, setQualities] = useState<Quality[]>([]);
  const [selectedUid, setSelectedUid] = useState<number | undefined>(undefined);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    if (!player) return;

    const syncQualities = () => {
      const track = getActiveVideoTrack(player);
      const sorted = [...(track?.qualities ?? [])].sort((a, b) => {
        const aHeight = isVideoQuality(a) ? a.height ?? 0 : 0;
        const bHeight = isVideoQuality(b) ? b.height ?? 0 : 0;
        return bHeight - aHeight;
      });
      setQualities(sorted);

      const targetQuality = player.targetVideoQuality;
      const nextSelectedUid = Array.isArray(targetQuality) ? targetQuality[0] : targetQuality ?? undefined;
      setSelectedUid(sorted.some((q) => q.uid === nextSelectedUid) ? nextSelectedUid : undefined);

      if (sorted.length < 2) {
        setShowMenu(false);
      }
    };

    const handleTrackEvent = (event: {trackType?: MediaTrackType}) => {
      if (event.trackType === MediaTrackType.VIDEO || event.trackType === undefined) {
        syncQualities();
      }
    };

    player.addEventListener(PlayerEventType.MEDIA_TRACK_LIST, handleTrackEvent);
    player.addEventListener(PlayerEventType.MEDIA_TRACK, handleTrackEvent);

    syncQualities();

    return () => {
      player.removeEventListener(PlayerEventType.MEDIA_TRACK_LIST, handleTrackEvent);
      player.removeEventListener(PlayerEventType.MEDIA_TRACK, handleTrackEvent);
    };
  }, [player]);

  const selectQuality = useCallback(
    (uid: number | undefined) => {
      if (!!player) {
        player.targetVideoQuality = uid;
      }
      setSelectedUid(uid);
      setShowMenu(false);
    },
    [player],
  );

  const handleQualityButtonPress = useCallback(() => {
    setShowMenu(true);
  }, []);

  const renderQualityItem = useCallback(
    ({item}: {item: Quality}) => {
      const isSelected = item.uid === selectedUid;
      return (
        <PlayerButton
          key={item.uid}
          style={{
            ...styles.center,
            ...styles.rounded,
            backgroundColor: isSelected ? '#FFFFFF' : '#FFFFFFEE',
            padding: 8,
          }}
          activeOpacity={0.9}
          onPress={() => selectQuality(item.uid)}>
          <Text style={isSelected ? styles.selectedText : undefined}>{getQualityLabel(item)}</Text>
        </PlayerButton>
      );
    },
    [selectQuality, selectedUid],
  );

  const renderAutoItem = useCallback(() => {
    const isSelected = selectedUid === undefined;
    return (
      <PlayerButton
        key={'auto'}
        style={{
          ...styles.center,
          ...styles.rounded,
          backgroundColor: isSelected ? '#FFFFFF' : '#FFFFFFEE',
          padding: 8,
        }}
        activeOpacity={0.9}
        onPress={() => selectQuality(undefined)}>
        <Text style={isSelected ? styles.selectedText : undefined}>Automatinė</Text>
      </PlayerButton>
    );
  }, [selectQuality, selectedUid]);

  const renderBackButton = useCallback(() => {
    return (
      <PlayerButton
        key={'close'}
        style={{...styles.center, ...styles.rounded, backgroundColor: '#FFFFFF99', padding: 8}}
        activeOpacity={0.9}
        onPress={() => setShowMenu(false)}>
        <Text>Uždaryti</Text>
      </PlayerButton>
    );
  }, []);

  return {
    QualityButton: (
      <QualityButton key={'btn-quality'} qualities={qualities} onPress={handleQualityButtonPress} />
    ),
    QualityMenu:
      showMenu && qualities.length > 1 ? (
        <View key={'menu-quality'} style={{...styles.menuContainer}}>
          {renderAutoItem()}
          {qualities.map((quality) => renderQualityItem({item: quality}))}
          {renderBackButton()}
        </View>
      ) : null,
  };
};

export default usePlayerQuality;

type Props = {
  qualities: Quality[];
  onPress: () => void;
};

const QualityButton: React.FC<React.PropsWithChildren<Props>> = ({qualities, onPress}: Props) => {
  if (qualities.length < 2) {
    return null;
  } else {
    return (
      <PlayerButton style={styles.center} onPress={onPress} hitSlop={HIT_SLOP} activeOpacity={0.6}>
        <IconSettings2 size={ICON_SIZE} color={ICON_COLOR} />
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
  selectedText: {
    fontWeight: '700',
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

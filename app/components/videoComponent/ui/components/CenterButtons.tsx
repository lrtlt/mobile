import React, {memo, useCallback, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {IconPlayerForward, IconPlayerRewind} from '../../../svg';
import {ICON_COLOR, ICON_SIZE, HIT_SLOP} from '../MediaControls.constants';
import {usePlayer} from '../../context/player/usePlayer';
import PlayPauseButton from './PlayPauseButton';
import {PlayerButton} from './playerButton/PlayerButton';

interface Props {}

const CenterButtons: React.FC<Props> = () => {
  const {
    state: {isSeekerEnabled},
    actions: {seekBy},
  } = usePlayer();

  const handleSeekBack = useCallback(() => {
    seekBy(-10);
  }, [seekBy]);

  const handleSeekForward = useCallback(() => {
    seekBy(10);
  }, [seekBy]);

  const iconSize = useMemo(() => ICON_SIZE + 12, []);

  return (
    <View style={styles.centerControlsRow}>
      {isSeekerEnabled && (
        <PlayerButton onPress={handleSeekBack} hitSlop={HIT_SLOP} activeOpacity={0.6}>
          <IconPlayerRewind style={styles.rewindIcon} size={iconSize} color={ICON_COLOR} />
        </PlayerButton>
      )}
      <PlayPauseButton />
      {isSeekerEnabled && (
        <PlayerButton onPress={handleSeekForward} hitSlop={HIT_SLOP} activeOpacity={0.6}>
          <IconPlayerForward style={styles.forwardIcon} size={iconSize} color={ICON_COLOR} />
        </PlayerButton>
      )}
    </View>
  );
};

export default memo(CenterButtons);

const styles = StyleSheet.create({
  centerControlsRow: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  rewindIcon: {
    marginRight: 32,
  },
  forwardIcon: {
    marginLeft: 32,
  },
});

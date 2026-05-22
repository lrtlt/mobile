import React, {memo, useEffect, useMemo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {PlayerEventType} from 'react-native-theoplayer';
import TextComponent from '../../../text/Text';
import {ICON_COLOR} from '../MediaControls.constants';
import {usePlayer} from '../../context/player/usePlayer';
import LiveButton from './LiveButton';

const formatTimeElapsed = (currentTime: number, duration: number) => {
  const time = Math.floor(Math.min(Math.max(currentTime, 0), duration));
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  const result = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  return result;
};

const formatTimeTotal = (duration: number) => {
  const time = Math.max(duration, 0);
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  const result = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  return result;
};

const formatLiveStreamTime = (time: number, minTime: number, maxTime: number) => {
  const currentTime = Math.max(0, maxTime - time);
  const minutes = Math.floor(currentTime / 60);
  const seconds = Math.floor(currentTime % 60);
  const result = `-${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  return result;
};

const formatTimeForA11y = (totalSeconds: number) => {
  const time = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${minutes} min. ${seconds} sek.`;
};

const Timer: React.FC = () => {
  const {
    player,
    state: {seekerStart, seekerEnd, isLiveStream, isSeekerEnabled},
  } = usePlayer();
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    if (!player) return;

    const handleTimeUpdate = () => {
      setCurrentTime(player.currentTime / 1000);
    };

    player.addEventListener(PlayerEventType.TIME_UPDATE, handleTimeUpdate);
    setCurrentTime(player.currentTime / 1000);

    return () => {
      player.removeEventListener(PlayerEventType.TIME_UPDATE, handleTimeUpdate);
    };
  }, [player]);

  const elapsedTimeText = useMemo(
    () => formatTimeElapsed(currentTime ?? 0, seekerEnd),
    [currentTime, seekerEnd],
  );
  const totalTimeText = useMemo(() => formatTimeTotal(seekerEnd ?? 0), [seekerEnd]);
  const liveStreamTimeText = useMemo(
    () => formatLiveStreamTime(currentTime ?? seekerStart, seekerStart, seekerEnd),
    [currentTime, seekerStart, seekerEnd],
  );

  const elapsedTimeA11yLabel = useMemo(
    () => `Praleista ${formatTimeForA11y(currentTime ?? 0)}`,
    [currentTime],
  );
  const totalTimeA11yLabel = useMemo(
    () => `Trukmė ${formatTimeForA11y(seekerEnd ?? 0)}`,
    [seekerEnd],
  );
  const liveStreamA11yLabel = useMemo(
    () => `Atsilikimas nuo tiesioginės transliacijos ${formatTimeForA11y(Math.max(0, seekerEnd - (currentTime ?? seekerStart)))}`,
    [currentTime, seekerStart, seekerEnd],
  );

  return (
    <View style={styles.progressContainer}>
      {!isLiveStream ? (
        <>
          <TextComponent
            style={styles.timerText}
            allowFontScaling={false}
            fontFamily="SourceSansPro-SemiBold"
            accessibilityLabel={elapsedTimeA11yLabel}>
            {elapsedTimeText}
          </TextComponent>
          {isSeekerEnabled ? (
            <TextComponent
              style={styles.timerText}
              allowFontScaling={false}
              fontFamily="SourceSansPro-SemiBold"
              accessibilityLabel={totalTimeA11yLabel}>
              {totalTimeText}
            </TextComponent>
          ) : null}
        </>
      ) : (
        <>
          <LiveButton />
          <TextComponent
            style={styles.timerText}
            allowFontScaling={false}
            fontFamily="SourceSansPro-SemiBold"
            accessibilityLabel={liveStreamA11yLabel}>
            {liveStreamTimeText}
          </TextComponent>
        </>
      )}
    </View>
  );
};

export default memo(Timer);

const styles = StyleSheet.create({
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 8,
  },
  timerText: {
    flexGrow: 0,
    fontSize: 13,
    color: ICON_COLOR,
    letterSpacing: 0.8,
  },
});

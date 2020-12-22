import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from '../../Theme';
import {CameraIcon} from '../svg';
import TextComponent from '../text/Text';

const ProgramItem = (props) => {
  const {colors} = useTheme();

  const proc = Math.max(0, Math.min(Number(props.percent), 100));
  const hasEnded = proc === 100;

  const icon =
    proc < 100 && proc > 0 ? (
      <View style={styles.cameraIconContainer}>
        <CameraIcon size={20} />
      </View>
    ) : null;

  const titleStyle = hasEnded ? styles.titleText : styles.titleTextUpcoming;

  return (
    <View style={[styles.container, props.style, {backgroundColor: colors.programItem}]}>
      <View
        style={{...styles.elapsedIndicator, width: proc + '%', backgroundColor: colors.programProgress}}
      />
      <TextComponent style={styles.timeText} type="secondary">
        {props.startTime}
      </TextComponent>
      {icon}
      {proc === 0 ? (
        <TextComponent style={titleStyle} type="secondary">
          {props.title}
        </TextComponent>
      ) : (
        <TextComponent style={titleStyle}>{props.title}</TextComponent>
      )}
    </View>
  );
};

export default ProgramItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 58,
    width: '100%',
    alignItems: 'center',
  },
  cameraIconContainer: {
    paddingEnd: 8,
  },
  elapsedIndicator: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    start: 0,
  },
  timeText: {
    paddingEnd: 8,
    paddingStart: 8,
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 13,
  },
  titleTextUpcoming: {
    flex: 1,
    padding: 6,
    paddingStart: 0,
    fontFamily: 'SourceSansPro-SemiBold',
    fontSize: 15,
  },
  titleText: {
    flex: 1,
    padding: 6,
    paddingStart: 0,
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 15,
  },
});

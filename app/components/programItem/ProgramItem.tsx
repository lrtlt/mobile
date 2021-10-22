import React from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import {useTheme} from '../../Theme';
import {CameraIcon} from '../svg';
import TextComponent from '../text/Text';

export const PROGRAM_ITEM_HEIGHT = 64;

interface Props {
  style?: ViewStyle;
  title: string;
  description?: string;
  startTime: string;
  percent: string;
}

const ProgramItem: React.FC<Props> = (props) => {
  const {colors} = useTheme();

  const proc = Math.max(0, Math.min(Number(props.percent), 100));
  const hasEnded = proc === 100;

  const icon = proc < 100 && proc > 0 && (
    <View style={styles.cameraIconContainer}>
      <CameraIcon size={20} />
    </View>
  );

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
      <View style={styles.textContainer}>
        <TextComponent style={titleStyle} type={proc === 0 ? 'secondary' : 'primary'}>
          {props.title}
        </TextComponent>

        {props.description ? (
          <TextComponent style={styles.descriptionText} type="secondary">
            {props.description}
          </TextComponent>
        ) : null}
      </View>
    </View>
  );
};

export default ProgramItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    minHeight: PROGRAM_ITEM_HEIGHT,
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
    paddingStart: 0,
    fontFamily: 'SourceSansPro-SemiBold',
    fontSize: 15,
  },
  titleText: {
    paddingStart: 0,
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 15,
  },
  descriptionText: {
    paddingStart: 0,
    marginTop: 2,
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 13,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 6,
  },
});

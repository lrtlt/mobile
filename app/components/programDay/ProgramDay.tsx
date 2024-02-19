import React from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import moment from 'moment';
import TextComponent from '../text/Text';
import {useTheme} from '../../Theme';

const weekDays = [
  'Sekmadienis',
  'Pirmadienis',
  'Antradienis',
  'Trečiadienis',
  'Ketvirtadienis',
  'Penktadienis',
  'Šeštadienis',
];

interface Props {
  style?: ViewStyle;
  dateString: string;
}

const ProgramDay: React.FC<React.PropsWithChildren<Props>> = (props) => {
  const {strings} = useTheme();

  const date = moment(props.dateString, 'YYYY-MM-DD');

  const dayOfWeek = date.day();
  const dayName = dayOfWeek === moment().day() ? strings.today : weekDays[dayOfWeek];

  return (
    <View {...props}>
      <TextComponent style={styles.text}>
        {props.dateString} -{' '}
        <TextComponent style={styles.text} fontFamily="SourceSansPro-SemiBold">
          {dayName}
        </TextComponent>
      </TextComponent>
    </View>
  );
};

export default ProgramDay;

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
  },
});

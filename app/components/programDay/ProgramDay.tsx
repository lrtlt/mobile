import React from 'react';
import {View, StyleSheet, TextStyle, ViewStyle} from 'react-native';
import moment from 'moment';
import TextComponent from '../text/Text';
import {useTheme} from '../../Theme';

type WeekDays =
  | 'Sekmadienis'
  | 'Pirmadienis'
  | 'Antradienis'
  | 'Trečiadienis'
  | 'Ketvirtadienis'
  | 'Penktadienis'
  | 'Šeštadienis';

const weekDays: WeekDays[] = [
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
  textStyle?: TextStyle;
}

const ProgramDay: React.FC<Props> = (props) => {
  const {strings} = useTheme();

  const date = moment(props.dateString, 'YYYY-MM-DD');
  const dateString = props.dateString.slice(-5);

  const dayOfWeek = date.day();
  const dayName = dayOfWeek === moment().day() ? strings.today : weekDays[dayOfWeek];

  const textStyle = props.textStyle ? props.textStyle : styles.text;

  return (
    <View {...props}>
      <TextComponent style={textStyle}>
        {dateString} - {dayName}
      </TextComponent>
    </View>
  );
};

export default ProgramDay;

const styles = StyleSheet.create({
  text: {
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 15,
  },
});

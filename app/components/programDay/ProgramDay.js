import React from 'react';
import {View, Text} from 'react-native';
import Styles from './styles';
import moment from 'moment';

const weekDays = [
  'Sekmadienis',
  'Pirmadienis',
  'Antradienis',
  'Trečiadienis',
  'Ketvirtadienis',
  'Penktadienis',
  'Šeštadienis',
];

const today = 'Šiandien';

const programDay = (props) => {
  const date = moment(props.dateString, 'YYYY-MM-DD');
  const dateString = props.dateString.slice(-5);

  const dayOfWeek = date.day();
  const dayName = dayOfWeek === moment().day() ? today : weekDays[dayOfWeek];

  const textStyle = props.textStyle ? props.textStyle : dayName === today ? Styles.todayText : Styles.text;

  return (
    <View {...props}>
      <Text style={textStyle}>
        {dateString} - {dayName}
      </Text>
    </View>
  );
};

export default React.memo(programDay);

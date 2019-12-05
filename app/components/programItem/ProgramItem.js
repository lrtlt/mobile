import React from 'react';
import { View, Text } from 'react-native';
import Style from './styles';

const programItem = props => {
  const proc = Math.max(0, Math.min(Number(props.percent), 100));

  return (
    <View style={[Style.container, props.style]}>
      <View style={{ ...Style.elapsedIndicator, width: proc + '%' }} />
      <Text style={Style.timeText}>{props.startTime}</Text>
      <Text style={Style.titleText}>{props.title}</Text>
    </View>
  );
};

export default programItem;

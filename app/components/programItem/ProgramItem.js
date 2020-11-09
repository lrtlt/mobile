import React from 'react';
import {View, Text} from 'react-native';
import Style from './styles';
import {CameraIcon} from '../svg';

const programItem = (props) => {
  const proc = Math.max(0, Math.min(Number(props.percent), 100));

  const titleStyle = proc === 0 ? Style.titleTextUpcoming : Style.titleText;
  const icon =
    proc < 100 && proc > 0 ? (
      <View style={{paddingEnd: 8}}>
        <CameraIcon size={20} />
      </View>
    ) : null;

  return (
    <View style={[Style.container, props.style]}>
      <View style={{...Style.elapsedIndicator, width: proc + '%'}} />
      <Text style={Style.timeText}>{props.startTime}</Text>
      {icon}
      <Text style={titleStyle}>{props.title}</Text>
    </View>
  );
};

export default programItem;

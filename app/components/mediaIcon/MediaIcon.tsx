import React from 'react';
import {ViewStyle} from 'react-native';
import {getColorsForChannelById} from '../../util/UI';
import {MicIcon, CameraIcon} from '../svg/index';

interface Props {
  style?: ViewStyle;
  size: number;
  is_video?: 0 | 1;
  is_audio?: 0 | 1;
  channel_id?: number;
}

const MediaIcon: React.FC<Props> = ({style, size, is_video, is_audio, channel_id}) => {
  const Icon = is_audio === 1 ? MicIcon : is_video === 1 ? CameraIcon : null;
  if (Icon) {
    const colors = getColorsForChannelById(channel_id);
    return <Icon style={style} size={size} colorBase={colors.secondary} colorAccent={colors.primary} />;
  } else {
    return null;
  }
};

export default React.memo(MediaIcon);

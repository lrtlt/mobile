import React from 'react';
import {Dimensions} from 'react-native';
import {Logo} from '../components';

import {
  ChannelLRadioIcon,
  ChannelLRTPliusIcon,
  ChannelClassicIcon,
  ChannelLRTHDIcon,
  ChannelLRTWorldIcon,
  ChannelOpusIcon,
  IconWeatherCloud,
  IconWeatherCloudy,
  IconWeatherDayCloudy,
  IconWeatherDaySunny,
  IconWeatherFog,
  IconWeatherRain,
  IconWeatherRainMix,
  IconWeatherShowers,
  IconWeatherSnow,
  IconWeatherSnowWind,
  IconWeatherSprinkle,
  LogoLight,
} from '../components/svg';

import {channelColors} from '../Theme';

export type IconSize = {
  width?: number;
  height?: number;
};

export const ORIENTATION_PORTRAIT = 'portrait';
export const ORIENTATION_LANDSCAPE = 'landscape';

export const getSmallestDim = () => {
  const dim = Dimensions.get('screen');
  return Math.min(dim.width, dim.height);
};

export const getColorsForChannel = (channel: string) => {
  switch (channel) {
    case 'LTV1': {
      return channelColors.color_set_lrtHD;
    }
    case 'LTV2': {
      return channelColors.color_set_lrtPlius;
    }
    case 'WORLD': {
      return channelColors.color_set_lrt_world;
    }
    case 'LR': {
      return channelColors.color_set_l_radio;
    }
    case 'Klasika': {
      return channelColors.color_set_classic;
    }
    case 'Opus': {
      return channelColors.color_set_opus;
    }
    default: {
      return channelColors.color_set_lrtHD;
    }
  }
};

export const getColorsForChannelById = (channel_id?: number) => {
  switch (channel_id) {
    case 1: {
      return channelColors.color_set_lrtHD;
    }
    case 2: {
      return channelColors.color_set_lrtPlius;
    }
    case 3: {
      return channelColors.color_set_lrt_world;
    }
    case 4: {
      return channelColors.color_set_l_radio;
    }
    case 5: {
      return channelColors.color_set_classic;
    }
    case 6: {
      return channelColors.color_set_opus;
    }
    default: {
      return channelColors.color_set_lrtHD;
    }
  }
};

export const getIconForChannel = (channel: string, size?: IconSize) => {
  switch (channel.toLowerCase()) {
    case 'ltv1': {
      return <ChannelLRTHDIcon {...size} />;
    }
    case 'ltv2': {
      return <ChannelLRTPliusIcon {...size} />;
    }
    case 'world': {
      return <ChannelLRTWorldIcon {...size} />;
    }
    case 'lr': {
      return <ChannelLRadioIcon {...size} />;
    }
    case 'klasika': {
      return <ChannelClassicIcon {...size} />;
    }
    case 'opus': {
      return <ChannelOpusIcon {...size} />;
    }
    default: {
      return <LogoLight {...size} />;
    }
  }
};

export const getIconForChannelById = (channelId: number, size?: IconSize) => {
  switch (channelId) {
    case 1:
      return getIconForChannel('LTV1', size);
    case 2:
      return getIconForChannel('LTV2', size);
    case 3:
      return getIconForChannel('WORLD', size);
    case 4:
      return getIconForChannel('LR', size);
    case 5:
      return getIconForChannel('Klasika', size);
    case 6:
      return getIconForChannel('Opus', size);
    default:
      return <Logo {...size} useOnlyInternal />;
  }
};

export const getIconForWeatherConditions = (conditions: string | undefined, size: number, color: string) => {
  switch (conditions) {
    case 'isolated-clouds':
      return <IconWeatherCloud size={size} color={color} />;
    case 'overcast':
      return <IconWeatherCloudy size={size} color={color} />;
    case 'scattered-clouds':
      return <IconWeatherDayCloudy size={size} color={color} />;
    case 'clear':
      return <IconWeatherDaySunny size={size} color={color} />;
    case 'fog':
      return <IconWeatherFog size={size} color={color} />;
    case 'heavy-rain':
      return <IconWeatherRain size={size} color={color} />;
    case 'sleet':
      return <IconWeatherRainMix size={size} color={color} />;
    case 'moderate-rain':
      return <IconWeatherShowers size={size} color={color} />;
    case 'light-snow':
    case 'moderate-snow':
      return <IconWeatherSnow size={size} color={color} />;
    case 'heavy-snow':
      return <IconWeatherSnowWind size={size} color={color} />;
    case 'light-rain':
      return <IconWeatherSprinkle size={size} color={color} />;
    default:
      return null;
  }
};

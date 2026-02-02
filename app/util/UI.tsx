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
  LRTLogo,
  Channel100Icon,
} from '../components/svg';

import {ChannelColor, channelColors} from '../Theme';
import {Color} from 'react-native-unistyles/lib/typescript/src/types';

export type IconSize = {
  width?: number;
  height?: number;
};

export const getSmallestDim = () => {
  const dim = Dimensions.get('screen');
  return Math.min(dim.width, dim.height);
};

export const getColorsForChannel = (channel: string, fallback?: ChannelColor) => {
  switch (channel.toLocaleLowerCase()) {
    case 'ltv1': {
      return channelColors.color_set_lrtHD;
    }
    case 'ltv2': {
      return channelColors.color_set_lrtPlius;
    }
    case 'world': {
      return channelColors.color_set_lrt_world;
    }
    case 'lr': {
      return channelColors.color_set_l_radio;
    }
    case 'klasika': {
      return channelColors.color_set_classic;
    }
    case 'opus': {
      return channelColors.color_set_opus;
    }
    case 'lrt100': {
      return channelColors.color_set_100;
    }
    default: {
      return fallback || channelColors.color_set_default;
    }
  }
};

export const getColorsForChannelById = (channel_id?: number, fallback?: ChannelColor) => {
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
    case 37: {
      return channelColors.color_set_100;
    }
    default: {
      return fallback || channelColors.color_set_default;
    }
  }
};

export const getIconForChannel = (channel: string, size?: IconSize, color?: Color) => {
  switch (channel.toLowerCase()) {
    case 'ltv1': {
      return <ChannelLRTHDIcon {...size} color={color} />;
    }
    case 'ltv2': {
      return <ChannelLRTPliusIcon {...size} color={color} />;
    }
    case 'world': {
      return <ChannelLRTWorldIcon {...size} color={color} />;
    }
    case 'lr': {
      return <ChannelLRadioIcon {...size} color={color} />;
    }
    case 'klasika': {
      return <ChannelClassicIcon {...size} color={color} />;
    }
    case 'opus': {
      return <ChannelOpusIcon {...size} color={color} />;
    }
    case 'lrt100': {
      return <Channel100Icon {...size} color={color} />;
    }

    default: {
      return <LRTLogo {...size} color={color} />;
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
    case 37:
      return getIconForChannel('LRT100', size);
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

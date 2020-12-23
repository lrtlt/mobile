import React from 'react';
import {Dimensions, Platform} from 'react-native';

import {
  ChannelLRadioIcon,
  ChannelLRTPliusIcon,
  ChannelClassicIcon,
  ChannelLRTHDIcon,
  ChannelLRTWorldIcon,
  ChannelOpusIcon,
  LogoLight,
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
} from '../components/svg';

import {channelColors} from '../Theme';

const DEFAULT_CHANNEL_ICON_SIZE = 25;

export const ORIENTATION_PORTRAIT = 'portrait';
export const ORIENTATION_LANDSCAPE = 'landscape';

export const isPortrait = () => {
  return Dimensions.get('window').height > Dimensions.get('window').width;
};

export const getOrientation = () => {
  return isPortrait() === true ? ORIENTATION_PORTRAIT : ORIENTATION_LANDSCAPE;
};

export const getSmallestDim = () => {
  const dim = Dimensions.get('window');
  return Math.min(dim.width, dim.height);
};

/**
 * Taken from react-navigation/stack
 * https://github.com/react-navigation/stack/blob/master/src/views/Header/HeaderSegment.tsx
 */
export const getDefaultHeaderHeight = () => {
  const isLandscape = isPortrait() === false;

  let headerHeight;

  if (Platform.OS === 'ios') {
    if (isLandscape && !Platform.isPad) {
      headerHeight = 32;
    } else {
      headerHeight = 44;
    }
  } else if (Platform.OS === 'android') {
    headerHeight = 56;
  } else {
    headerHeight = 64;
  }

  return headerHeight;
};

export const getColorsForChannel = (channel) => {
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

export const getIconForChannel = (channel, size = DEFAULT_CHANNEL_ICON_SIZE) => {
  switch (channel.toLowerCase()) {
    case 'ltv1': {
      return <ChannelLRTHDIcon size={size} />;
    }
    case 'ltv2': {
      return <ChannelLRTPliusIcon size={size} />;
    }
    case 'world': {
      return <ChannelLRTWorldIcon size={size} />;
    }
    case 'lr': {
      return <ChannelLRadioIcon size={size} />;
    }
    case 'klasika': {
      return <ChannelClassicIcon size={size} />;
    }
    case 'opus': {
      return <ChannelOpusIcon size={size} />;
    }
    default: {
      return <LogoLight size={size} />;
    }
  }
};

export const getIconForChannelById = (channelId, size = DEFAULT_CHANNEL_ICON_SIZE) => {
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
      return <LogoLight size={size} />;
  }
};

export const getIconForWeatherConditions = (conditions, size, color) => {
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

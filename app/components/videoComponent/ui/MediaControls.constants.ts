import {Insets} from 'react-native';

export const CONTROLS_TIMEOUT_MS = 2500;
export const GRADIENT_COLORS = ['#000000FF', '#00000088', '#00000066', '#22222233'];

export const ICON_COLOR = '#FFFFFFDD';
export const ICON_SIZE = 22;

/**
 * Hit slop size for controls
 */
const HIT_SLOP_SIZE = 4;

export const HIT_SLOP: Insets = {
  top: HIT_SLOP_SIZE,
  bottom: HIT_SLOP_SIZE,
  left: HIT_SLOP_SIZE,
  right: HIT_SLOP_SIZE,
};

export const HIT_SLOP_BIG: Insets = {
  top: HIT_SLOP_SIZE * 4,
  bottom: HIT_SLOP_SIZE * 4,
  left: HIT_SLOP_SIZE * 4,
  right: HIT_SLOP_SIZE * 4,
};

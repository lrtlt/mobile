import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

const SvgComponent = (props) => (
  <Svg viewBox="0 0 512 512" width={props.size} height={props.size} {...props}>
    <Path
      fill={props.color}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={32}
      d="m400 160 64 64-64 64"
    />
    <Path
      d="M448 224H154c-58.76 0-106 49.33-106 108v20"
      fill={props.color}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={32}
    />
  </Svg>
);

export default SvgComponent;

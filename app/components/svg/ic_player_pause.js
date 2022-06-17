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
      d="M176 96h16v320h-16zm144 0h16v320h-16z"
    />
  </Svg>
);

export default SvgComponent;

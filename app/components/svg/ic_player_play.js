import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

const SvgComponent = (props) => (
  <Svg viewBox="-20 0 512 512" width={props.size} height={props.size} {...props}>
    <Path
      d="M112 111v290c0 17.44 17 28.52 31 20.16l247.9-148.37c12.12-7.25 12.12-26.33 0-33.58L143 90.84c-14-8.36-31 2.72-31 20.16z"
      fill={props.color}
      stroke="currentColor"
      strokeMiterlimit={10}
      strokeWidth={32}
    />
  </Svg>
);

export default SvgComponent;

import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

const SvgComponent = (props) => (
  <Svg width={props.size} height={props.size} viewBox="0 0 256 256" {...props}>
    <Path
      d="m181.66 133.66-80 80a8 8 0 0 1-11.32-11.32L164.69 128 90.34 53.66a8 8 0 0 1 11.32-11.32l80 80a8 8 0 0 1 0 11.32Z"
      fill={props.color}
    />
  </Svg>
);
export default SvgComponent;

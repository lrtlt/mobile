import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function SvgComponent(props) {
  return (
    <Svg fill="currentColor" viewBox="0 0 256 256" width={props.size} height={props.size} {...props}>
      <Path
        fill={props.color}
        d="M240 128a15.74 15.74 0 01-7.6 13.51L88.32 229.65a16 16 0 01-16.2.3A15.86 15.86 0 0164 216.13V39.87a15.86 15.86 0 018.12-13.82 16 16 0 0116.2.3l144.08 88.14A15.74 15.74 0 01240 128z"
      />
    </Svg>
  );
}

export default SvgComponent;

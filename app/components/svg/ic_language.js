import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

const SvgComponent = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.size}
    height={props.size}
    viewBox="0 0 512 512"
    {...props}>
    <Path
      fill={props.color}
      d="M256 80C149.9 80 62.4 159.4 49.6 262c9.4-3.8 19.6-6 30.4-6 26.5 0 48 21.5 48 48v128c0 26.5-21.5 48-48 48-44.2 0-80-35.8-80-80V288C0 146.6 114.6 32 256 32s256 114.6 256 256v112c0 44.2-35.8 80-80 80-26.5 0-48-21.5-48-48V304c0-26.5 21.5-48 48-48 10.8 0 21 2.1 30.4 6C449.6 159.4 362.1 80 256 80z"
    />
  </Svg>
);
export default SvgComponent;

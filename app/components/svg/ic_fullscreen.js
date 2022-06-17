import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

const SvgComponent = (props) => (
  <Svg width={props.size} height={props.size} viewBox="0 0 96 96" {...props}>
    <Path
      fill={props.color}
      d="M30 0H6a5.997 5.997 0 0 0-6 6v24a6 6 0 0 0 12 0V12h18a6 6 0 0 0 0-12ZM90 0H66a6 6 0 0 0 0 12h18v18a6 6 0 0 0 12 0V6a5.997 5.997 0 0 0-6-6ZM30 84H12V66a6 6 0 0 0-12 0v24a5.997 5.997 0 0 0 6 6h24a6 6 0 0 0 0-12ZM90 60a5.997 5.997 0 0 0-6 6v18H66a6 6 0 0 0 0 12h24a5.997 5.997 0 0 0 6-6V66a5.997 5.997 0 0 0-6-6Z"
    />
  </Svg>
);

export default SvgComponent;

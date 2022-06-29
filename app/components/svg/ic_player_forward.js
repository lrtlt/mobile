import * as React from 'react';
import Svg, {Path, Rect} from 'react-native-svg';

const SvgComponent = (props) => (
  <Svg
    strokeWidth={3}
    stroke={props.color}
    fill="none"
    width={props.size}
    height={props.size}
    viewBox="0 0 64 64"
    {...props}>
    <Path d="M23.93 41.41V23a.09.09 0 0 0-.16-.07s-2.58 3.69-4.17 4.78" strokeLinecap="round" />
    <Rect x={29.19} y={22.52} width={11.41} height={18.89} rx={5.7} />
    <Path strokeLinecap="round" d="m54.43 15.41-2.6 8.64-8.64-2.61m8.67 2.5a21.91 21.91 0 1 0 .91 13.25" />
  </Svg>
);

export default SvgComponent;

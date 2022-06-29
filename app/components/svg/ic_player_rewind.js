import * as React from 'react';
import Svg, {Path, Rect} from 'react-native-svg';

const SvgComponent = (props) => (
  <Svg
    viewBox="0 0 64 64"
    strokeWidth={3}
    stroke={props.color}
    fill="none"
    width={props.size}
    height={props.size}
    {...props}>
    <Path
      strokeLinecap="round"
      d="m9.57 15.41 2.6 8.64 8.64-2.61m6.12 19.97V23a.09.09 0 0 0-.16-.07s-2.58 3.69-4.17 4.78"
    />
    <Rect x={32.19} y={22.52} width={11.41} height={18.89} rx={5.7} />
    <Path d="M12.14 23.94a21.91 21.91 0 1 1-.91 13.25" strokeLinecap="round" />
  </Svg>
);

export default SvgComponent;

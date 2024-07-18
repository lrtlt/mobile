import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

const SvgComponent = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={props.size ?? 24}
    height={props.size ?? 24}
    fill={props.color ?? '#FFF'}
    {...props}>
    <Path d="M20 4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h16m0 14V6H4v12h16M6 10h2v2H6v-2m0 4h8v2H6v-2m10 0h2v2h-2v-2m-6-4h8v2h-8v-2Z" />
  </Svg>
);
export default SvgComponent;

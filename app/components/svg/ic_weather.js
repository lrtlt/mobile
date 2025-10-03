import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function SvgComponent(props) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.size}
      height={props.size}
      viewBox="0 0 16 16"
      fill="none"
      {...props}>
      <Path
        d="M5.479 3.546l-.26-1.478M3.543 4.779l-1.229-.86M3.046 7.02l-1.478.26M7.72 4.043l.86-1.229M6 9a4.254 4.254 0 114.25 4.5h-5a2.75 2.75 0 11.888-5.354M3.728 8.46A3 3 0 118.74 5.275"
        stroke={props.color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default SvgComponent;

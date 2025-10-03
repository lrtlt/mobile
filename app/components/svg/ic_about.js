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
        d="M13.5 13.5V7.219a.519.519 0 00-.162-.37l-5-4.543a.5.5 0 00-.675 0l-5 4.544a.519.519 0 00-.163.369v6.28M1 13.5h14"
        stroke={props.color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9.5 13.5V10a.5.5 0 00-.5-.5H7a.5.5 0 00-.5.5v3.5"
        stroke={props.color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default SvgComponent;

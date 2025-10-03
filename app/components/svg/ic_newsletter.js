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
        d="M2 6v6.5a.5.5 0 00.5.5h11a.5.5 0 00.5-.5V6L8 2 2 6zM6.906 9.5l-4.75 3.356M13.844 12.856L9.094 9.5"
        stroke={props.color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M14 6L9.094 9.5H6.906L2 6" stroke={props.color} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export default SvgComponent;

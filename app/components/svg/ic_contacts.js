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
        d="M12.5 14h-9a.5.5 0 01-.5-.5v-11a.5.5 0 01.5-.5h6L13 5.5v8a.5.5 0 01-.5.5z"
        stroke={props.color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9.5 2v3.5H13M6.25 9.25L8 7.5l1.75 1.75M8 11.5v-4"
        stroke={props.color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default SvgComponent;

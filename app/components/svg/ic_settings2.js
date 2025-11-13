import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function SvgComponent(props) {
  return (
    <Svg
      width={props.size}
      height={props.size}
      viewBox="0 0 18 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M14.25 3a.75.75 0 01.75-.75h2.25a.75.75 0 110 1.5H15a.75.75 0 01-.75-.75zm-13.5.75h9v1.5a.75.75 0 00.75.75H12a.75.75 0 00.75-.75V.75A.75.75 0 0012 0h-1.5a.75.75 0 00-.75.75v1.5h-9a.75.75 0 000 1.5zm16.5 7.5H9a.75.75 0 100 1.5h8.25a.75.75 0 100-1.5zM6 9H4.5a.75.75 0 00-.75.75v1.5h-3a.75.75 0 100 1.5h3v1.5a.75.75 0 00.75.75H6a.75.75 0 00.75-.75v-4.5A.75.75 0 006 9z"
        fill={props.color}
      />
    </Svg>
  );
}

export default SvgComponent;

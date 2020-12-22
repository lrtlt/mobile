import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function SvgComponent(props) {
  return (
    <Svg height={props.size} viewBox="0 0 459 459" width={props.size} {...props}>
      <Path
        fill={props.color}
        d="M178.5 382.5h102v-51h-102v51zM0 76.5v51h459v-51H0zM76.5 255h306v-51h-306v51z"
      />
    </Svg>
  );
}

export default SvgComponent;

import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function SvgComponent(props) {
  return (
    <Svg viewBox="0 0 24 24" width={props.size} height={props.size} {...props}>
      <Path
        fill={props.color}
        strokeWidth={0.6}
        stroke={props.color}
        d="M12 .5a11.496 11.496 0 00-8.249 19.507 11.489 11.489 0 0016.497.002A11.497 11.497 0 0012 .5zm7.53 18.813a10.489 10.489 0 01-15.062-.002A10.498 10.498 0 1122.5 12a10.415 10.415 0 01-2.97 7.313z"
      />
      <Path
        fill={props.color}
        strokeWidth={0.5}
        stroke={props.color}
        d="M12 5.5a4 4 0 104 4 4.004 4.004 0 00-4-4zm0 7a3 3 0 113-3 3.003 3.003 0 01-3 3z"
      />
      <Path
        fill={props.color}
        strokeWidth={0.5}
        stroke={props.color}
        d="M12 12.5a8.476 8.476 0 00-8.383 7.077.5.5 0 00.134.43 11.488 11.488 0 0016.498 0 .497.497 0 00.133-.432 8.578 8.578 0 00-2.37-4.59A8.484 8.484 0 0012 12.5zm0 10a10.375 10.375 0 01-7.35-3.005 7.508 7.508 0 0112.655-3.803 7.573 7.573 0 012.045 3.804A10.378 10.378 0 0112 22.5z"
      />
    </Svg>
  );
}

export default SvgComponent;

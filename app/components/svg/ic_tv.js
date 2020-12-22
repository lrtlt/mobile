import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function SvgComponent(props) {
  return (
    <Svg viewBox="0 0 512 512" width={props.size} height={props.size} {...props}>
      <Path
        fill={props.color}
        d="M480.6 424.2H31.4c-11.3 0-20.4-9.1-20.4-20.4V31.4C11 20.1 20.1 11 31.4 11h449.2c11.3 0 20.4 9.1 20.4 20.4v372.3c0 11.3-9.1 20.5-20.4 20.5zM51.8 383.3h408.3V51.8H51.8v331.5zM391.3 501H113.8c-11.3 0-20.4-9.1-20.4-20.4 0-11.3 9.1-20.4 20.4-20.4h277.5c11.3 0 20.4 9.1 20.4 20.4 0 11.3-9.1 20.4-20.4 20.4z"
      />
      <Path
        fill={props.color}
        d="M164.5 295.1V158.4h-51.1v-18.3h122.9v18.3H185v136.7h-20.5zM316.9 295.1l-60.1-155H279l40.3 112.6c3.2 9 6 17.5 8.1 25.4 2.4-8.5 5.2-16.9 8.4-25.4l41.9-112.6h20.9l-60.7 155h-21z"
      />
    </Svg>
  );
}

export default SvgComponent;

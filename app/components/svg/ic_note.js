import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function SvgComponent(props) {
  return (
    <Svg viewBox="0 0 477.867 477.867" width={props.size} height={props.size} {...props}>
      <Path
        fill={props.color}
        d="M472.184 4.347a17.326 17.326 0 00-13.261-4.25l-307.2 34.133c-8.647.957-15.19 8.265-15.189 16.964V355.34a98.75 98.75 0 00-51.2-14.012C38.281 341.329 0 371.946 0 409.595s38.281 68.267 85.333 68.267 85.333-30.601 85.333-68.267V151.889l273.067-30.413v199.68a98.755 98.755 0 00-51.2-13.961c-47.053 0-85.333 30.618-85.333 68.267s38.281 68.267 85.333 68.267 85.333-30.601 85.333-68.267v-358.4c0-4.854-2.066-9.478-5.682-12.715z"
      />
    </Svg>
  );
}

export default SvgComponent;

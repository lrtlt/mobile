import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function SvgComponent(props) {
  return (
    <Svg viewBox="0 0 256 256" width={props.size} height={props.size} {...props}>
      <Path
        fill={props.color}
        d="M199.81 34a16 16 0 00-16.24.43L64 109.23V40a8 8 0 00-16 0v176a8 8 0 0016 0v-69.23l119.57 74.78A15.95 15.95 0 00208 208.12V47.88A15.86 15.86 0 00199.81 34zM192 208L64.16 128 192 48.07z"
      />
    </Svg>
  );
}

export default SvgComponent;
